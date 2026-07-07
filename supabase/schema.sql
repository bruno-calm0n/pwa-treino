create table if not exists public.exercise_totals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  flexoes integer not null default 0 check (flexoes >= 0),
  polichinelos integer not null default 0 check (polichinelos >= 0),
  abdominais integer not null default 0 check (abdominais >= 0),
  updated_at timestamptz not null default now()
);

alter table public.exercise_totals enable row level security;

revoke all on public.exercise_totals from anon;
revoke all on public.exercise_totals from public;
grant usage on schema public to authenticated;
grant select, insert, update on public.exercise_totals to authenticated;

drop policy if exists "users can read own totals" on public.exercise_totals;
create policy "users can read own totals"
on public.exercise_totals
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users can insert own totals" on public.exercise_totals;
create policy "users can insert own totals"
on public.exercise_totals
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users can update own totals" on public.exercise_totals;
create policy "users can update own totals"
on public.exercise_totals
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
