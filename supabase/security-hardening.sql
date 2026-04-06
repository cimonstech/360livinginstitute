-- 360 Living Institute — security hardening (run in Supabase SQL editor)
-- Uses public.is_admin() for profile policies to avoid RLS recursion (42P17).

-- ── Profiles: users cannot escalate own role (trigger; avoids brittle WITH CHECK subqueries)
create or replace function public.prevent_non_admin_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    -- PostgREST / Supabase service_role (e.g. server bootstrap) may change role
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

drop trigger if exists profiles_role_guard on public.profiles;
create trigger profiles_role_guard
  before update on public.profiles
  for each row execute function public.prevent_non_admin_role_change();

-- Tighten profile visibility: self or admin only (replaces separate admin + self policies)
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can view own profile only" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Users can view own profile only" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- Optional: rate-limit pending bookings per email (adjust cap as needed)
create or replace function public.check_appointment_limit()
returns trigger
language plpgsql
as $$
declare
  pending_count integer;
begin
  select count(*) into pending_count
  from public.appointments
  where client_email = new.client_email
    and status = 'pending';

  if pending_count >= 3 then
    raise exception 'You already have 3 pending bookings. Please wait for them to be confirmed before booking again.';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_appointment_limit on public.appointments;
create trigger enforce_appointment_limit
  before insert on public.appointments
  for each row execute function public.check_appointment_limit();
