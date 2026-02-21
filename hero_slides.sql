-- Create the hero_slides table
create table if not exists hero_slides (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  caption text,
  display_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table hero_slides enable row level security;

-- Create policies (Simplistic for now, can be tightened later)
-- Allow anyone to read slides
create policy "Public Read" on hero_slides for select using (true);

-- Allow authenticated users (admins) to insert/update/delete
create policy "Admin Write" on hero_slides for all using (auth.role() = 'authenticated');
