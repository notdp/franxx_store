'use client';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      return;
    }

    // 生产环境：使用真实的Supabase认证
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // 获取用户角色
          const role = await getUserRole(session.user.id);
          
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            avatar: session.user.user_metadata?.avatar_url,
            provider: (session.user.app_metadata?.provider || 'google') as 'google' | 'github',
            created_at: session.user.created_at,
            role
          };
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (session?.user) {
        // 获取用户角色
        const role = await getUserRole(session.user.id);
        
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          avatar: session.user.user_metadata?.avatar_url,
          provider: (session.user.app_metadata?.provider || 'google') as 'google' | 'github',
          created_at: session.user.created_at,
          role
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    signInWithOAuth,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
