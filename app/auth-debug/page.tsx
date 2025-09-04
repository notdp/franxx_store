'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase/client';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function AuthDebugPage() {
  const { user, loading } = useAuth();
  const [supabaseSession, setSupabaseSession] = useState<any>(null);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  
  useEffect(() => {
    checkSupabaseSession();
  }, []);

  const checkSupabaseSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSupabaseSession(session);
    
    const { data: { user } } = await supabase.auth.getUser();
    setSupabaseUser(user);
  };

  const refreshSession = async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Refresh error:', error);
    } else {
      console.log('Session refreshed:', session);
      checkSupabaseSession();
      window.location.reload();
    }
  };

  const clearSession = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">认证状态调试</h1>

      <div className="space-y-6">
        {/* Context 状态 */}
        <Card>
          <CardHeader>
            <CardTitle>AuthContext 状态</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify({ user, loading }, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Supabase Session */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase Session (直接查询)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(supabaseSession, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Supabase User */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase User (直接查询)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(supabaseUser, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <Card>
          <CardHeader>
            <CardTitle>调试操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button onClick={checkSupabaseSession}>
                重新检查会话
              </Button>
              <Button onClick={refreshSession}>
                刷新会话
              </Button>
              <Button onClick={clearSession} variant="destructive">
                清除会话
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 如果 Supabase Session 存在但 AuthContext 为空，说明状态同步有问题</p>
              <p>• 如果两者都为空，说明未登录</p>
              <p>• 刷新会话可以尝试修复同步问题</p>
            </div>
          </CardContent>
        </Card>

        {/* LocalStorage 信息 */}
        <Card>
          <CardHeader>
            <CardTitle>LocalStorage 中的 Supabase 数据</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {typeof window !== 'undefined' ? 
                JSON.stringify(
                  Object.keys(localStorage)
                    .filter(key => key.includes('supabase'))
                    .reduce((acc: any, key) => {
                      try {
                        acc[key] = JSON.parse(localStorage.getItem(key) || '');
                      } catch {
                        acc[key] = localStorage.getItem(key);
                      }
                      return acc;
                    }, {}),
                  null,
                  2
                )
                : 'Loading...'
              }
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}