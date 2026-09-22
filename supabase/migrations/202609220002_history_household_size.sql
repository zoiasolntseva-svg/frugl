-- Record the household size used for each generated plan, so history stays
-- meaningful (a family plan and a solo plan aren't directly comparable).
alter table public.meal_plan_history
  add column if not exists household_size integer not null default 1;
