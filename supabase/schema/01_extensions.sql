-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto; -- gen_random_uuid(), pgp_sym_encrypt

-- Ensure a default crypto key for development (override in production)
do $$
declare db text := current_database();
begin
  begin
    execute format('alter database %I set app.crypto_key = %L', db, 'dev_only_change_me_change_in_prod');
  exception when others then
    -- ignore if not permitted
    null;
  end;
end $$;
