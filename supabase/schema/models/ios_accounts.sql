-- iOS accounts bound to virtual cards; slot occupancy summarized in slot_combo
drop table if exists public.ios_accounts cascade;
create table public.ios_accounts (
  id                   uuid primary key default gen_random_uuid(),
  apple_id             text unique not null,
  password_encrypted   text not null,
  region               text, -- e.g., NG/US/GB/JP
  phone_number         text,
  virtual_card_id      uuid,
  status               public.ios_account_status not null default 'active',
  slot_combo           public.slot_combo not null default 'none',
  risk_control_until   timestamptz,
  device_info          jsonb default '{}'::jsonb,
  last_login_at        timestamptz,
  total_spent          numeric(12,2) default 0,
  notes                text,
  created_at           timestamptz not null default timezone('utc'::text, now()),
  updated_at           timestamptz not null default timezone('utc'::text, now()),
  check (case when status <> 'active' then slot_combo = 'none' else true end)
);

create index if not exists idx_ios_accounts_status on public.ios_accounts(status);
create index if not exists idx_ios_accounts_region on public.ios_accounts(region);
create index if not exists idx_ios_accounts_virtual_card on public.ios_accounts(virtual_card_id);
