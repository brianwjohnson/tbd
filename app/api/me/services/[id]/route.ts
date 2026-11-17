import { NextResponse } from "next/server";
import { updateMyServiceStatus } from "@/domain/services/services-dto";
import { createApiClient } from "@/utils/supabase/route";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
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

  const status =
    body && typeof body === "object" && "status" in body
      ? (body as { status?: unknown }).status
      : null;
  if (!['draft', 'published', 'paused', 'archived'].includes(String(status))) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    await updateMyServiceStatus(
      user.id,
      params.id,
      status as "draft" | "published" | "paused" | "archived",
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}
