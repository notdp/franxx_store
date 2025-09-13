-- Orphan/consistency checks (views) — dev-only helper
-- These views help spot missing parent rows when foreign keys are not enforced.

drop view if exists public.vw_orphan_orders cascade;
create view public.vw_orphan_orders as
select o.*
from public.orders o
left join public.users u on u.id = o.user_id
where o.user_id is not null and u.id is null;

drop view if exists public.vw_orphan_payments cascade;
create view public.vw_orphan_payments as
select p.*
from public.payments p
left join public.orders o on o.id = p.order_id
where p.order_id is not null and o.id is null;

drop view if exists public.vw_orphan_email_accounts_user cascade;
create view public.vw_orphan_email_accounts_user as
select ea.*
from public.email_accounts ea
left join public.users u on u.id = ea.current_user_id
where ea.current_user_id is not null and u.id is null;

drop view if exists public.vw_orphan_email_platform cascade;
create view public.vw_orphan_email_platform as
select eps.*
from public.email_platform_status eps
left join public.email_accounts ea on ea.id = eps.email_account_id
where ea.id is null;

drop view if exists public.vw_orphan_ios_accounts_card cascade;
create view public.vw_orphan_ios_accounts_card as
select ia.*
from public.ios_accounts ia
left join public.virtual_cards vc on vc.id = ia.virtual_card_id
where ia.virtual_card_id is not null and vc.id is null;

