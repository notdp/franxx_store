-- Email accounts used as service identities
drop table if exists public.email_accounts cascade;
create table public.email_accounts (
  id                 uuid primary key default gen_random_uuid(),
  email              text unique not null,
  password_encrypted text,
  phone_number       text,
  recovery_email     text,
  status             public.email_status not null default 'available',
  current_user_id    uuid references public.users(id) on delete set null,
  allocated_at       timestamptz,
  reserved_until     timestamptz,
  notes              text,
  created_at         timestamptz not null default timezone('utc'::text, now()),
  updated_at         timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_email_accounts_status on public.email_accounts(status);
create index if not exists idx_email_accounts_user on public.email_accounts(current_user_id);

