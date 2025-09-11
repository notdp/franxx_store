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

-- Set crypto key for this session if not present
do $$ begin
  perform set_config('app.crypto_key', coalesce(current_setting('app.crypto_key', true), 'dev_only_change_me_change_in_prod'), false);
end $$;

-- Ensure session GUC is set (fallback)
set app.crypto_key = 'dev_only_change_me_change_in_prod';

-- Seed sample virtual cards for development
do $$ begin
  -- Temporarily disable RLS to allow seeding
  execute 'alter table public.virtual_cards disable row level security';

  -- Upsert a small pool of dev cards (sensitive data only for local/dev)
  insert into public.virtual_cards (
    pan_encrypted, last4, expiry_date, cvv_encrypted, provider,
    holder_name, balance, currency, status, monthly_limit, used_this_month, notes
  ) values
    (public.encrypt_text('4183960034898921'), '8921', '2028/07', public.encrypt_text('028'), 'gomoney',  'Fiddausi Muhamamd', 450.00, 'USD', 'active',   1000.00, 120.00, 'dev seed'),
    (public.encrypt_text('5412987654321098'), '1098', '2027/12', public.encrypt_text('456'), 'timon',    'Ahmed Ibrahim',     120.50, 'USD', 'active',    800.00,  75.25, 'dev seed'),
    (public.encrypt_text('6011234567890123'), '0123', '2026/03', public.encrypt_text('789'), 'feiyangka','Fatima Hassan',      75.25, 'USD', 'frozen',    500.00,  20.00, 'dev seed'),
    (public.encrypt_text('4539912345678901'), '8901', '2029/01', public.encrypt_text('123'), 'gomoney',  'John Doe',          200.00, 'NGN', 'active',    600.00, 150.00, 'dev seed'),
    (public.encrypt_text('371449635398431'),  '8431', '2027/05', public.encrypt_text('999'), 'timon',    'Jane Smith',         10.00, 'USD', 'expired',   300.00, 300.00, 'dev seed')
  on conflict (pan_encrypted) do update set
    last4 = excluded.last4,
    expiry_date = excluded.expiry_date,
    cvv_encrypted = excluded.cvv_encrypted,
    provider = excluded.provider,
    holder_name = excluded.holder_name,
    balance = excluded.balance,
    currency = excluded.currency,
    status = excluded.status,
    monthly_limit = excluded.monthly_limit,
    used_this_month = excluded.used_this_month,
    notes = excluded.notes,
    updated_at = timezone('utc'::text, now());

  -- Re-enable RLS after seeding
  execute 'alter table public.virtual_cards enable row level security';
end $$;
