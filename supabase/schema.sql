-- ─────────────────────────────────────────
-- 360 Living Institute — Database Schema
-- Run in Supabase SQL Editor (do not run from this repo automatically)
-- ─────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES ──────────────────────────────
-- Extends Supabase auth.users
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'client' check (role in ('client', 'admin')),
  email_verified boolean default false,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── SERVICES ──────────────────────────────
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  description text,
  duration_minutes integer not null default 60,
  price_ghs numeric(10,2),
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Seed default services
insert into public.services (slug, title, description, duration_minutes, sort_order) values
  ('individual-counselling', 'Individual Counselling', 'One-on-one support for personal clarity, healing, and growth.', 60, 1),
  ('couples-counselling', 'Couples Counselling', 'Support for couples navigating relationship challenges.', 90, 2),
  ('family-counselling', 'Family & Relationship Counselling', 'Enhancing family dynamics, communication, and harmony.', 90, 3),
  ('life-transition', 'Life Transition Counselling', 'Guiding you through major life changes with clarity.', 60, 4),
  ('entrepreneur-wellness', 'Entrepreneur Wellness Session', 'Specialised support for founders and business leaders.', 60, 5),
  ('corporate-wellness', 'Corporate Wellness Consultation', 'Organisational mental health programs and consultations.', 120, 6);

-- ── AVAILABILITY ──────────────────────────
-- Admin sets working hours per day of week
create table public.availability (
  id uuid default uuid_generate_v4() primary key,
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0=Sun, 1=Mon...6=Sat
  start_time time not null default '09:00',
  end_time time not null default '17:00',
  slot_duration_minutes integer not null default 60,
  is_active boolean default true,
  created_at timestamptz default now(),
  unique(day_of_week)
);

-- Default availability: Mon–Fri 9am–5pm, Sat 9am–1pm
insert into public.availability (day_of_week, start_time, end_time, slot_duration_minutes, is_active) values
  (1, '09:00', '17:00', 60, true), -- Monday
  (2, '09:00', '17:00', 60, true), -- Tuesday
  (3, '09:00', '17:00', 60, true), -- Wednesday
  (4, '09:00', '17:00', 60, true), -- Thursday
  (5, '09:00', '17:00', 60, true), -- Friday
  (6, '09:00', '13:00', 60, true), -- Saturday
  (0, '09:00', '17:00', 60, false); -- Sunday (inactive)

-- ── BLACKOUT DATES ────────────────────────
create table public.blackout_dates (
  id uuid default uuid_generate_v4() primary key,
  date date not null unique,
  reason text,
  created_at timestamptz default now()
);

-- ── APPOINTMENTS ──────────────────────────
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  -- Client info
  client_id uuid references public.profiles(id) on delete set null,
  client_name text not null,
  client_email text not null,
  client_phone text,
  -- Booking info
  service_id uuid references public.services(id) on delete set null,
  service_title text not null, -- denormalized for history
  appointment_date date not null,
  appointment_time time not null,
  duration_minutes integer not null default 60,
  -- Status
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  notes text, -- client notes
  admin_notes text, -- internal admin notes
  cancellation_reason text,
  -- Guest booking
  is_guest boolean default false,
  -- Timestamps
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── EMAIL LOGS ────────────────────────────
create table public.email_logs (
  id uuid default uuid_generate_v4() primary key,
  appointment_id uuid references public.appointments(id) on delete set null,
  recipient_email text not null,
  email_type text not null, -- 'booking_received', 'confirmed', 'cancelled', 'reminder', 'verification', 'password_reset'
  subject text,
  status text default 'sent', -- 'sent', 'failed'
  resend_id text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- RLS helper (avoids infinite recursion on profiles)
-- Admin policies must NOT use "exists (select ... from profiles)" — that re-enters
-- profiles RLS and triggers 42P17. This function runs as owner and bypasses RLS.
-- ─────────────────────────────────────────

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

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.availability enable row level security;
alter table public.blackout_dates enable row level security;
alter table public.appointments enable row level security;
alter table public.email_logs enable row level security;

-- PROFILES
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (public.is_admin());

-- SERVICES (public read)
create policy "Anyone can view active services" on public.services for select using (is_active = true);
create policy "Admins can manage services" on public.services for all using (public.is_admin());

-- AVAILABILITY (public read)
create policy "Anyone can view availability" on public.availability for select using (true);
create policy "Admins can manage availability" on public.availability for all using (public.is_admin());

-- BLACKOUT DATES (public read)
create policy "Anyone can view blackout dates" on public.blackout_dates for select using (true);
create policy "Admins can manage blackout dates" on public.blackout_dates for all using (public.is_admin());

-- APPOINTMENTS
create policy "Clients can view own appointments" on public.appointments for select using (
  client_id = auth.uid() or client_email = (select email from public.profiles where id = auth.uid())
);
create policy "Anyone can create appointment" on public.appointments for insert with check (true);
create policy "Clients can cancel own appointments" on public.appointments for update using (
  client_id = auth.uid()
) with check (status = 'cancelled');
create policy "Admins can manage all appointments" on public.appointments for all using (public.is_admin());

-- EMAIL LOGS
create policy "Admins can view email logs" on public.email_logs for select using (public.is_admin());
create policy "System can insert email logs" on public.email_logs for insert with check (true);

-- ─────────────────────────────────────────
-- FUNCTIONS & TRIGGERS
-- ─────────────────────────────────────────

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'client')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at_profiles
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at_appointments
  before update on public.appointments
  for each row execute function public.handle_updated_at();
