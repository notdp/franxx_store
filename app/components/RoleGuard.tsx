'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback,
  redirectTo = '/'
}: RoleGuardProps) {
  const { user, loading, roleLoading } = useAuth();
  const router = useRouter();

  // 如果当前已知角色就有权限，直接渲染，避免等待角色刷新造成的转圈
  const hasPermissionNow = !!user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!loading && !roleLoading && user) {
      // 检查用户角色是否允许访问
      const hasPermission = allowedRoles.includes(user.role);
      
      if (!hasPermission) {
        console.log(`Access denied. User role: ${user.role}, Required: ${allowedRoles.join(', ')}`);
        router.push(redirectTo);
      }
    } else if (!loading && !user) {
      // 未登录用户重定向到登录页
      router.push('/login');
    }
  }, [user, loading, roleLoading, allowedRoles, redirectTo, router]);

  // 如果已有权限，直接放行
  if (hasPermissionNow) {
    return <>{children}</>;
  }

  // 加载中状态（会话或角色）
  if (loading || (user && roleLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">验证权限中...</p>
        </div>
      </div>
    );
  }

  // 未登录
  if (!user) {
    return fallback || null;
  }

  // 检查权限
  const hasPermission = allowedRoles.includes(user.role);
  
  if (!hasPermission) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">访问受限</h2>
          <p className="text-muted-foreground">您没有权限访问此页面</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// 便捷Hook：检查用户是否有特定角色
export function useRole() {
  const { user } = useAuth();
  
  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = (): boolean => {
    return hasRole(['admin', 'super_admin']);
  };

  const isSuperAdmin = (): boolean => {
    return hasRole(['super_admin']);
  };

  return {
    role: user?.role || 'user',
    hasRole,
    isAdmin,
    isSuperAdmin
  };
}
