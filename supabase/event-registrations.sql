-- Event registrations — run in Supabase SQL Editor after events table exists.
-- Admin policy uses public.is_admin() (not EXISTS on profiles) to avoid 42P17 recursion.

create table if not exists public.event_registrations (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  organisation text,
  status text not null default 'registered' check (status in ('registered', 'attended', 'cancelled', 'no_show')),
  is_guest boolean default true,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(event_id, email)
);

alter table public.event_registrations enable row level security;

drop policy if exists "Anyone can register for events" on public.event_registrations;
create policy "Anyone can register for events" on public.event_registrations
  for insert with check (true);

drop policy if exists "Users can view own registrations" on public.event_registrations;
create policy "Users can view own registrations" on public.event_registrations
  for select using (
    user_id = auth.uid()
    or email = (select p.email from public.profiles p where p.id = auth.uid())
  );

drop policy if exists "Admins can manage all registrations" on public.event_registrations;
create policy "Admins can manage all registrations" on public.event_registrations
  for all using (public.is_admin());

grant insert on public.event_registrations to anon, authenticated;
grant select on public.event_registrations to authenticated;
grant update on public.event_registrations to authenticated;
grant all on public.event_registrations to authenticated;

alter table public.events
  add column if not exists max_attendees integer,
  add column if not exists show_attendee_count boolean default false;

drop trigger if exists handle_updated_at_event_registrations on public.event_registrations;
create trigger handle_updated_at_event_registrations
  before update on public.event_registrations
  for each row execute function public.handle_updated_at();
