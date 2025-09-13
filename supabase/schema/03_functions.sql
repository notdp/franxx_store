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

-- Return app role as a single source of truth
create or replace function public.get_app_role(check_user_id uuid)
returns public.app_role
language plpgsql
stable
security definer
as $$
declare
  r public.app_role := 'user';
begin
  select ur.role into r from public.user_roles ur where ur.user_id = check_user_id;
  if r is null then
    return 'user';
  end if;
  return r;
end; $$;

-- Crypto helpers for sensitive fields (requires pgcrypto and app.crypto_key)
create or replace function public.encrypt_text(p_text text)
returns text
language sql
stable
as $$
  select case when p_text is null then null
              else encode(pgp_sym_encrypt(p_text, current_setting('app.crypto_key', true)), 'base64') end;
$$;

create or replace function public.decrypt_text(p_cipher text)
returns text
language plpgsql
stable
as $$
declare
  v_plain text;
begin
  if p_cipher is null then
    return null;
  end if;
  begin
    v_plain := convert_from(pgp_sym_decrypt(decode(p_cipher, 'base64'), current_setting('app.crypto_key', true)), 'utf8');
    return v_plain;
  exception when others then
    -- not decryptable (not ours), return null to avoid leaking
    return null;
  end;
end; $$;

create or replace function public.is_encrypted_text(p_text text)
returns boolean
language plpgsql
stable
as $$
declare
  dummy text;
begin
  if p_text is null then return false; end if;
  begin
    dummy := public.decrypt_text(p_text);
    return dummy is not null;
  exception when others then
    return false;
  end;
end; $$;

-- Auto-encrypt PAN/CVV on insert/update
create or replace function public.encrypt_virtual_card_fields()
returns trigger as $$
begin
  if new.pan_encrypted is not null and not public.is_encrypted_text(new.pan_encrypted) then
    new.pan_encrypted := public.encrypt_text(new.pan_encrypted);
  end if;
  if new.cvv_encrypted is not null and not public.is_encrypted_text(new.cvv_encrypted) then
    new.cvv_encrypted := public.encrypt_text(new.cvv_encrypted);
  end if;
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_virtual_cards_encrypt on public.virtual_cards;
create trigger trg_virtual_cards_encrypt
before insert or update on public.virtual_cards
for each row execute function public.encrypt_virtual_card_fields();

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

-- Cleanup removed enum type after models have been applied
do $$ begin
  if exists (select 1 from pg_type where typnamespace = 'public'::regnamespace and typname = 'card_brand') then
    execute 'drop type public.card_brand';
  end if;
end $$;

-- =============================================================
-- Auth Hook: Customize Access Token (JWT) Claims
-- Inject application role into the JWT at issue/refresh time.
-- This function is invoked by Supabase Auth with an `event jsonb` payload
-- containing at least `{ "user_id": "<uuid>", "claims": { ... } }`.
-- It must return the modified event jsonb (with updated `claims`).
--
-- We write `app_metadata.app_role` so our middleware/server can read it
-- without an extra RPC. The underlying role source is public.user_roles via
-- the existing security-definer helper public.get_app_role(uuid).
-- =============================================================
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  app_role_value public.app_role;
  uid uuid := (event->>'user_id')::uuid;
begin
  -- Read role from our single source of truth
  select public.get_app_role(uid) into app_role_value;

  -- Start from existing claims, ensure object
  claims := coalesce(event->'claims', '{}'::jsonb);

  -- Write nested claim: app_metadata.app_role
  claims := jsonb_set(claims, '{app_metadata,app_role}', to_jsonb(app_role_value::text));

  -- Persist back into event and return
  event := jsonb_set(event, '{claims}', claims);
  return event;
end; $$;

-- Permissions for the Auth hook runner
do $$ begin
  grant usage on schema public to supabase_auth_admin;
  grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
  revoke execute on function public.custom_access_token_hook(jsonb) from public, anon, authenticated;
exception when others then
  -- ignore in local migrations where role may not exist
  null;
end $$;
