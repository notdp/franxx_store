"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, AuthContextType, UserRole } from '../types';
import { supabase } from '../lib/supabase/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 模拟用户数据 - 方便调试使用
const MOCK_USER: User = {
  id: 'mock-user-franxx-001',
  email: 'pilot.002@franxx.dev',
  name: '驾驶员 002',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face&auto=format',
  provider: 'google',
  created_at: new Date().toISOString(),
  role: 'admin' as UserRole
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children, initialUser }: { children: React.ReactNode; initialUser?: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  // loading 表示会话加载中（是否已登录）
  const [loading, setLoading] = useState<boolean>(initialUser ? false : true);
  // roleLoading 表示角色信息加载中（用于权限判断）
  const [roleLoading, setRoleLoading] = useState<boolean>(initialUser ? false : true);

  // 获取用户角色的辅助函数
  const getUserRole = async (userId: string): Promise<UserRole> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return 'user';
      }
      
      return data?.role || 'user';
    } catch (error) {
      console.error('Error in getUserRole:', error);
      return 'user';
    }
  };

  useEffect(() => {
    // 检查是否使用模拟用户（可通过环境变量控制）
    const USE_MOCK_USER = process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true';
    
    if (USE_MOCK_USER) {
      setUser(MOCK_USER);
      setLoading(false);
      setRoleLoading(false);
      return;
    }

    // 如果 SSR 注入了用户，则跳过首次 getSession，直接建立订阅，避免首屏抖动
    if (initialUser) {
      setUser(initialUser);
      setLoading(false);
      setRoleLoading(false);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          // 用户状态变化时，重新拉取角色，保证与 RLS 同步
          try {
            setRoleLoading(true);
            const role = await getUserRole(session.user.id);
            const updated: User = {
              id: session.user.id,
              email: session.user.email || '',
              name:
                session.user.user_metadata?.full_name ||
                session.user.user_metadata?.name ||
                session.user.email?.split('@')[0] ||
                'User',
              avatar: session.user.user_metadata?.avatar_url,
              provider: (session.user.app_metadata?.provider || 'google') as 'google' | 'github',
              created_at: session.user.created_at,
              role,
            };
            setUser(updated);
          } catch (e) {
            console.error('Error fetching role (onAuthStateChange, SSR bootstrap):', e);
          } finally {
            setRoleLoading(false);
          }
        } else {
          setUser(null);
          setLoading(false);
          setRoleLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }

    // 生产环境：使用真实的Supabase认证（无 SSR 注入时）
    let didCancel = false;
    // 会话查询兜底，防止一直 pending
    const sessionSafetyTimer = setTimeout(() => {
      if (!didCancel) {
        console.warn('[Auth] Session check timeout, falling back to anonymous user');
        setLoading(false);
      }
    }, 5000);

    // 角色查询兜底（直接降级为普通用户，避免无限等待）
    let roleSafetyTimer: ReturnType<typeof setTimeout> | null = null;

    const fillUserFromSession = (sessionUser: any, role: UserRole = 'user') => {
      const userData: User = {
        id: sessionUser.id,
        email: sessionUser.email || '',
        name:
          sessionUser.user_metadata?.full_name ||
          sessionUser.user_metadata?.name ||
          sessionUser.email?.split('@')[0] ||
          'User',
        avatar: sessionUser.user_metadata?.avatar_url,
        provider: (sessionUser.app_metadata?.provider || 'google') as 'google' | 'github',
        created_at: sessionUser.created_at,
        role,
      };
      setUser(userData);
    };

    const getSession = async () => {
      setLoading(true);
      setRoleLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (didCancel) return;

        if (session?.user) {
          // 先用默认角色填充，尽快结束会话 loading
          fillUserFromSession(session.user, 'user');
          setLoading(false);

          // 开始加载角色，加入兜底
          roleSafetyTimer = setTimeout(() => {
            if (!didCancel) {
              console.warn('[Auth] Role fetch timeout, fallback to user role');
              setRoleLoading(false);
            }
          }, 3000);

          try {
            const role = await getUserRole(session.user.id);
            if (didCancel) return;
            fillUserFromSession(session.user, role);
          } catch (e) {
            console.error('Error fetching role:', e);
          } finally {
            if (!didCancel) setRoleLoading(false);
            if (roleSafetyTimer) clearTimeout(roleSafetyTimer);
          }
        } else {
          setUser(null);
          setLoading(false);
          setRoleLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setLoading(false);
        setRoleLoading(false);
      } finally {
        clearTimeout(sessionSafetyTimer);
      }
    };

    getSession();

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          // 先设置基础信息
          fillUserFromSession(session.user, 'user');
          setLoading(false);
          setRoleLoading(true);
        // 加入兜底
        if (roleSafetyTimer) clearTimeout(roleSafetyTimer);
        roleSafetyTimer = setTimeout(() => {
          if (!didCancel) {
            console.warn('[Auth] Role fetch timeout (onAuthStateChange)');
            setRoleLoading(false);
          }
        }, 3000);

        try {
          const role = await getUserRole(session.user.id);
          if (didCancel) return;
          fillUserFromSession(session.user, role);
        } catch (e) {
          console.error('Error fetching role (onAuthStateChange):', e);
        } finally {
          if (!didCancel) setRoleLoading(false);
          if (roleSafetyTimer) clearTimeout(roleSafetyTimer);
        }
      } else {
        setUser(null);
        setLoading(false);
        setRoleLoading(false);
      }
    });

    return () => {
      didCancel = true;
      clearTimeout(sessionSafetyTimer);
      if (roleSafetyTimer) clearTimeout(roleSafetyTimer);
      subscription.unsubscribe();
    };
  }, [initialUser]);

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    try {
      const USE_MOCK_USER = process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true';
      
      if (USE_MOCK_USER) {
        setUser(MOCK_USER);
        return { error: null };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Login error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Login failed:', error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      const USE_MOCK_USER = process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true';
      
      if (USE_MOCK_USER) {
        setUser(null);
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    roleLoading,
    signInWithOAuth,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
