-- Consent and acceptance records, kept on the user's profile
alter table public.profiles
  add column if not exists terms_version text,
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists privacy_version text,
  add column if not exists adult_confirmed_at timestamptz,
  add column if not exists health_consent_version text,
  add column if not exists health_consent_at timestamptz;

-- Record what the user accepted at sign-up. The acceptance time is set by the
-- database (now()), not taken from the browser, so it can't be back-dated.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (
    id, terms_version, terms_accepted_at, privacy_version, adult_confirmed_at
  ) values (
    new.id,
    nullif(meta->>'terms_version', ''),
    case when nullif(meta->>'terms_version', '') is not null then now() end,
    nullif(meta->>'privacy_version', ''),
    case when meta->>'adult_confirmed' = 'true' then now() end
  );
  return new;
end;
$$;

-- Users may only edit their own preferences from the browser. Everything else
-- on the profile (consent records, subscription status) is off-limits to
-- direct updates, so it can't be forged or self-granted.
revoke update on public.profiles from anon, authenticated;
grant update (store_preference, city) on public.profiles to authenticated;

-- Health-data consent (weight/strength tracking), recorded server-side
create or replace function public.grant_health_consent(p_version text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  update public.profiles
    set health_consent_version = p_version, health_consent_at = now()
    where id = auth.uid();
end;
$$;

-- Withdrawing consent also deletes the health tracking data
create or replace function public.withdraw_health_consent()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from public.weight_logs where user_id = auth.uid();
  delete from public.strength_logs where user_id = auth.uid();
  update public.profiles
    set health_consent_version = null, health_consent_at = null
    where id = auth.uid();
end;
$$;

-- Self-service account deletion (removes the profile, the login, and all
-- tracking/history rows, which cascade from the user record)
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from public.profiles where id = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.grant_health_consent(text) from public, anon;
revoke all on function public.withdraw_health_consent() from public, anon;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.grant_health_consent(text) to authenticated;
grant execute on function public.withdraw_health_consent() to authenticated;
grant execute on function public.delete_my_account() to authenticated;
