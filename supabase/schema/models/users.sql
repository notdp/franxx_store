-- Users profile table extending auth.users
drop table if exists public.users cascade;
create table public.users (
  id              uuid primary key,
  email           text not null,
  name            text,
  avatar_url      text,
  provider        text check (provider in ('google','github')),
  stripe_customer_id text unique,
  created_at      timestamptz not null default timezone('utc'::text, now()),
  updated_at      timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_stripe_customer_id on public.users(stripe_customer_id);
