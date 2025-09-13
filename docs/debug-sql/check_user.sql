-- 检查特定用户的所有信息
-- 用户 ID: bc836cbf-fd9c-4f30-be12-a4509358a946

-- 1. 检查 auth.users 表
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  raw_user_meta_data->>'full_name' as full_name,
  raw_app_meta_data->>'provider' as provider
FROM auth.users 
WHERE id = 'bc836cbf-fd9c-4f30-be12-a4509358a946';

-- 2. 检查 public.users 表
SELECT * FROM public.users 
WHERE id = 'bc836cbf-fd9c-4f30-be12-a4509358a946';

-- 3. 检查用户角色
SELECT * FROM public.user_roles 
WHERE user_id = 'bc836cbf-fd9c-4f30-be12-a4509358a946';

-- 4. 检查所有用户的角色分配
SELECT 
  u.email,
  ur.user_id,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC
LIMIT 10;

-- 5. 检查 handle_new_user_role 函数定义
SELECT 
  proname as function_name,
  prosrc as source_code
FROM pg_proc 
WHERE proname = 'handle_new_user_role' 
  AND pronamespace = 'public'::regnamespace;

-- 6. 检查触发器
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgtype,
  tgenabled
FROM pg_trigger 
WHERE tgname LIKE '%auth_user_created%';