begin;

create or replace function public.create_my_service_provider(
  p_display_name text,
  p_bio text default null
)
returns public.service_providers
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_provider public.service_providers;
begin
  if v_user_id is null then
    raise exception 'Authenticated user is required';
  end if;

  insert into public.service_providers (profile_id, display_name, bio)
  values (
    v_user_id,
    coalesce(nullif(trim(p_display_name), ''), 'Service provider'),
    nullif(trim(p_bio), '')
  )
  on conflict (profile_id) where profile_id is not null do update
    set display_name = excluded.display_name,
        bio = excluded.bio
  returning * into v_provider;

  return v_provider;
end;
$$;

revoke all on function public.create_my_service_provider(text, text) from public;
grant execute on function public.create_my_service_provider(text, text) to authenticated;

commit;
