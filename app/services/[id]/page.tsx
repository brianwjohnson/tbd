import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicServiceProvider } from "@/domain/services/services-dto";
import { createClient } from "@/utils/supabase/server";

export default async function ServiceProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const provider = await getPublicServiceProvider(id, supabase);
  if (!provider) notFound();

  return (
    <main className="min-h-screen bg-[#eef0f5] px-4 py-10 text-[#0f172a] md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/services" className="text-sm font-semibold text-[#2563eb]">← All services</Link>
        <section className="mt-5 rounded-3xl bg-white px-6 py-8 shadow-sm md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#64748b]">Service provider</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{provider.display_name}</h1>
          {provider.bio && <p className="mt-4 max-w-2xl text-base leading-7 text-[#64748b]">{provider.bio}</p>}
          {provider.profile?.website && (
            <a href={provider.profile.website} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-[#2563eb]">
              Visit website →
            </a>
          )}
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="text-2xl font-semibold">Services offered</h2>
          {provider.offerings.map((offering) => (
            <article key={offering.id} className="rounded-3xl bg-white px-6 py-6 shadow-sm md:px-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">{formatServiceType(offering.service_type)}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{offering.name}</h3>
                  {offering.description && <p className="mt-3 max-w-2xl leading-7 text-[#64748b]">{offering.description}</p>}
                </div>
                {offering.price && (
                  <p className="text-lg font-semibold">{formatPrice(offering.price.amount_cents, offering.price.currency_code)} <span className="text-sm font-normal text-[#64748b]">/ {offering.price.unit_label}</span></p>
                )}
              </div>
              <div className="mt-5 grid gap-4 border-t border-[#e2e8f0] pt-5 text-sm text-[#475569] sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-[#0f172a]">Location</p>
                  <p className="mt-1">{locationLabel(offering.location)}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#0f172a]">Availability</p>
                  <p className="mt-1">{availabilityLabel(offering.availability)}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function formatPrice(amountCents: number, currencyCode: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(amountCents / 100);
}

function formatServiceType(value: string) {
  return value.replace(/_/g, " ");
}

function locationLabel(location: { location_type: string; city: string | null; state: string | null } | null) {
  if (!location) return "Location details available from provider";
  if (location.location_type === "virtual") return "Virtual service";
  if (location.location_type === "mobile") return "Mobile service";
  return [location.city, location.state].filter(Boolean).join(", ") || "Location details available from provider";
}

function availabilityLabel(rules: Array<{ day_of_week: number; start_time: string; end_time: string }>) {
  if (!rules.length) return "By appointment";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const uniqueDays = [...new Set(rules.map((rule) => days[rule.day_of_week]))];
  const first = rules[0];
  return `${uniqueDays.join(", ")} · ${first.start_time.slice(0, 5)}–${first.end_time.slice(0, 5)}`;
}
