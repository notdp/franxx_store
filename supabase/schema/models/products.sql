-- Products (catalog items) per docs design
drop table if exists public.products cascade;
create table public.products (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  platform           public.ai_platform not null,
  tag                public.product_tag not null,
  ios_ngn_price      numeric(10,2),
  ios_usd_price      numeric(10,2),
  web_usd_price      numeric(10,2),
  selling_price      numeric(10,2) not null,
  stock_quantity     integer default 0,
  reserved_quantity  integer default 0,
  sold_quantity      integer default 0,
  status             public.product_status not null default 'on_sale',
  description        text,
  created_at         timestamptz not null default timezone('utc'::text, now()),
  updated_at         timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_platform_tag on public.products(platform, tag);
create index if not exists idx_products_created_at on public.products(created_at desc);

