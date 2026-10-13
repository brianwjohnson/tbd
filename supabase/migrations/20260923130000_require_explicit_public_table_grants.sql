begin;

-- Supabase no longer automatically exposes newly created public-schema tables
-- through the Data API. The baseline predates that behavior and set broad
-- default table privileges, which would make a fresh `supabase db reset`
-- behave differently from a new hosted project.
--
-- These statements affect only tables created after this migration. Existing
-- table grants are intentionally unchanged. Every future public table must
-- declare its required API access explicitly in the migration that creates it,
-- for example:
--
--   grant select on table public.example to anon, authenticated;
--   grant insert, update, delete on table public.example to authenticated;
--   grant all on table public.example to service_role;
alter default privileges for role postgres in schema public
  revoke all on tables from anon;

alter default privileges for role postgres in schema public
  revoke all on tables from authenticated;

alter default privileges for role postgres in schema public
  revoke all on tables from service_role;

commit;
