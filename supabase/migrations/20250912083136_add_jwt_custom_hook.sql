-- =============================================================
-- Auth Hook: Customize Access Token (JWT) Claims
-- Inject application role into the JWT at issue/refresh time.
-- This function is invoked by Supabase Auth with an `event jsonb` payload
-- containing at least `{ "user_id": "<uuid>", "claims": { ... } }`.
-- It must return the modified event jsonb (with updated `claims`).
--
-- We write `user_role` (top-level) and `app_metadata.app_role` so our
-- middleware/server can read it without an extra RPC. The underlying role
-- source is public.user_roles via
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

  -- Write both claims: top-level and nested
  claims := jsonb_set(claims, '{user_role}', to_jsonb(app_role_value::text));
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
