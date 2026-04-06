-- Fix PostgreSQL error 42P17: infinite recursion detected in policy for relation "profiles"
-- Cause: policies used EXISTS (SELECT ... FROM profiles ...) which re-triggers profiles RLS.
-- Run this in Supabase → SQL Editor (safe to run multiple times).

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles for select using (public.is_admin());

drop policy if exists "Admins can manage services" on public.services;
create policy "Admins can manage services" on public.services for all using (public.is_admin());

drop policy if exists "Admins can manage availability" on public.availability;
create policy "Admins can manage availability" on public.availability for all using (public.is_admin());

drop policy if exists "Admins can manage blackout dates" on public.blackout_dates;
create policy "Admins can manage blackout dates" on public.blackout_dates for all using (public.is_admin());

drop policy if exists "Admins can manage all appointments" on public.appointments;
create policy "Admins can manage all appointments" on public.appointments for all using (public.is_admin());

drop policy if exists "Admins can view email logs" on public.email_logs;
create policy "Admins can view email logs" on public.email_logs for select using (public.is_admin());
