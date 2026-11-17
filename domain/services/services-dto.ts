import "server-only";

import type { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

type ProviderRow = Database["public"]["Tables"]["service_providers"]["Row"];
type OfferingRow = Database["public"]["Tables"]["service_offerings"]["Row"];
type PriceRow = Database["public"]["Tables"]["service_offering_prices"]["Row"];
type AvailabilityRow =
  Database["public"]["Tables"]["service_availability_rules"]["Row"];
type LocationRow = Database["public"]["Tables"]["service_locations"]["Row"];

export type ServiceOffering = OfferingRow & {
  price: PriceRow | null;
  availability: AvailabilityRow[];
  location: LocationRow | null;
};

export type MyServices = {
  provider: ProviderRow | null;
  offerings: ServiceOffering[];
};

export type CreateServiceInput = {
  name: string;
  description: string | null;
  serviceType: "skate_sharpening";
  amountCents: number;
  unitLabel: string;
  status?: "draft" | "published";
  location: {
    locationType: "at_provider" | "mobile" | "virtual" | "custom";
    label: string | null;
    address1: string | null;
    city: string | null;
    state: string | null;
    postal: string | null;
  };
  availability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    timezone: string;
  }>;
};

async function getOwnedProvider(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<ProviderRow | null> {
  const { data, error } = await supabase
    .from("service_providers")
    .select("*")
    .eq("profile_id", userId)
    .maybeSingle();

  if (error) throw new Error(`Failed to load service provider: ${error.message}`);
  return data;
}

async function loadOfferings(
  supabase: Awaited<ReturnType<typeof createClient>>,
  providerId: string,
): Promise<ServiceOffering[]> {
  const { data: offerings, error: offeringsError } = await supabase
    .from("service_offerings")
    .select("*")
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });

  if (offeringsError) {
    throw new Error(`Failed to load services: ${offeringsError.message}`);
  }

  const result: ServiceOffering[] = [];
  for (const offering of offerings ?? []) {
    const [priceResult, availabilityResult, locationResult] = await Promise.all([
      supabase
        .from("service_offering_prices")
        .select("*")
        .eq("service_offering_id", offering.id)
        .eq("is_default", true)
        .maybeSingle(),
      supabase
        .from("service_availability_rules")
        .select("*")
        .eq("service_offering_id", offering.id)
        .eq("is_active", true)
        .order("day_of_week", { ascending: true }),
      supabase
        .from("service_locations")
        .select("*")
        .eq("service_offering_id", offering.id)
        .eq("is_primary", true)
        .maybeSingle(),
    ]);

    if (priceResult.error) throw new Error(priceResult.error.message);
    if (availabilityResult.error) throw new Error(availabilityResult.error.message);
    if (locationResult.error) throw new Error(locationResult.error.message);

    result.push({
      ...offering,
      price: priceResult.data,
      availability: availabilityResult.data ?? [],
      location: locationResult.data,
    });
  }

  return result;
}

export async function getMyServices(userId: string): Promise<MyServices> {
  const supabase = await createClient();
  const provider = await getOwnedProvider(supabase, userId);
  if (!provider) return { provider: null, offerings: [] };
  return { provider, offerings: await loadOfferings(supabase, provider.id) };
}

export async function createMyService(
  userId: string,
  input: CreateServiceInput,
): Promise<ServiceOffering> {
  const supabase = await createClient();
  let provider = await getOwnedProvider(supabase, userId);

  if (!provider) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, first_name, last_name")
      .eq("id", userId)
      .single();
    if (profileError) throw new Error(profileError.message);

    const displayName =
      profile.full_name ??
      [profile.first_name, profile.last_name].filter(Boolean).join(" ") ??
      "Service provider";

    const { data: createdProvider, error: providerError } = await supabase
      .from("service_providers")
      .insert({ profile_id: userId, display_name: displayName || "Service provider" })
      .select("*")
      .single();
    if (providerError) throw new Error(providerError.message);
    provider = createdProvider;
  }

  const { data: offering, error: offeringError } = await supabase
    .from("service_offerings")
    .insert({
      provider_id: provider.id,
      service_type: input.serviceType,
      name: input.name,
      description: input.description,
      status: input.status ?? "draft",
    })
    .select("*")
    .single();
  if (offeringError) throw new Error(offeringError.message);

  const { error: priceError } = await supabase
    .from("service_offering_prices")
    .insert({
      service_offering_id: offering.id,
      amount_cents: input.amountCents,
      unit_label: input.unitLabel,
    });
  if (priceError) throw new Error(priceError.message);

  const { error: locationError } = await supabase
    .from("service_locations")
    .insert({
      service_offering_id: offering.id,
      location_type: input.location.locationType,
      label: input.location.label,
      address1: input.location.address1,
      city: input.location.city,
      state: input.location.state,
      postal: input.location.postal,
    });
  if (locationError) throw new Error(locationError.message);

  if (input.availability.length > 0) {
    const { error: availabilityError } = await supabase
      .from("service_availability_rules")
      .insert(
        input.availability.map((rule) => ({
          service_offering_id: offering.id,
          day_of_week: rule.dayOfWeek,
          start_time: rule.startTime,
          end_time: rule.endTime,
          timezone: rule.timezone,
        })),
      );
    if (availabilityError) throw new Error(availabilityError.message);
  }

  if (input.status === "published" && provider.status !== "published") {
    const { error: providerStatusError } = await supabase
      .from("service_providers")
      .update({ status: "published" })
      .eq("id", provider.id);
    if (providerStatusError) throw new Error(providerStatusError.message);
  }

  const services = await loadOfferings(supabase, provider.id);
  const created = services.find((service) => service.id === offering.id);
  if (!created) throw new Error("Created service could not be reloaded");
  return created;
}

export async function updateMyServiceStatus(
  userId: string,
  serviceId: string,
  status: "draft" | "published" | "paused" | "archived",
): Promise<void> {
  const supabase = await createClient();
  const { data: offering, error: offeringError } = await supabase
    .from("service_offerings")
    .select("provider_id")
    .eq("id", serviceId)
    .single();
  if (offeringError) throw new Error(offeringError.message);

  const provider = await getOwnedProvider(supabase, userId);
  if (!provider || provider.id !== offering.provider_id) {
    throw new Error("Not authorized");
  }

  const { error } = await supabase
    .from("service_offerings")
    .update({ status })
    .eq("id", serviceId);
  if (error) throw new Error(error.message);

  if (status === "published" && provider.status !== "published") {
    const { error: providerError } = await supabase
      .from("service_providers")
      .update({ status: "published" })
      .eq("id", provider.id);
    if (providerError) throw new Error(providerError.message);
  }
}
