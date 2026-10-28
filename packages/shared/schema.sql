create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  role text not null check (role in ('admin','ketua'))
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text unique not null check (char_length(name) between 3 and 40),
  created_at timestamptz default now()
);

create table if not exists positions (
  id int primary key check (id between 1 and 5),
  title text not null
);

-- one-time code per (regu, pos), digenerate ketua; hangus setelah dipakai (used_at terisi)
create table if not exists pos_codes (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams on delete cascade,
  position_id int not null references positions on delete cascade,
  code text not null,
  used_at timestamptz,
  created_at timestamptz default now()
);
create unique index if not exists idx_pos_codes_active
  on pos_codes (team_id, position_id) where used_at is null;

create table if not exists team_progress (
  team_id uuid references teams on delete cascade,
  position_id int references positions on delete cascade,
  completed_at timestamptz default now(),
  primary key (team_id, position_id)
);

create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams on delete cascade,
  position_id int references positions,
  score int check (score between 0 and 100),
  notes text,
  judge_id uuid references staff,
  created_at timestamptz default now()
);
