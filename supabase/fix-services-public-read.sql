-- Run in Supabase → SQL Editor if the booking wizard cannot load services
-- (Table Editor shows data because it uses the postgres role, which bypasses RLS.)

-- 0) If services was created without is_active, add it (matches schema.sql)
alter table public.services
  add column if not exists is_active boolean default true;

-- 1) Explicit grants (safe to run multiple times)
grant usage on schema public to anon, authenticated;
grant select on public.services to anon, authenticated;

-- 2) Rows with is_active = NULL are hidden by "is_active = true" — fix data
update public.services
set is_active = true
where is_active is null;

-- 3) Replace the public read policy so NULL is treated as active (matches typical seed intent)
drop policy if exists "Anyone can view active services" on public.services;

create policy "Anyone can view active services"
  on public.services
  for select
  to public
  using (coalesce(is_active, true) = true);
