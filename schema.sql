/* schema.sql - Run this in Supabase SQL Editor */

-- Create Profiles Table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text,
  full_name text,
  avatar_url text,
  setup_complete boolean default false,
  last_period_start timestamp with time zone,
  cycle_length int default 28,
  period_length int default 5,
  goal text default 'track',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

-- Create Logs Table
create table logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  flow text, 
  notes text,
  symptoms text[], 
  moods text[], 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- Enable RLS for Logs
alter table logs enable row level security;
create policy "Users can view own logs." on logs for select using ( auth.uid() = user_id );
create policy "Users can insert own logs." on logs for insert with check ( auth.uid() = user_id );
create policy "Users can update own logs." on logs for update using ( auth.uid() = user_id );
create policy "Users can delete own logs." on logs for delete using ( auth.uid() = user_id );

-- Handle User Creation Trigger
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
