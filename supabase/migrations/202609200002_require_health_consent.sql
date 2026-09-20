-- Weight and strength records are health information. Only allow new rows
-- from users who have given (and not withdrawn) explicit consent.
drop policy if exists "Users can insert their own weight logs" on public.weight_logs;
create policy "Users can insert their own weight logs"
  on public.weight_logs for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.health_consent_at is not null
    )
  );

drop policy if exists "Users can insert their own strength logs" on public.strength_logs;
create policy "Users can insert their own strength logs"
  on public.strength_logs for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.health_consent_at is not null
    )
  );
