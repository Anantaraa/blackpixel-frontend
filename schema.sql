-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Categories Table
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects Table
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  year integer,
  location text,
  image text, -- URL to main image
  gallery text[], -- Array of URLs
  category_id uuid references public.categories(id),
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.projects enable row level security;

-- Create Policies (Allow Public Read Access)
create policy "Allow public read access on categories"
on public.categories for select
to anon
using (true);

create policy "Allow public read access on projects"
on public.projects for select
to anon
using (true);

-- Allow Insert for Anon (TEMPORARY: For Seeding Script)
-- IMPORTANT: Disable this after seeding!
create policy "Allow anon insert on categories"
on public.categories for insert
to anon
with check (true);

create policy "Allow anon insert on projects"
on public.projects for insert
to anon
with check (true);
