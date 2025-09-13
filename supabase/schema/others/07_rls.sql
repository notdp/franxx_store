-- Enable RLS (placed last by filename)
alter table if exists public.users enable row level security;
alter table if exists public.orders enable row level security;
alter table if exists public.user_roles enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.virtual_cards enable row level security;
alter table if exists public.ios_accounts enable row level security;
alter table if exists public.email_accounts enable row level security;
alter table if exists public.email_platform_status enable row level security;
alter table if exists public.payments enable row level security;

-- Ensure no permissive legacy policy remains (skip non-existent tables)
do $$ begin
  if exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
             where n.nspname='public' and c.relname='payment_logs' and c.relkind='r') then
    execute 'drop policy if exists "Service role can manage payment_logs" on public.payment_logs';
  end if;
end $$;

-- Users policies
drop policy if exists "Users can view own profile" on public.users;
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

drop policy if exists "Admins can view all users" on public.users;
create policy "Admins can view all users" on public.users
  for select using (public.is_admin(auth.uid()));

-- Orders policies
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id or auth.email() = email);

drop policy if exists "Users can create own orders" on public.orders;
create policy "Users can create own orders" on public.orders
  for insert with check (auth.uid() = user_id or auth.email() = email);

drop policy if exists "Users can update own pending orders" on public.orders;
create policy "Users can update own pending orders" on public.orders
  for update using (auth.uid() = user_id and status in ('pending','processing'));

drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders" on public.orders
  for select using (public.is_admin(auth.uid()));

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders
  for update using (public.is_admin(auth.uid()));

-- User roles policies
drop policy if exists "Users can view own role" on public.user_roles;
create policy "Users can view own role" on public.user_roles
  for select using (auth.uid() = user_id);

drop policy if exists "Super admin can view all roles" on public.user_roles;
create policy "Super admin can view all roles" on public.user_roles
  for select using (public.is_super_admin(auth.uid()));

drop policy if exists "Super admin can update roles" on public.user_roles;
create policy "Super admin can update roles" on public.user_roles
  for update using (public.is_super_admin(auth.uid()));

drop policy if exists "Super admin can insert roles" on public.user_roles;
create policy "Super admin can insert roles" on public.user_roles
  for insert with check (public.is_super_admin(auth.uid()));

-- Products policies
drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone" on public.products
  for select using (status = 'on_sale');

drop policy if exists "Only admins can write products" on public.products;
create policy "Only admins can write products" on public.products
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Sensitive resource tables: admin only
drop policy if exists "Admins manage virtual_cards" on public.virtual_cards;
create policy "Admins manage virtual_cards" on public.virtual_cards
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

drop policy if exists "Admins manage ios_accounts" on public.ios_accounts;
create policy "Admins manage ios_accounts" on public.ios_accounts
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

drop policy if exists "Admins manage email_accounts" on public.email_accounts;
create policy "Admins manage email_accounts" on public.email_accounts
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

drop policy if exists "Admins manage email_platform_status" on public.email_platform_status;
create policy "Admins manage email_platform_status" on public.email_platform_status
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Payments: users can view their own via orders; admins manage
drop policy if exists "Users can view own payments" on public.payments;
create policy "Users can view own payments" on public.payments
  for select using (
    exists (
      select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or o.email = auth.email())
    )
  );

drop policy if exists "Admins can manage payments" on public.payments;
create policy "Admins can manage payments" on public.payments
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Basic grants
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.users to authenticated;
grant select, insert, update on public.orders to authenticated;
grant select on public.user_roles to authenticated;
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant usage, select on all sequences in schema public to authenticated;

