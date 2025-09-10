-- Recreate with extended fields (keep legacy columns for compatibility)
drop table if exists public.orders cascade;
create table public.orders (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid references public.users(id) on delete set null,
  package_id                uuid references public.packages(id) on delete set null,
  package_name              text,
  -- New product linkage (optional during transition)
  product_id                uuid,
  subscription_id           uuid,
  type                      public.order_type default 'new',

  -- Contact and legacy fields (kept for existing UI/API)
  phone                     text,
  email                     text,

  -- Delivery lifecycle (UI uses this today)
  status                    public.order_delivery_status not null default 'pending',

  -- Pricing
  amount                    numeric(10,2) not null,                   -- list price
  final_amount              numeric(10,2),                            -- after discount
  discount_type             public.discount_type default 'none',
  discount_snapshot         jsonb default '{}'::jsonb,
  currency                  public.currency_code not null default 'USD',

  -- Legacy payment hints on orders (Stripe detailed rows live in payments)
  payment_method            text default 'card',
  stripe_session_id         text unique,
  stripe_payment_intent_id  text,
  stripe_customer_id        text,
  payment_status            public.order_payment_status default 'pending',

  -- Optional delivery payload
  account                   jsonb,

  created_at                timestamptz not null default timezone('utc'::text, now()),
  updated_at                timestamptz not null default timezone('utc'::text, now()),
  paid_at                   timestamptz,
  delivered_at              timestamptz
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_email on public.orders(email);
create index if not exists idx_orders_stripe_session_id on public.orders(stripe_session_id);
create index if not exists idx_orders_stripe_payment_intent_id on public.orders(stripe_payment_intent_id);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
