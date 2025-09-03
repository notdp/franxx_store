'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabase/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 模拟用户数据 - 方便调试使用
const MOCK_USER: User = {
  id: 'mock-user-franxx-001',
  email: 'pilot.002@franxx.dev',
  name: '驾驶员 002',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face&auto=format',
  provider: 'google',
  created_at: new Date().toISOString()
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 默认设置为模拟用户，方便调试
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [loading, setLoading] = useState(false); // 设置为false，跳过加载状态

  useEffect(() => {
    // 在开发环境中使用模拟用户，生产环境中使用真实认证
    const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    
    if (isDevelopment) {
      // 开发环境：使用模拟用户
      console.log('🚀 Development mode: Using mock user for debugging');
      setUser(MOCK_USER);
      setLoading(false);
      return;
    }

    // 生产环境：使用真实的Supabase认证
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
            avatar: session.user.user_metadata?.avatar_url,
            provider: (session.user.app_metadata?.provider || 'google') as 'google' | 'github',
            created_at: session.user.created_at
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
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
          avatar: session.user.user_metadata?.avatar_url,
          provider: (session.user.app_metadata?.provider || 'google') as 'google' | 'github',
          created_at: session.user.created_at
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (provider: 'google' | 'github') => {
    try {
      const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
      
      if (isDevelopment) {
        // 开发环境：模拟登录成功
        console.log(`🚀 Mock login with ${provider}`);
        setUser(MOCK_USER);
        return;
      }

      // 生产环境：真实登录
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
      
      if (isDevelopment) {
        // 开发环境：模拟登出，但立即重新设置为模拟用户
        console.log('🚀 Mock logout (will remain logged in for debugging)');
        // 可以选择是否在开发环境中允许登出
        // setUser(null);
        return;
      }

      // 生产环境：真实登出
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
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}