import { NextResponse } from "next/server";
import {
  createMyService,
  getMyServices,
  type CreateServiceInput,
} from "@/domain/services/services-dto";
import { createApiClient } from "@/utils/supabase/route";

async function currentUserId() {
  const supabase = await createApiClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return NextResponse.json(await getMyServices(userId));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load services" }, { status: 500 });
  }
}

function parseInput(body: unknown): CreateServiceInput | null {
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
  ) {
    return null;
  }

  const locationRecord = location as Record<string, unknown>;
  const validLocationTypes = ["at_provider", "mobile", "virtual", "custom"];
  if (
    typeof locationRecord.locationType !== "string" ||
    !validLocationTypes.includes(locationRecord.locationType)
  ) {
    return null;
  }

  const validAvailability = availability.every((item) => {
    if (!item || typeof item !== "object") return false;
    const rule = item as Record<string, unknown>;
    return (
      typeof rule.dayOfWeek === "number" &&
      Number.isInteger(rule.dayOfWeek) &&
      rule.dayOfWeek >= 0 &&
      rule.dayOfWeek <= 6 &&
      typeof rule.startTime === "string" &&
      typeof rule.endTime === "string" &&
      typeof rule.timezone === "string"
    );
  });
  if (!validAvailability) return null;

  return {
    name: record.name.trim(),
    description: typeof record.description === "string" ? record.description.trim() || null : null,
    serviceType: "skate_sharpening",
    amountCents: record.amountCents,
    unitLabel: record.unitLabel.trim() || "service",
    status: record.status === "published" ? "published" : "draft",
    location: {
      locationType: locationRecord.locationType as CreateServiceInput["location"]["locationType"],
      label: typeof locationRecord.label === "string" ? locationRecord.label.trim() || null : null,
      address1: typeof locationRecord.address1 === "string" ? locationRecord.address1.trim() || null : null,
      city: typeof locationRecord.city === "string" ? locationRecord.city.trim() || null : null,
      state: typeof locationRecord.state === "string" ? locationRecord.state.trim() || null : null,
      postal: typeof locationRecord.postal === "string" ? locationRecord.postal.trim() || null : null,
    },
    availability: availability.map((item) => {
      const rule = item as Record<string, unknown>;
      return {
        dayOfWeek: rule.dayOfWeek as number,
        startTime: rule.startTime as string,
        endTime: rule.endTime as string,
        timezone: rule.timezone as string,
      };
    }),
  };
}

export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = parseInput(body);
  if (!input || !input.name) {
    return NextResponse.json({ error: "Invalid service details" }, { status: 400 });
  }

  try {
    return NextResponse.json({ service: await createMyService(userId, input) }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
