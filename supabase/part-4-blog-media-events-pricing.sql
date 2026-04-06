-- Part 4 — Blog, Media, Events & Pricing
-- Run in Supabase SQL Editor after schema.sql + fix-rls-admin-recursion.sql (needs public.is_admin()).
-- Policies use is_admin() instead of EXISTS (SELECT … FROM profiles) to avoid 42P17 recursion.

-- ── PRICING SETTINGS ──────────────────────────────────────────
create table if not exists public.pricing_settings (
  id uuid default uuid_generate_v4() primary key,
  global_price_ghs numeric(10,2) not null default 0,
  show_prices boolean default true,
  payment_instructions text default 'Payment is made via Mobile Money (MoMo). Use your Booking ID as the payment reference. Send payment to: 0538045503 (Selasi Doku). Once payment is made, your session will be confirmed.',
  momo_number text default '0538045503',
  momo_name text default 'Selasi Doku',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into public.pricing_settings (global_price_ghs, show_prices)
select 150.00, true
where not exists (select 1 from public.pricing_settings limit 1);

alter table public.services
  add column if not exists price_override_ghs numeric(10,2),
  add column if not exists use_global_price boolean default true;

-- ── BLOG POSTS ────────────────────────────────────────────────
create table if not exists public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  cover_image_alt text,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null default 'Selasi Doku',
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean default false,
  tags text[] default '{}',
  read_time_minutes integer default 5,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── MEDIA LIBRARY ─────────────────────────────────────────────
create table if not exists public.media (
  id uuid default uuid_generate_v4() primary key,
  file_name text not null,
  file_url text not null,
  file_size integer,
  mime_type text,
  alt_text text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  used_in text,
  created_at timestamptz default now()
);

-- ── EVENTS (replace placeholder if you had one) ─────────────────
drop table if exists public.events cascade;

create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  description text,
  long_description text,
  category text not null default 'Workshop',
  event_date date not null,
  event_time time,
  end_time time,
  location text default 'Accra, Ghana',
  is_online boolean default false,
  online_link text,
  audience text,
  cover_image_url text,
  status text not null default 'upcoming' check (status in ('upcoming', 'ongoing', 'past', 'cancelled')),
  is_featured boolean default false,
  registration_link text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.pricing_settings enable row level security;
alter table public.blog_posts enable row level security;
alter table public.media enable row level security;
alter table public.events enable row level security;

drop policy if exists "Anyone can read pricing" on public.pricing_settings;
create policy "Anyone can read pricing" on public.pricing_settings for select using (true);

drop policy if exists "Admins can manage pricing" on public.pricing_settings;
create policy "Admins can manage pricing" on public.pricing_settings for all using (public.is_admin());

drop policy if exists "Anyone can read published posts" on public.blog_posts;
create policy "Anyone can read published posts" on public.blog_posts for select using (status = 'published');

drop policy if exists "Admins can manage blog posts" on public.blog_posts;
create policy "Admins can manage blog posts" on public.blog_posts for all using (public.is_admin());

drop policy if exists "Admins can manage media" on public.media;
create policy "Admins can manage media" on public.media for all using (public.is_admin());

drop policy if exists "Anyone can read events" on public.events;
create policy "Anyone can read events" on public.events for select using (status != 'cancelled');

drop policy if exists "Admins can manage events" on public.events;
create policy "Admins can manage events" on public.events for all using (public.is_admin());

grant select on public.pricing_settings to anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant select on public.events to anon, authenticated;
grant all on public.blog_posts to authenticated;
grant all on public.media to authenticated;
grant all on public.events to authenticated;
grant all on public.pricing_settings to authenticated;

-- updated_at triggers (requires public.handle_updated_at from main schema.sql)
drop trigger if exists handle_updated_at_pricing_settings on public.pricing_settings;
create trigger handle_updated_at_pricing_settings
  before update on public.pricing_settings
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_updated_at_blog_posts on public.blog_posts;
create trigger handle_updated_at_blog_posts
  before update on public.blog_posts
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_updated_at_events on public.events;
create trigger handle_updated_at_events
  before update on public.events
  for each row execute function public.handle_updated_at();
