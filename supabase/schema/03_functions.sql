-- Generic updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end; $$ language plpgsql;

-- Attach updated_at triggers
drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_packages_updated_at on public.packages;
create trigger trg_packages_updated_at
before update on public.packages
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_user_roles_updated_at on public.user_roles;
create trigger trg_user_roles_updated_at
before update on public.user_roles
for each row execute function public.update_updated_at_column();

-- New tables (current design)
drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_virtual_cards_updated_at on public.virtual_cards;
create trigger trg_virtual_cards_updated_at
before update on public.virtual_cards
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_ios_accounts_updated_at on public.ios_accounts;
create trigger trg_ios_accounts_updated_at
before update on public.ios_accounts
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_email_accounts_updated_at on public.email_accounts;
create trigger trg_email_accounts_updated_at
before update on public.email_accounts
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_email_platform_status_updated_at on public.email_platform_status;
create trigger trg_email_platform_status_updated_at
before update on public.email_platform_status
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_payments_updated_at on public.payments;
create trigger trg_payments_updated_at
before update on public.payments
for each row execute function public.update_updated_at_column();

-- Insert profile on auth.users signup
create or replace function public.handle_new_user_profile()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url, provider)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_app_meta_data->>'provider'
  )
  on conflict (id) do nothing;
  return new;
end; $$ language plpgsql security definer;

drop trigger if exists trg_on_auth_user_created_profile on auth.users;
create trigger trg_on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

-- Auto-create role on signup (first admin binding by email)
create or replace function public.handle_new_user_role()
returns trigger as $$
begin
  insert into public.user_roles (user_id, role)
  values (
    new.id,
    case when new.email = 'dp0x7ce@gmail.com' then 'super_admin'::public.app_role else 'user'::public.app_role end
  )
  on conflict (user_id) do nothing;
  return new;
end; $$ language plpgsql security definer;

drop trigger if exists trg_on_auth_user_created_role on auth.users;
create trigger trg_on_auth_user_created_role
  after insert on auth.users
  for each row execute function public.handle_new_user_role();

-- Role helpers
create or replace function public.is_super_admin(check_user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles ur
    where ur.user_id = check_user_id and ur.role = 'super_admin'
  );
end; $$ language plpgsql security definer;

create or replace function public.is_admin(check_user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles ur
    where ur.user_id = check_user_id and ur.role in ('admin','super_admin')
  );
end; $$ language plpgsql security definer;
