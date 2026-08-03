-- ============================================================
-- CaitlynAndRylan — Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('rylan', 'caitlyn')),
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Public profiles are viewable by authenticated users"
  on profiles for select to authenticated using (true);
create policy "Users can update own profile"
  on profiles for update to authenticated using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert to authenticated with check (auth.uid() = id);

-- Love Notes
create table if not exists love_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  mood text default '💕',
  created_at timestamptz default now()
);
alter table love_notes enable row level security;
create policy "Love notes visible to authenticated users"
  on love_notes for select to authenticated using (true);
create policy "Users can insert their own love notes"
  on love_notes for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete their own love notes"
  on love_notes for delete to authenticated using (auth.uid() = user_id);

-- Watchlist
create table if not exists watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text default 'movie',
  where text default '',
  watched boolean default false,
  created_at timestamptz default now()
);
alter table watchlist enable row level security;
create policy "Watchlist visible to authenticated users"
  on watchlist for select to authenticated using (true);
create policy "Users can insert to watchlist"
  on watchlist for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update watchlist items"
  on watchlist for update to authenticated using (true);
create policy "Users can delete own watchlist items"
  on watchlist for delete to authenticated using (auth.uid() = user_id);

-- Bucket List
create table if not exists bucket_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  emoji text default '🌟',
  done boolean default false,
  created_at timestamptz default now()
);
alter table bucket_list enable row level security;
create policy "Bucket list visible to authenticated users"
  on bucket_list for select to authenticated using (true);
create policy "Users can insert bucket list items"
  on bucket_list for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update bucket list items"
  on bucket_list for update to authenticated using (true);
create policy "Users can delete own bucket list items"
  on bucket_list for delete to authenticated using (auth.uid() = user_id);

-- Photos
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  caption text default '',
  storage_path text not null,
  created_at timestamptz default now()
);
alter table photos enable row level security;
create policy "Photos visible to authenticated users"
  on photos for select to authenticated using (true);
create policy "Users can upload photos"
  on photos for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete own photos"
  on photos for delete to authenticated using (auth.uid() = user_id);

-- Songs / Music
create table if not exists songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  artist text default '',
  note text default '',
  spotify_url text default '',
  created_at timestamptz default now()
);
alter table songs enable row level security;
create policy "Songs visible to authenticated users"
  on songs for select to authenticated using (true);
create policy "Users can insert songs"
  on songs for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete own songs"
  on songs for delete to authenticated using (auth.uid() = user_id);

-- Timeline / Milestones
create table if not exists timeline (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  date date not null,
  note text default '',
  emoji text default '💕',
  created_at timestamptz default now()
);
alter table timeline enable row level security;
create policy "Timeline visible to authenticated users"
  on timeline for select to authenticated using (true);
create policy "Users can insert timeline events"
  on timeline for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete own timeline events"
  on timeline for delete to authenticated using (auth.uid() = user_id);

-- Flashcard Decks
create table if not exists decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  subject text default '',
  created_at timestamptz default now()
);
alter table decks enable row level security;
create policy "Decks visible to authenticated users"
  on decks for select to authenticated using (true);
create policy "Users can insert decks"
  on decks for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete own decks"
  on decks for delete to authenticated using (auth.uid() = user_id);

-- Flashcards
create table if not exists flashcards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references decks(id) on delete cascade,
  front text not null,
  back text not null,
  created_at timestamptz default now()
);
alter table flashcards enable row level security;
create policy "Flashcards visible to authenticated users"
  on flashcards for select to authenticated using (true);
create policy "Anyone authenticated can insert flashcards"
  on flashcards for insert to authenticated with check (true);
create policy "Anyone authenticated can delete flashcards"
  on flashcards for delete to authenticated using (true);

-- Virtual Pet (single shared row)
create table if not exists pets (
  id integer primary key default 1,
  name text default 'Stripes',
  hunger integer default 60 check (hunger >= 0 and hunger <= 100),
  happiness integer default 70 check (happiness >= 0 and happiness <= 100),
  energy integer default 80 check (energy >= 0 and energy <= 100),
  last_interaction timestamptz default now(),
  last_action text default null,
  last_interacted_by uuid references auth.users(id)
);
alter table pets enable row level security;
create policy "Pet visible to authenticated users"
  on pets for select to authenticated using (true);
create policy "Authenticated users can update pet"
  on pets for update to authenticated using (true);

-- Seed the pet row (run once)
insert into pets (id) values (1) on conflict (id) do nothing;

-- Storage bucket for photos (run in Storage tab or via API)
-- Create a public bucket named "photos"
-- Add RLS policy: authenticated users can upload to their own folder (user_id/*)

-- ============================================================
-- Done! Tables created with RLS enabled.
-- ============================================================
