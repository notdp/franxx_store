-- Development seed data

-- Ensure initial super_admin for dp0x7ce@gmail.com (dev convenience)
-- Prerequisite: the user has signed in at least once so there is a row in auth.users
-- RLS blocks inserts on public.user_roles for non-super admins, so temporarily disable RLS
do $$ begin
  if exists (select 1 from auth.users where email = 'dp0x7ce@gmail.com') then
    execute 'alter table public.user_roles disable row level security';
    insert into public.user_roles (user_id, role)
    select id, 'super_admin'::public.app_role
    from auth.users
    where email = 'dp0x7ce@gmail.com'
    on conflict (user_id) do update set role = excluded.role;
    execute 'alter table public.user_roles enable row level security';
  end if;
end $$;
