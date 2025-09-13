"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { decodeJwt } from 'jose'
import { User, AuthContextType, UserRole } from '@/types';
import { log } from '@/lib/log'
import { supabase } from '@/lib/supabase/client';
import { logout as serverLogout } from '@/actions/auth'
import { toast } from 'sonner'

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

// 已移除本地角色缓存：角色一律来自 Access Token 的自定义声明

export function AuthProvider({ children, initialUser }: { children: React.ReactNode; initialUser?: User | null }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  // loading 表示会话加载中（是否已登录）
  const [loading, setLoading] = useState<boolean>(initialUser ? false : true);
  // roleLoading 表示角色信息加载中（用于权限判断）
  const [roleLoading, setRoleLoading] = useState<boolean>(initialUser ? false : true);

  // 获取用户角色的辅助函数
  // 优先从 access_token 自定义 claim（user_role 或 app_metadata.app_role）读取，零网络
  const roleFromSessionToken = async (): Promise<UserRole | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) return null
      const payload: any = decodeJwt(token)
      const cand = payload?.user_role || payload?.app_metadata?.app_role || payload?.app_role || payload?.role
      if (cand === 'user' || cand === 'admin' || cand === 'super_admin') return cand
      return null
    } catch {
      return null
    }
  }

  // 不再发起 RPC；仅从 JWT 读取角色，缺省为 user。

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
          // 后台静默校正角色：来自 Access Token 或缓存
          try {
            const metaRole = await roleFromSessionToken()
            const role = (metaRole ?? 'user') as UserRole
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
            log.error('Auth', 'Error updating role (onAuthStateChange, SSR bootstrap):', e);
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
        log.warn('Auth', 'Session check timeout, falling back to anonymous user');
        setLoading(false);
      }
    }, 5000);

    const fillUserFromSession = (sessionUser: any, role: UserRole = 'user') => {
      const effectiveRole = role
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
        role: effectiveRole,
      };
      setUser(userData);
    };

    const readCookie = (name: string): string | null => {
      try {
        if (typeof document === 'undefined') return null
        const match = document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${encodeURIComponent(name)}=`))
        if (!match) return null
        const value = match.split('=')[1]
        return value ? decodeURIComponent(value) : null
      } catch { return null }
    }

    const seedSessionFromCookies = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) return
        const at = readCookie('sb-access-token') || readCookie('sb:access-token')
        const rt = readCookie('sb-refresh-token') || readCookie('sb:refresh-token')
        if (at && rt) {
          await supabase.auth.setSession({ access_token: at, refresh_token: rt })
        }
      } catch {}
    }

    const maybeForceRefreshOnHS256 = async () => {
      try {
        // 防止循环：只在本标签页尝试一次
        if (sessionStorage.getItem('franxx:refreshed-hs256') === '1') return
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        if (!token) return
        const headerB64 = token.split('.')[0]
        const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')))
        const alg = String(header?.alg || '')
        // 仅当 alg 仍为 HS* 且启用了本地 JWKS（代表我们期望 ES256）时，做一次刷新尝试
        const wantEs256 = Boolean(process.env.NEXT_PUBLIC_FORCE_REFRESH_ON_HS256 === '1')
        if (wantEs256 && alg.startsWith('HS')) {
          const { error } = await supabase.auth.refreshSession()
          if (!error) sessionStorage.setItem('franxx:refreshed-hs256', '1')
        }
      } catch {}
    }

    const getSession = async () => {
      setLoading(true);
      setRoleLoading(true);
      try {
        // Ensure browser client is hydrated from cookies after OAuth callback
        await seedSessionFromCookies()
        const {
          data: { session },
        } = await supabase.auth.getSession();
        // 若检测到 HS256，而我们期望 ES256，则尝试一次刷新
        await maybeForceRefreshOnHS256()

        if (didCancel) return;

        if (session?.user) {
          // 角色来自 JWT claim；不再发 RPC/不再依赖本地缓存
          const metaRole = await roleFromSessionToken()
          const role = (metaRole ?? 'user') as UserRole
          fillUserFromSession(session.user, role)
          setLoading(false)
          setRoleLoading(false)
        } else {
          setUser(null);
          setLoading(false);
          setRoleLoading(false);
        }
      } catch (error) {
        log.error('Auth', 'Error getting session:', error);
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
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const metaRole = await roleFromSessionToken()
        const role = (metaRole ?? 'user') as UserRole
        fillUserFromSession(session.user, role)
        setLoading(false)
        setRoleLoading(false)
      } else {
        setUser(null)
        setLoading(false)
        setRoleLoading(false)
      }
    });

    return () => {
      didCancel = true;
      clearTimeout(sessionSafetyTimer);
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

      // 保留登录前目标页（/login?next=...）
      let nextParam = '/'
      try {
        const url = new URL(window.location.href)
        const q = url.searchParams.get('next')
        if (q && q.startsWith('/')) nextParam = q
      } catch {}

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParam)}`
        }
      });
      
      if (error) {
        log.error('Auth', `${provider} login error:`, error);
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      log.error('Auth', 'Login failed:', error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      const USE_MOCK_USER = process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true';

      if (USE_MOCK_USER) {
        setUser(null);
        toast.success('已退出登录');
        return;
      }

      await toast.promise(
        (async () => {
          try { await serverLogout() } catch (e) { log.warn('Auth', 'Server logout failed (ignored):', e) }
          const { error } = await supabase.auth.signOut();
          if (error) {
            log.error('Auth', 'Logout error:', error);
            throw error;
          }
          try {
            const expire = 'Thu, 01 Jan 1970 00:00:00 GMT'
            document.cookie = `sb-access-token=; expires=${expire}; path=/;`
            document.cookie = `sb-refresh-token=; expires=${expire}; path=/;`
          } catch {}
          try {
            Object.keys(localStorage).forEach((k) => {
              if (k.startsWith('franxx:role:') || k.startsWith('frx_role:')) localStorage.removeItem(k)
            })
          } catch {}
          setUser(null);
          try {
            router.replace('/')
            router.refresh()
          } catch {}
        })(),
        {
          loading: '正在退出...\u200b',
          success: '已安全退出',
          error: '退出失败，请重试',
        }
      )
    } catch (error) {
      log.error('Auth', 'Logout failed:', error);
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
