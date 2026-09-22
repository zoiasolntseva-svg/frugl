-- How many people a generated plan should feed. Recipes are scaled to this
-- size at plan time (see lib/planner.ts), so a bigger household needs more
-- per meal, not just more meals.
alter table public.profiles
  add column if not exists household_size integer not null default 2;

alter table public.profiles
  drop constraint if exists profiles_household_size_range;
alter table public.profiles
  add constraint profiles_household_size_range check (household_size between 1 and 12);

-- Users may edit their own household size, same as city/store_preference.
grant update (household_size) on public.profiles to authenticated;
