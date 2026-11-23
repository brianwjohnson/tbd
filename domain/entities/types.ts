// Core entity/user primitives for shared domain usage.
export const ENTITY_TYPES = [
  "district",
  "nonprofit",
  "business",
  "state",
  "school",
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];
export type EntityUserRole = "admin" | "editor" | "viewer" | "employee";
export type EntityUserStatus = "active" | "invited" | "removed" | null;

export interface Profile {
  id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  updated_at: string | null;
  username: string | null;
  avatar_url: string | null;
  website: string | null;
  entity_users?: EntityUser[];
  global_role: string | null;
  address: string | null;
  phone_number: string | null;
}

export type ProfilePreview = Partial<Profile> & { id: string };

export interface EntityUser {
  id: string;
  entity_type?: EntityType;
  entity_id: string;
  entity_name?: string | null;
  user_id: string;
  role: EntityUserRole;
  status?: EntityUserStatus;
  created_at?: string | null;
  updated_at?: string | null;
  profile?: ProfilePreview | null;
}

// Optional UI helper for role selection widgets
export const RoleOptions = {
  business: [] as const,
  district: [] as const,
};
