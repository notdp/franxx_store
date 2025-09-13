
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

-- Admin-only convenience view with decrypted PAN/CVV (relies on table RLS)
create or replace view public.virtual_cards_admin as
select
  vc.id,
  public.decrypt_text(vc.pan_encrypted) as pan_plain,
  vc.last4,
  vc.expiry_date as expiry,
  public.decrypt_text(vc.cvv_encrypted) as cvv_plain,
  vc.provider,
  vc.holder_name,
  vc.balance,
  vc.currency,
  vc.status,
  vc.monthly_limit,
  vc.used_this_month,
  vc.notes,
  vc.created_at,
  vc.updated_at
from public.virtual_cards vc;

-- Grants for views
grant select on public.virtual_cards_admin to authenticated;

-- Admin RPCs colocated with their views for easier maintenance
-- Admin RPC: list virtual cards with decrypted fields
create or replace function public.admin_list_virtual_cards()
returns setof public.virtual_cards_admin
language sql
stable
security definer
set search_path = public
as $$
  select * from public.virtual_cards_admin
  where public.is_admin(auth.uid());
$$;
