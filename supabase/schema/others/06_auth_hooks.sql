-- Auth: Custom Access Token Hook
-- Inject application role into JWT as top-level `user_role` claim
-- and mirror to `app_metadata.app_role` for backward compatibility.

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  uid uuid := (event->>'user_id')::uuid;
  r public.app_role;
begin
  select public.get_app_role(uid) into r;
  claims := coalesce(event->'claims', '{}'::jsonb);
  -- top-level claim
  claims := jsonb_set(claims, '{user_role}', to_jsonb(r::text));
  -- nested claim for compatibility
  claims := jsonb_set(claims, '{app_metadata,app_role}', to_jsonb(r::text));
  event := jsonb_set(event, '{claims}', claims);
  return event;
end; $$;

do $$ begin
  grant usage on schema public to supabase_auth_admin;
  grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
  revoke execute on function public.custom_access_token_hook(jsonb) from public, anon, authenticated;
exception when others then
  null;
end $$;

