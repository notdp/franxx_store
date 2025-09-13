-- Initial schema setup
-- This migration creates all necessary types, tables, functions, and policies

SET client_min_messages TO WARNING;
SET search_path TO public;

-- =========================================
-- Extensions
-- =========================================
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- =========================================
-- Types
-- =========================================
-- Role enum
do $$ begin
  create type public.app_role as enum ('user','admin','super_admin');
exception when duplicate_object then null; end $$;

-- AI platform enum
do $$ begin
  create type public.ai_platform as enum ('openai','anthropic');
exception when duplicate_object then null; end $$;

-- Product tag enum
do $$ begin
  create type public.product_tag as enum ('chatgpt','claude','codex','claude_code');
exception when duplicate_object then null; end $$;

-- Currency code enum
do $$ begin
  create type public.currency_code as enum ('USD','CNY','NGN');
exception when duplicate_object then null; end $$;

-- Product status enum
do $$ begin
  create type public.product_status as enum ('on_sale','sold_out','discontinued');
exception when duplicate_object then null; end $$;

-- Order type enum
do $$ begin
  create type public.order_type as enum ('new','renewal');
exception when duplicate_object then null; end $$;

-- Order payment status enum
do $$ begin
  create type public.order_payment_status as enum ('pending','paid','partially_refunded','refunded','canceled');
exception when duplicate_object then null; end $$;

-- Order delivery status enum
do $$ begin
  create type public.order_delivery_status as enum ('pending','processing','delivered','failed');
exception when duplicate_object then null; end $$;

-- =========================================
-- Tables
-- =========================================

-- User roles table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- User profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  phone text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  base_price decimal(10,2) not null,
  currency public.currency_code not null default 'USD',
  ai_platform public.ai_platform not null,
  product_tag public.product_tag not null,
  features jsonb default '[]'::jsonb,
  status public.product_status not null default 'on_sale',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete restrict,
  product_id uuid not null references public.products on delete restrict,
  order_type public.order_type not null default 'new',
  quantity integer not null default 1 check (quantity > 0),
  unit_price decimal(10,2) not null,
  total_amount decimal(10,2) not null,
  currency public.currency_code not null default 'USD',
  payment_status public.order_payment_status not null default 'pending',
  delivery_status public.order_delivery_status not null default 'pending',
  stripe_session_id text unique,
  stripe_payment_intent_id text unique,
  notes text,
  delivered_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  item_type text not null,
  item_data jsonb not null,
  quantity integer not null default 1,
  unit_price decimal(10,2) not null,
  created_at timestamptz default now()
);

-- =========================================
-- Functions
-- =========================================

-- Get user role function
create or replace function public.get_app_role(user_id uuid)
returns public.app_role
language sql
stable
security definer
as $$
  select coalesce(
    (select role from public.user_roles where user_roles.user_id = $1),
    'user'::public.app_role
  );
$$;

-- Get current user role
create or replace function public.get_current_user_role()
returns public.app_role
language sql
stable
as $$
  select public.get_app_role(auth.uid());
$$;

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Create profile
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', new.email)
  );
  
  -- Create user role (default: user)
  insert into public.user_roles (user_id, role)
  values (new.id, 'user'::public.app_role);
  
  return new;
end;
$$;

-- Update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================
-- Triggers
-- =========================================

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

create trigger update_user_roles_updated_at
  before update on public.user_roles
  for each row
  execute function public.update_updated_at_column();

create trigger update_products_updated_at
  before update on public.products
  for each row
  execute function public.update_updated_at_column();

create trigger update_orders_updated_at
  before update on public.orders
  for each row
  execute function public.update_updated_at_column();

-- =========================================
-- Row Level Security (RLS)
-- =========================================

-- Enable RLS on all tables
alter table public.user_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- User roles policies
create policy "Users can view their own role"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  using (public.get_current_user_role() in ('admin', 'super_admin'));

create policy "Super admins can manage roles"
  on public.user_roles for all
  using (public.get_current_user_role() = 'super_admin');

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.get_current_user_role() in ('admin', 'super_admin'));

-- Products policies
create policy "Anyone can view products"
  on public.products for select
  using (true);

create policy "Admins can manage products"
  on public.products for all
  using (public.get_current_user_role() in ('admin', 'super_admin'));

-- Orders policies
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all orders"
  on public.orders for select
  using (public.get_current_user_role() in ('admin', 'super_admin'));

create policy "Admins can manage all orders"
  on public.orders for all
  using (public.get_current_user_role() in ('admin', 'super_admin'));

-- Order items policies
create policy "Users can view their own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on public.order_items for select
  using (public.get_current_user_role() in ('admin', 'super_admin'));

create policy "Admins can manage all order items"
  on public.order_items for all
  using (public.get_current_user_role() in ('admin', 'super_admin'));

-- =========================================
-- Indexes
-- =========================================

create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_ai_platform on public.products(ai_platform);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_orders_delivery_status on public.orders(delivery_status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);