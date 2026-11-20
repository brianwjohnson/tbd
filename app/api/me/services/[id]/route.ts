import { NextResponse } from "next/server";
import {
  updateMyService,
  updateMyServiceStatus,
  type CreateServiceInput,
} from "@/domain/services/services-dto";
import { createApiClient } from "@/utils/supabase/route";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createApiClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const record = body && typeof body === "object" ? (body as Record<string, unknown>) : null;
    const status = record?.status;
    if (typeof status === "string") {
      if (!["draft", "published", "paused", "archived"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      await updateMyServiceStatus(
        user.id,
        id,
        status as "draft" | "published" | "paused" | "archived",
        supabase,
      );
      return NextResponse.json({ ok: true });
    }

    const input = parseDetails(body);
    if (!input) return NextResponse.json({ error: "Invalid service details" }, { status: 400 });
    return NextResponse.json({ service: await updateMyService(user.id, id, input, supabase) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

function parseDetails(body: unknown): CreateServiceInput | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const location = record.location;
  const availability = record.availability;
  if (
    typeof record.name !== "string" ||
    record.serviceType !== "skate_sharpening" ||
    typeof record.amountCents !== "number" ||
    !Number.isInteger(record.amountCents) ||
    record.amountCents < 0 ||
    typeof record.unitLabel !== "string" ||
    !location ||
    typeof location !== "object" ||
    !Array.isArray(availability)
  ) return null;

  const locationRecord = location as Record<string, unknown>;
  const locationTypes = ["at_provider", "mobile", "virtual", "custom"];
  if (typeof locationRecord.locationType !== "string" || !locationTypes.includes(locationRecord.locationType)) return null;

  const rules = availability.map((item) => (item && typeof item === "object" ? item as Record<string, unknown> : null));
  if (rules.some((rule) =>
    !rule ||
    typeof rule.dayOfWeek !== "number" ||
    !Number.isInteger(rule.dayOfWeek) ||
    rule.dayOfWeek < 0 ||
    rule.dayOfWeek > 6 ||
    typeof rule.startTime !== "string" ||
    typeof rule.endTime !== "string" ||
    typeof rule.timezone !== "string"
  )) return null;

  return {
    name: record.name.trim(),
    description: typeof record.description === "string" ? record.description.trim() || null : null,
    serviceType: "skate_sharpening",
    amountCents: record.amountCents,
    unitLabel: record.unitLabel.trim() || "service",
    location: {
      locationType: locationRecord.locationType as CreateServiceInput["location"]["locationType"],
      label: typeof locationRecord.label === "string" ? locationRecord.label.trim() || null : null,
      address1: typeof locationRecord.address1 === "string" ? locationRecord.address1.trim() || null : null,
      city: typeof locationRecord.city === "string" ? locationRecord.city.trim() || null : null,
      state: typeof locationRecord.state === "string" ? locationRecord.state.trim() || null : null,
      postal: typeof locationRecord.postal === "string" ? locationRecord.postal.trim() || null : null,
    },
    availability: rules.map((rule) => ({
      dayOfWeek: rule?.dayOfWeek as number,
      startTime: rule?.startTime as string,
      endTime: rule?.endTime as string,
      timezone: rule?.timezone as string,
    })),
  };
}
