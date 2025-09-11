-- Virtual cards (sensitive fields encrypted; admin-only access via RLS)
drop table if exists public.virtual_cards cascade;
create table public.virtual_cards (
  id                   uuid primary key default gen_random_uuid(),
  pan_encrypted        text unique, -- encrypted PAN (full card number)
  last4                text check (char_length(last4) = 4),
  expiry_date          text, -- store as 'YYYY/MM'
  cvv_encrypted        text,
  provider             text,
  holder_name          text,
  balance              numeric(12,2) default 0,
  currency             public.currency_code not null default 'NGN',
  status               public.virtual_card_status not null default 'active',
  billing_address_id   uuid,
  monthly_limit        numeric(12,2),
  used_this_month      numeric(12,2) default 0,
  notes                text,
  created_at           timestamptz not null default timezone('utc'::text, now()),
  updated_at           timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_virtual_cards_status on public.virtual_cards(status);
create index if not exists idx_virtual_cards_provider on public.virtual_cards(provider);
