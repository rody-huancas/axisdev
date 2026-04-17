-- =============================================
-- TABLA: users
-- =============================================
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table users enable row level security;

create policy "Users can manage their own profile"
  on users
  for all
  using (auth.jwt() ->> 'email' = email);

-- =============================================
-- TABLA: user_settings
-- =============================================
create table if not exists user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  user_email text unique not null,
  language text default 'es',
  widgets jsonb default '[{"id":"gmail","enabled":true},{"id":"tasks","enabled":true},{"id":"calendar","enabled":true},{"id":"storage","enabled":true},{"id":"recentFiles","enabled":false}]',
  notifications jsonb default '[{"id":"push","enabled":true},{"id":"tasks","enabled":true},{"id":"calendar","enabled":false}]',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table user_settings enable row level security;

create policy "Users can only access their own settings"
  on user_settings
  for all
  using (auth.jwt() ->> 'email' = user_email);