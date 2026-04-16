-- ─────────────────────────────────────────────────────────────
-- 360 Living Foundation — Get Involved Tables
-- All prefixed with foundation_ to avoid conflicts
-- ─────────────────────────────────────────────────────────────

-- ── PROGRAM APPLICATIONS ─────────────────────────────────────
create table if not exists public.foundation_applications (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text not null,
  phone text,
  age_range text,
  gender text,
  location text,
  program_interest text not null,
  program_title text not null,
  motivation text,
  heard_about_us text,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'accepted', 'waitlisted', 'rejected')),
  admin_notes text,
  is_guest boolean default true,
  user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── PARTNER REQUESTS ─────────────────────────────────────────
create table if not exists public.foundation_partners (
  id uuid default uuid_generate_v4() primary key,
  organisation_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  organisation_type text,
  website text,
  partnership_interest text,
  message text,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'active', 'declined')),
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── VOLUNTEER SIGNUPS ────────────────────────────────────────
create table if not exists public.foundation_volunteers (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text not null,
  phone text,
  occupation text,
  skills text,
  availability text,
  motivation text,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'active', 'inactive')),
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── SPONSOR / DONATION INQUIRIES ─────────────────────────────
create table if not exists public.foundation_sponsors (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text not null,
  phone text,
  organisation text,
  inquiry_type text not null default 'sponsor'
    check (inquiry_type in ('sponsor', 'donate')),
  program_interest text,
  message text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'confirmed', 'declined')),
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── GENERAL CONTACT (Foundation) ─────────────────────────────
create table if not exists public.foundation_contacts (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  intent text default 'general',
  status text not null default 'new'
    check (status in ('new', 'read', 'replied')),
  created_at timestamptz default now()
);

alter table public.foundation_applications enable row level security;
alter table public.foundation_partners enable row level security;
alter table public.foundation_volunteers enable row level security;
alter table public.foundation_sponsors enable row level security;
alter table public.foundation_contacts enable row level security;

do $$
begin
  create policy "Anyone can submit application"
    on public.foundation_applications for insert with check (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Anyone can submit partner request"
    on public.foundation_partners for insert with check (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Anyone can submit volunteer signup"
    on public.foundation_volunteers for insert with check (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Anyone can submit sponsor inquiry"
    on public.foundation_sponsors for insert with check (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Anyone can submit contact"
    on public.foundation_contacts for insert with check (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Admins manage applications"
    on public.foundation_applications for all using (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Admins manage partners"
    on public.foundation_partners for all using (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Admins manage volunteers"
    on public.foundation_volunteers for all using (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Admins manage sponsors"
    on public.foundation_sponsors for all using (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Admins manage contacts"
    on public.foundation_contacts for all using (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
exception when duplicate_object then null;
end $$;

grant insert on public.foundation_applications to anon, authenticated;
grant insert on public.foundation_partners to anon, authenticated;
grant insert on public.foundation_volunteers to anon, authenticated;
grant insert on public.foundation_sponsors to anon, authenticated;
grant insert on public.foundation_contacts to anon, authenticated;
grant all on public.foundation_applications to authenticated;
grant all on public.foundation_partners to authenticated;
grant all on public.foundation_volunteers to authenticated;
grant all on public.foundation_sponsors to authenticated;
grant all on public.foundation_contacts to authenticated;

drop trigger if exists handle_updated_at_applications on public.foundation_applications;
create trigger handle_updated_at_applications
  before update on public.foundation_applications
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_updated_at_partners on public.foundation_partners;
create trigger handle_updated_at_partners
  before update on public.foundation_partners
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_updated_at_volunteers on public.foundation_volunteers;
create trigger handle_updated_at_volunteers
  before update on public.foundation_volunteers
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_updated_at_sponsors on public.foundation_sponsors;
create trigger handle_updated_at_sponsors
  before update on public.foundation_sponsors
  for each row execute procedure public.handle_updated_at();
