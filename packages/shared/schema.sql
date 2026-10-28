create table staff (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  role text not null check (role in ('admin','ketua'))
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  name text unique not null check (char_length(name) between 3 and 40),
  created_at timestamptz default now()
);

create table positions (
  id int primary key check (id between 1 and 5),
  title text not null,
  password_hash text not null
);

create table team_progress (
  team_id uuid references teams on delete cascade,
  position_id int references positions on delete cascade,
  completed_at timestamptz default now(),
  primary key (team_id, position_id)
);

create table scores (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams on delete cascade,
  position_id int references positions,
  score int check (score between 0 and 100),
  notes text,
  judge_id uuid references staff,
  created_at timestamptz default now()
);
