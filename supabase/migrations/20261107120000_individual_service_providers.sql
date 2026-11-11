begin;

create table if not exists public.service_providers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  entity_id uuid references public.entities(id) on delete cascade,
  display_name text not null,
  bio text,
  slug text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_providers_single_owner_chk check (
    (profile_id is not null and entity_id is null)
    or (profile_id is null and entity_id is not null)
  )
);

create unique index if not exists service_providers_profile_uidx
  on public.service_providers(profile_id)
  where profile_id is not null;

create unique index if not exists service_providers_entity_uidx
  on public.service_providers(entity_id)
  where entity_id is not null;

create unique index if not exists service_providers_slug_uidx
  on public.service_providers(slug)
  where slug is not null;

create index if not exists service_providers_status_idx
  on public.service_providers(status);

create table if not exists public.service_offerings (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.service_providers(id) on delete cascade,
  service_type text not null
    check (service_type in ('skate_sharpening')),
  name text not null,
  description text,
  configuration jsonb not null default '{}'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_offerings_provider_idx
  on public.service_offerings(provider_id, status);

create table if not exists public.service_offering_prices (
  id uuid primary key default gen_random_uuid(),
  service_offering_id uuid not null references public.service_offerings(id) on delete cascade,
  amount_cents integer not null check (amount_cents >= 0),
  currency_code text not null default 'USD'
    check (currency_code = upper(currency_code) and length(currency_code) = 3),
  unit_label text not null default 'service',
  is_default boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists service_offering_prices_default_uidx
  on public.service_offering_prices(service_offering_id)
  where is_default;

create table if not exists public.service_availability_rules (
  id uuid primary key default gen_random_uuid(),
  service_offering_id uuid not null references public.service_offerings(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  timezone text not null default 'America/Chicago',
  effective_from date,
  effective_until date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint service_availability_time_order_chk check (end_time > start_time),
  constraint service_availability_date_order_chk check (
    effective_until is null or effective_from is null or effective_until >= effective_from
  )
);

create index if not exists service_availability_offering_idx
  on public.service_availability_rules(service_offering_id, day_of_week);

create table if not exists public.service_locations (
  id uuid primary key default gen_random_uuid(),
  service_offering_id uuid not null references public.service_offerings(id) on delete cascade,
  location_type text not null default 'custom'
    check (location_type in ('at_provider', 'mobile', 'virtual', 'custom')),
  label text,
  address1 text,
  address2 text,
  city text,
  state text,
  postal text,
  country text not null default 'US',
  latitude double precision,
  longitude double precision,
  is_primary boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists service_locations_primary_uidx
  on public.service_locations(service_offering_id)
  where is_primary;

create index if not exists service_locations_offering_idx
  on public.service_locations(service_offering_id, is_active);

create or replace function public.can_manage_service_provider(
  p_provider_id uuid,
  p_user_id uuid default auth.uid()
) returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.service_providers sp
    where sp.id = p_provider_id
      and (
        sp.profile_id = p_user_id
        or public.is_global_admin(p_user_id)
        or (sp.entity_id is not null and public.is_entity_admin(p_user_id, sp.entity_id))
      )
  );
$$;

revoke all on function public.can_manage_service_provider(uuid, uuid) from public;
grant execute on function public.can_manage_service_provider(uuid, uuid) to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists service_providers_updated_at on public.service_providers;
create trigger service_providers_updated_at
before update on public.service_providers
for each row execute function public.set_updated_at();

drop trigger if exists service_offerings_updated_at on public.service_offerings;
create trigger service_offerings_updated_at
before update on public.service_offerings
for each row execute function public.set_updated_at();

drop trigger if exists service_offering_prices_updated_at on public.service_offering_prices;
create trigger service_offering_prices_updated_at
before update on public.service_offering_prices
for each row execute function public.set_updated_at();

drop trigger if exists service_locations_updated_at on public.service_locations;
create trigger service_locations_updated_at
before update on public.service_locations
for each row execute function public.set_updated_at();

alter table public.service_providers enable row level security;
alter table public.service_offerings enable row level security;
alter table public.service_offering_prices enable row level security;
alter table public.service_availability_rules enable row level security;
alter table public.service_locations enable row level security;

grant select on public.service_providers to anon, authenticated;
grant select on public.service_offerings to anon, authenticated;
grant select on public.service_offering_prices to anon, authenticated;
grant select on public.service_availability_rules to anon, authenticated;
grant select on public.service_locations to anon, authenticated;
grant insert, update, delete on public.service_providers to authenticated;
grant insert, update, delete on public.service_offerings to authenticated;
grant insert, update, delete on public.service_offering_prices to authenticated;
grant insert, update, delete on public.service_availability_rules to authenticated;
grant insert, update, delete on public.service_locations to authenticated;

drop policy if exists service_providers_public_read on public.service_providers;
create policy service_providers_public_read
on public.service_providers for select to anon, authenticated
using (status = 'published');

drop policy if exists service_providers_owner_read on public.service_providers;
create policy service_providers_owner_read
on public.service_providers for select to authenticated
using (public.can_manage_service_provider(id));

drop policy if exists service_providers_owner_insert on public.service_providers;
create policy service_providers_owner_insert
on public.service_providers for insert to authenticated
with check (
  (profile_id = auth.uid() and entity_id is null)
  or public.is_global_admin(auth.uid())
);

drop policy if exists service_providers_owner_update on public.service_providers;
create policy service_providers_owner_update
on public.service_providers for update to authenticated
using (public.can_manage_service_provider(id))
with check (public.can_manage_service_provider(id));

drop policy if exists service_providers_owner_delete on public.service_providers;
create policy service_providers_owner_delete
on public.service_providers for delete to authenticated
using (public.can_manage_service_provider(id));

drop policy if exists service_offerings_public_read on public.service_offerings;
create policy service_offerings_public_read
on public.service_offerings for select to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1 from public.service_providers sp
    where sp.id = provider_id and sp.status = 'published'
  )
);

drop policy if exists service_offerings_owner_access on public.service_offerings;
create policy service_offerings_owner_access
on public.service_offerings for all to authenticated
using (public.can_manage_service_provider(provider_id))
with check (public.can_manage_service_provider(provider_id));

drop policy if exists service_offering_prices_public_read on public.service_offering_prices;
create policy service_offering_prices_public_read
on public.service_offering_prices for select to anon, authenticated
using (
  exists (
    select 1
    from public.service_offerings so
    join public.service_providers sp on sp.id = so.provider_id
    where so.id = service_offering_id
      and so.status = 'published'
      and sp.status = 'published'
  )
);

drop policy if exists service_offering_prices_owner_access on public.service_offering_prices;
create policy service_offering_prices_owner_access
on public.service_offering_prices for all to authenticated
using (
  exists (
    select 1 from public.service_offerings so
    where so.id = service_offering_id
      and public.can_manage_service_provider(so.provider_id)
  )
)
with check (
  exists (
    select 1 from public.service_offerings so
    where so.id = service_offering_id
      and public.can_manage_service_provider(so.provider_id)
  )
);

drop policy if exists service_availability_public_read on public.service_availability_rules;
create policy service_availability_public_read
on public.service_availability_rules for select to anon, authenticated
using (
  is_active
  and exists (
    select 1
    from public.service_offerings so
    join public.service_providers sp on sp.id = so.provider_id
    where so.id = service_offering_id
      and so.status = 'published'
      and sp.status = 'published'
  )
);

drop policy if exists service_availability_owner_access on public.service_availability_rules;
create policy service_availability_owner_access
on public.service_availability_rules for all to authenticated
using (
  exists (
    select 1 from public.service_offerings so
    where so.id = service_offering_id
      and public.can_manage_service_provider(so.provider_id)
  )
)
with check (
  exists (
    select 1 from public.service_offerings so
    where so.id = service_offering_id
      and public.can_manage_service_provider(so.provider_id)
  )
);

drop policy if exists service_locations_public_read on public.service_locations;
create policy service_locations_public_read
on public.service_locations for select to anon, authenticated
using (
  is_active
  and exists (
    select 1
    from public.service_offerings so
    join public.service_providers sp on sp.id = so.provider_id
    where so.id = service_offering_id
      and so.status = 'published'
      and sp.status = 'published'
  )
);

drop policy if exists service_locations_owner_access on public.service_locations;
create policy service_locations_owner_access
on public.service_locations for all to authenticated
using (
  exists (
    select 1 from public.service_offerings so
    where so.id = service_offering_id
      and public.can_manage_service_provider(so.provider_id)
  )
)
with check (
  exists (
    select 1 from public.service_offerings so
    where so.id = service_offering_id
      and public.can_manage_service_provider(so.provider_id)
  )
);

commit;
