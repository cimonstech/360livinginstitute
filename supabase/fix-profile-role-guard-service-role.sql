-- Allow service_role to update profiles.role (needed for server-side profile bootstrap).
-- Run in Supabase SQL Editor if you already applied security-hardening.sql without this bypass.

create or replace function public.prevent_non_admin_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if coalesce(auth.role(), '') = 'service_role' then
      return new;
    end if;
    if not public.is_admin() then
      raise exception 'Role cannot be changed';
    end if;
  end if;
  return new;
end;
$$;
