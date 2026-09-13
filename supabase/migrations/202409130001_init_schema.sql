-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  subscription_status text not null default 'free' check (subscription_status in ('free', 'active', 'cancelled')),
  store_preference text,
  city text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create ingredients table
create table public.ingredients (
  id bigserial primary key,
  name text not null,
  unit text not null,
  category text not null,
  price numeric(10, 2) not null,
  store text not null,
  last_updated timestamp with time zone default now()
);

-- Create recipes table
create table public.recipes (
  id bigserial primary key,
  name text not null,
  instructions text not null,
  prep_time integer not null, -- in minutes
  servings integer not null
);

-- Create recipe_ingredients table
create table public.recipe_ingredients (
  id bigserial primary key,
  recipe_id bigint not null references recipes(id) on delete cascade,
  ingredient_id bigint not null references ingredients(id) on delete cascade,
  quantity numeric not null,
  unique (recipe_id, ingredient_id)
);

-- Create nutrition_info table
create table public.nutrition_info (
  id bigserial primary key,
  recipe_id bigint not null references recipes(id) on delete cascade,
  calories integer not null,
  macros jsonb not null, -- e.g., {protein: 10, carbs: 20, fat: 5}
  allergens jsonb not null -- e.g., {gluten: false, dairy: true, nuts: false, eggs: false, soy: false, shellfish: false}
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.ingredients enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.nutrition_info enable row level security;

-- Create policies (example: users can only see their own profile)
create policy "Users can view their own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- For other tables, you can define policies as needed (e.g., public read for ingredients, recipes, etc.)
-- For simplicity, we'll allow public read access to ingredients and recipes (assuming they are public data)
create policy "Anyone can view ingredients"
  on public.ingredients for select
  using ( true );

create policy "Anyone can view recipes"
  on public.recipes for select
  using ( true );

create policy "Anyone can view recipe_ingredients"
  on public.recipe_ingredients for select
  using ( true );

create policy "Anyone can view nutrition_info"
  on public.nutrition_info for select
  using ( true );
