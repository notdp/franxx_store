-- Role enum
do $$ begin
  create type public.app_role as enum ('user','admin','super_admin');
exception when duplicate_object then null; end $$;

-- Generic enums for new design
do $$ begin
  create type public.ai_platform as enum ('openai','anthropic');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.product_tag as enum ('chatgpt','claude','codex','claude_code');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.currency_code as enum ('USD','CNY','NGN');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.product_status as enum ('on_sale','sold_out','discontinued');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_type as enum ('new','renewal');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_payment_status as enum ('pending','paid','partially_refunded','refunded','canceled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_delivery_status as enum ('pending','processing','delivered','failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending','authorized','succeeded','failed','canceled','disputed','refunded','partially_refunded');
exception when duplicate_object then null; end $$;

-- card_brand removed from design (keep no-op here; cleanup happens post-models)

do $$ begin
  create type public.ios_account_status as enum ('active','locked','risk_control','suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.slot_combo as enum ('none','openai_only','anthropic_only','both');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.email_status as enum ('available','allocated','reserved','recycled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.virtual_card_status as enum ('active','frozen','expired','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.discount_type as enum ('membership','code','squad','none');
exception when duplicate_object then null; end $$;
