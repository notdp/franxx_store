-- 修复用户角色缺失问题

-- 1. 检查用户角色是否存在
SELECT * FROM public.user_roles 
WHERE user_id = 'bc836cbf-fd9c-4f30-be12-a4509358a946';

-- 2. 如果不存在，手动插入超级管理员角色
INSERT INTO public.user_roles (user_id, role)
VALUES ('bc836cbf-fd9c-4f30-be12-a4509358a946', 'super_admin'::public.app_role)
ON CONFLICT (user_id) DO UPDATE 
SET role = 'super_admin'::public.app_role,
    updated_at = NOW();

-- 3. 验证插入结果
SELECT * FROM public.user_roles 
WHERE user_id = 'bc836cbf-fd9c-4f30-be12-a4509358a946';

-- 4. 检查为什么触发器没有自动创建角色
-- 查看触发器函数的定义
SELECT prosrc FROM pg_proc 
WHERE proname = 'handle_new_user_role' 
AND pronamespace = 'public'::regnamespace;