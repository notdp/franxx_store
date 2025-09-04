-- 修复角色表的RLS策略循环引用问题

-- 先删除有问题的策略
DROP POLICY IF EXISTS "Super admin can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admin can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admin can insert roles" ON public.user_roles;

-- 创建一个安全定义器函数来检查用户是否是超级管理员
-- SECURITY DEFINER 函数以创建者的权限运行，绕过RLS
CREATE OR REPLACE FUNCTION public.is_super_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_roles 
        WHERE user_id = check_user_id 
        AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 重新创建策略，使用新的函数避免循环引用
CREATE POLICY "Super admin can view all roles" ON public.user_roles
    FOR SELECT USING (
        auth.uid() = user_id OR 
        public.is_super_admin(auth.uid())
    );

CREATE POLICY "Super admin can update roles" ON public.user_roles
    FOR UPDATE USING (
        public.is_super_admin(auth.uid())
    );

CREATE POLICY "Super admin can insert roles" ON public.user_roles
    FOR INSERT WITH CHECK (
        public.is_super_admin(auth.uid())
    );

-- 删除冗余的"Users can view own role"策略，因为已经包含在新策略中
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;