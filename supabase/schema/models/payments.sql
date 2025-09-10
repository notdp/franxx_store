-- Stripe payments log (charges and refunds) linked to orders
drop table if exists public.payments cascade;
create table public.payments (
  id                        uuid primary key default gen_random_uuid(),
  order_id                  uuid not null references public.orders(id) on delete cascade,
  provider                  text not null default 'stripe',
  kind                      text not null check (kind in ('charge','refund')),
  amount                    numeric(10,2) not null,
  currency                  public.currency_code not null default 'USD',
  status                    public.payment_status not null default 'pending',
  stripe_session_id         text,
  stripe_payment_intent_id  text,
  stripe_charge_id          text,
  stripe_refund_id          text,
  stripe_customer_id        text,
  stripe_event_id           text,
  error_message             text,
  occurred_at               timestamptz,
  created_at                timestamptz not null default timezone('utc'::text, now()),
  updated_at                timestamptz not null default timezone('utc'::text, now())
);

create unique index if not exists uq_payments_event on public.payments(stripe_event_id) where stripe_event_id is not null;
create unique index if not exists uq_payments_charge on public.payments(stripe_charge_id) where stripe_charge_id is not null and kind = 'charge';
create unique index if not exists uq_payments_refund on public.payments(stripe_refund_id) where stripe_refund_id is not null and kind = 'refund';
create index if not exists idx_payments_order on public.payments(order_id, created_at desc);

