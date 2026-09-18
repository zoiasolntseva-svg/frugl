-- Meal plan history: one row per generated plan, powers the calorie/spend history chart
create table public.meal_plan_history (
  id bigserial primary key,
  user_id uuid not null references auth.users on delete cascade,
  store text not null,
  goal text not null,
  period text not null,
  budget numeric(10, 2) not null,
  spent numeric(10, 2) not null,
  total_calories integer,
  meal_count integer not null,
  created_at timestamp with time zone default now()
);

alter table public.meal_plan_history enable row level security;

create policy "Users can view their own meal plan history"
  on public.meal_plan_history for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own meal plan history"
  on public.meal_plan_history for insert
  with check ( auth.uid() = user_id );

-- Weight log
create table public.weight_logs (
  id bigserial primary key,
  user_id uuid not null references auth.users on delete cascade,
  logged_at date not null default current_date,
  weight_kg numeric(5, 2) not null,
  created_at timestamp with time zone default now()
);

alter table public.weight_logs enable row level security;

create policy "Users can view their own weight logs"
  on public.weight_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own weight logs"
  on public.weight_logs for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own weight logs"
  on public.weight_logs for delete
  using ( auth.uid() = user_id );

-- Strength log
create table public.strength_logs (
  id bigserial primary key,
  user_id uuid not null references auth.users on delete cascade,
  logged_at date not null default current_date,
  exercise text not null,
  weight_kg numeric(6, 2) not null,
  reps integer not null,
  sets integer not null default 1,
  created_at timestamp with time zone default now()
);

alter table public.strength_logs enable row level security;

create policy "Users can view their own strength logs"
  on public.strength_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own strength logs"
  on public.strength_logs for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own strength logs"
  on public.strength_logs for delete
  using ( auth.uid() = user_id );
