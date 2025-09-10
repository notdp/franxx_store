create or replace view public.active_packages as
select * from public.packages where deleted_at is null;

-- Public catalog: products (declared inventory only)
create or replace view public.products_public as
select
  p.id,
  p.name,
  p.platform,
  p.tag,
  p.ios_ngn_price,
  p.ios_usd_price,
  p.web_usd_price,
  p.selling_price,
  p.stock_quantity,
  p.reserved_quantity,
  p.sold_quantity,
  p.status,
  p.description,
  p.created_at
from public.products p
where p.status = 'on_sale';
