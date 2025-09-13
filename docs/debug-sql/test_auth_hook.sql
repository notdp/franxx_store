-- 测试 Auth Hook 函数
-- 模拟 Supabase Auth 调用 custom_access_token_hook

-- 创建测试事件（模拟 Supabase 传入的 event）
DO $$
DECLARE
  test_event jsonb;
  result jsonb;
BEGIN
  -- 模拟传入的 event 对象
  test_event := jsonb_build_object(
    'user_id', 'bc836cbf-fd9c-4f30-be12-a4509358a946',
    'claims', jsonb_build_object(
      'sub', 'bc836cbf-fd9c-4f30-be12-a4509358a946',
      'email', 'dp0x7ce@gmail.com',
      'aud', 'authenticated',
      'role', 'authenticated'
    )
  );
  
  -- 调用 hook 函数
  result := public.custom_access_token_hook(test_event);
  
  -- 输出结果
  RAISE NOTICE 'Input event: %', test_event;
  RAISE NOTICE 'Output event: %', result;
  RAISE NOTICE 'Claims after hook: %', result->'claims';
  RAISE NOTICE 'app_metadata.app_role: %', result->'claims'->'app_metadata'->'app_role';
END $$;

-- 验证函数权限
SELECT 
  'custom_access_token_hook' as function_name,
  r.rolname as role,
  has_function_privilege(r.rolname, 'public.custom_access_token_hook(jsonb)'::regprocedure, 'EXECUTE') as can_execute
FROM pg_roles r
WHERE r.rolname IN ('supabase_auth_admin', 'authenticated', 'anon', 'public', 'postgres')
ORDER BY r.rolname;