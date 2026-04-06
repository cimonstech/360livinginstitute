-- Grant admin access to a user (run in Supabase → SQL Editor).
-- Replace the email with the one you use in Authentication.

-- 1) If a profile row already exists (normal after signup / "Add user"):
update public.profiles
set role = 'admin'
where id = (select id from auth.users where lower(email) = lower('batista.simons1@gmail.com'));

-- 2) If no row in public.profiles (e.g. trigger did not run), upsert one:
insert into public.profiles (id, full_name, email, role)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', 'Admin'),
  u.email,
  'admin'
from auth.users u
where lower(u.email) = lower('batista.simons1@gmail.com')
on conflict (id) do update set role = 'admin';

-- 3) Verify:
-- select id, email, role from public.profiles
-- where id = (select id from auth.users where lower(email) = lower('your-admin@example.com'));
