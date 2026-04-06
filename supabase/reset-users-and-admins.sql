-- ═══════════════════════════════════════════════════════════════════════════
-- RESET ALL AUTH USERS → then make two staff accounts admins
-- ═══════════════════════════════════════════════════════════════════════════
-- Run in Supabase Dashboard → SQL Editor.
--
-- ⚠️  DESTRUCTIVE: deletes every Auth user. Matching rows in public.profiles are
--     removed (ON DELETE CASCADE). Other public data stays; FKs that reference
--     profiles typically SET NULL (e.g. appointments.client_id, blog author_id).
--
-- WORKFLOW
-- --------
-- 1) Run SECTION A below (all users removed).
-- 2) In Authentication → Users, click “Add user” and create BOTH accounts with the
--    emails below (set a password or send an invite):
--      • batista.simons1@gmail.com
--      • 360livinginstitute@gmail.com
-- 3) Run SECTION B (promotes those two profiles to admin).
-- ═══════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ SECTION A — remove all users (run once)                                  │
-- └─────────────────────────────────────────────────────────────────────────┘

begin;

delete from auth.refresh_tokens;
delete from auth.sessions;
delete from auth.identities;
delete from auth.users;

commit;

-- If any line above errors, try commenting out MFA-related deletes your project
-- doesn’t have, or run only:  delete from auth.users;
-- (Supabase usually cascades identities/sessions when users are deleted.)

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │ SECTION B — set admins (run AFTER both users exist in Authentication)   │
-- └─────────────────────────────────────────────────────────────────────────┘

update public.profiles
set role = 'admin'
where lower(email) in (
  lower('batista.simons1@gmail.com'),
  lower('360livinginstitute@gmail.com')
);

insert into public.profiles (id, full_name, email, role)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', initcap(split_part(u.email, '@', 1))),
  u.email,
  'admin'
from auth.users u
where lower(u.email) in (
  lower('batista.simons1@gmail.com'),
  lower('360livinginstitute@gmail.com')
)
on conflict (id) do update
set
  role = 'admin',
  email = excluded.email;

-- Optional check:
-- select u.email, p.role from auth.users u left join public.profiles p on p.id = u.id;
