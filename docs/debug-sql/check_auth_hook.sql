-- 检查 Auth Hook 配置

-- 1. 检查 custom_access_token_hook 函数是否存在
SELECT 
  proname as function_name,
  prosrc as source_code
FROM pg_proc 
WHERE proname = 'custom_access_token_hook' 
  AND pronamespace = 'public'::regnamespace;

-- 2. 检查 Auth Hook 配置（需要在 Supabase Dashboard 中查看）
-- 路径：Authentication -> Hooks -> Custom Access Token Hook
-- 应该配置为：public.custom_access_token_hook

-- 3. 测试 get_app_role 函数
SELECT public.get_app_role('bc836cbf-fd9c-4f30-be12-a4509358a946');

-- 4. 检查函数权限
SELECT 
  p.proname,
  r.rolname,
  has_function_privilege(r.rolname, p.oid, 'EXECUTE') as can_execute
FROM pg_proc p
CROSS JOIN pg_roles r
WHERE p.proname IN ('custom_access_token_hook', 'get_app_role')
  AND p.pronamespace = 'public'::regnamespace
  AND r.rolname IN ('supabase_auth_admin', 'authenticated', 'anon', 'public')
ORDER BY p.proname, r.rolname;