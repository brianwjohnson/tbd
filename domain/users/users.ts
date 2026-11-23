import "server-only";

import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "@/app/data/auth";
import type { EntityUser, EntityUserRole, Profile } from "@/domain/entities/types";

type EntityUserRow = {
  id: string;
  entity_id: string;
  user_id: string;
  role: EntityUserRole;
  status?: EntityUser["status"];
  created_at?: string | null;
  entities?:
    | {
        entity_type?: EntityUser["entity_type"] | null;
        name?: string | null;
      }[]
    | {
        entity_type?: EntityUser["entity_type"] | null;
        name?: string | null;
      }
    | null;
};

type ProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  website: string | null;
  username: string | null;
  avatar_url: string | null;
  full_name: string | null;
  updated_at: string | null;
  // In DB this is often `role` or similar; we map it to `global_role` in the Profile type.
  role: Profile["global_role"];
  address: Profile["address"];
  phone_number: Profile["phone_number"];
};

type ProfileRowWithEntityUsers = ProfileRow & {
  entity_users: EntityUserRow[] | null;
};

const mapEntityUsers = (
  rows: EntityUserRow[] | null | undefined,
): EntityUser[] =>
  (rows ?? []).map((eu) => {
    const entity = Array.isArray(eu.entities) ? eu.entities[0] : eu.entities;
    return {
      id: String(eu.id),
      entity_id: String(eu.entity_id),
      user_id: String(eu.user_id),
      role: (eu.role as EntityUserRole) ?? "viewer",
      status: (eu.status as EntityUser["status"]) ?? null,
      created_at: eu.created_at ?? null,
      updated_at: null,
      entity_type: entity?.entity_type ?? undefined,
      entity_name: entity?.name ?? null,
    };
  });

export async function getAllUsers(): Promise<Profile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      entity_users:entity_users (
        id,
        entity_id,
        user_id,
        role,
        status,
        created_at,
        entities:entities (
          entity_type,
          name
        )
      )
    `,
    );

  if (error) throw new Error(`Failed to load profiles: ${error.message}`);

  return (data ?? []).map((u) => {
    const row = u as unknown as ProfileRowWithEntityUsers;
    return {
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      website: row.website,
      username: row.username,
      avatar_url: row.avatar_url,
      full_name: row.full_name,
      updated_at: row.updated_at,
      entity_users: mapEntityUsers(row.entity_users),
      global_role: row.role ?? null,
      address: row.address ?? null,
      phone_number: row.phone_number ?? null,
    };
  });
}

export async function getUser(id: string): Promise<Profile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      entity_users:entity_users (
        id,
        entity_id,
        user_id,
        role,
        status,
        created_at,
        entities:entities (
          entity_type,
          name
        )
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load profile: ${error.message}`);
  }
  if (!data) {
    throw new Error("Profile not found");
  }

  const row = data as unknown as ProfileRowWithEntityUsers;

  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    website: row.website,
    username: row.username,
    avatar_url: row.avatar_url,
    full_name: row.full_name,
    updated_at: row.updated_at,
    entity_users: mapEntityUsers(row.entity_users),
    global_role: row.role ?? null,
    address: row.address ?? null,
    phone_number: row.phone_number ?? null,
  };
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    return await getUser(user.id);
  } catch (err) {
    console.error("Failed to load current profile:", err);
    return null;
  }
}

export async function assignUserToDistrict(userId: string, districtId: string) {
  const supabase = await createClient();

  const { data: existing, error: existingError } = await supabase
    .from("entity_users")
    .select("id")
    .eq("entity_id", districtId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Failed to check entity_users: ${existingError.message}`);
  }

  if (existing?.id) {
    const { error } = await supabase
      .from("entity_users")
      .update({ role: "admin" })
      .eq("id", existing.id);

    if (error) {
      throw new Error(`Failed to update entity_user role: ${error.message}`);
    }
  } else {
    const { error } = await supabase.from("entity_users").insert({
      user_id: userId,
      entity_id: districtId,
      role: "admin",
    });

    if (error) {
      throw new Error(`Failed to insert entity_user: ${error.message}`);
    }
  }

  return { success: true };
}
