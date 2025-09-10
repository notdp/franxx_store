-- Status of email accounts on specific AI platforms
drop table if exists public.email_platform_status cascade;
create table public.email_platform_status (
  id                 uuid primary key default gen_random_uuid(),
  email_account_id   uuid not null references public.email_accounts(id) on delete cascade,
  platform           public.ai_platform not null,
  status             text not null default 'active', -- active/banned/suspended
  banned_at          timestamptz,
  ban_reason         text,
  registered_at      timestamptz,
  last_active_at     timestamptz,
  created_at         timestamptz not null default timezone('utc'::text, now()),
  updated_at         timestamptz not null default timezone('utc'::text, now()),
  unique(email_account_id, platform)
);

create index if not exists idx_email_platform_status_platform on public.email_platform_status(platform);

