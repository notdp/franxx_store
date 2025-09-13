-- 修复远程数据库中的用户角色触发器函数
-- 问题：函数中的 CASE 语句返回值缺少类型转换，导致类型不匹配错误（42804）

-- 1. 首先删除可能存在的旧函数（handle_new_user 是错误的名称）
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. 创建或替换正确的函数，确保使用类型转换
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id,
    -- 注意：这里必须使用类型转换 ::public.app_role
    CASE 
      WHEN new.email = 'dp0x7ce@gmail.com' THEN 'super_admin'::public.app_role 
      ELSE 'user'::public.app_role 
    END
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 确保触发器正确设置
DROP TRIGGER IF EXISTS trg_on_auth_user_created_role ON auth.users;
CREATE TRIGGER trg_on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- 4. 如果存在旧的错误触发器，删除它
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 5. 验证 app_role 枚举类型存在
DO $$ 
BEGIN
  -- 如果类型不存在，创建它
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'super_admin');
  END IF;
END $$;

-- 6. 验证 user_roles 表结构
-- 确保 role 字段使用正确的类型
DO $$
BEGIN
  -- 检查并修正 role 字段类型
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_roles' 
    AND column_name = 'role'
    AND data_type != 'USER-DEFINED'
  ) THEN
    -- 如果 role 字段不是枚举类型，修改它
    ALTER TABLE public.user_roles 
    ALTER COLUMN role TYPE public.app_role 
    USING role::text::public.app_role;
  END IF;
END $$;

-- 输出验证信息
SELECT 
  'Function check:' as info,
  proname as function_name,
  pg_get_functiondef(oid) as definition
FROM pg_proc 
WHERE proname IN ('handle_new_user', 'handle_new_user_role') 
  AND pronamespace = 'public'::regnamespace;

SELECT 
  'Trigger check:' as info,
  tgname as trigger_name,
  tgrelid::regclass as table_name
FROM pg_trigger 
WHERE tgname LIKE '%auth_user_created%';

SELECT 
  'Role column type:' as info,
  column_name,
  data_type,
  udt_name
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'user_roles' 
  AND column_name = 'role';