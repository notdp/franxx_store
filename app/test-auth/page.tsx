'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { packageService, orderService } from '../lib/supabase/database';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Package, Order } from '../types';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TestAuthPage() {
  const { user, loading, signInWithOAuth, logout } = useAuth();
  const [testResults, setTestResults] = useState<{
    auth: 'pending' | 'success' | 'error';
    packages: 'pending' | 'success' | 'error';
    orders: 'pending' | 'success' | 'error';
  }>({
    auth: 'pending',
    packages: 'pending',
    orders: 'pending'
  });
  const [packages, setPackages] = useState<Package[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // 测试认证状态
    if (!loading) {
      setTestResults(prev => ({
        ...prev,
        auth: user ? 'success' : 'error'
      }));
    }
  }, [user, loading]);

  const testDatabaseConnection = async () => {
    // 测试获取套餐
    try {
      const packagesData = await packageService.getAll();
      setPackages(packagesData);
      setTestResults(prev => ({ ...prev, packages: 'success' }));
    } catch (err) {
      console.error('Failed to fetch packages:', err);
      setTestResults(prev => ({ ...prev, packages: 'error' }));
    }

    // 测试获取订单（需要登录）
    if (user) {
      try {
        const ordersData = await orderService.getByUserId(user.id);
        setOrders(ordersData);
        setTestResults(prev => ({ ...prev, orders: 'success' }));
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setTestResults(prev => ({ ...prev, orders: 'error' }));
      }
    }
  };

  const handleLogin = async (provider: 'google' | 'github') => {
    setError('');
    try {
      const result = await signInWithOAuth(provider);
      if (result.error) {
        setError(result.error.message || `${provider} 登录失败`);
      }
    } catch (err: any) {
      setError(err.message || '登录失败');
    }
  };

  const StatusIcon = ({ status }: { status: 'pending' | 'success' | 'error' }) => {
    if (status === 'pending') return <Loader2 className="w-4 h-4 animate-spin" />;
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Supabase 集成测试</h1>

      {/* 认证状态 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            认证状态
            <StatusIcon status={testResults.auth} />
          </CardTitle>
          <CardDescription>测试 Google 和 GitHub OAuth 登录</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>正在检查认证状态...</span>
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-800">已登录</p>
                <p className="text-sm text-gray-600 mt-1">用户ID: {user.id}</p>
                <p className="text-sm text-gray-600">邮箱: {user.email}</p>
                <p className="text-sm text-gray-600">提供商: {user.provider}</p>
              </div>
              <Button onClick={logout} variant="outline">
                退出登录
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">未登录，请选择登录方式：</p>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <Button onClick={() => handleLogin('google')}>
                  使用 Google 登录
                </Button>
                <Button onClick={() => handleLogin('github')}>
                  使用 GitHub 登录
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 数据库连接测试 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>数据库连接测试</CardTitle>
          <CardDescription>测试 Supabase 数据库查询功能</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testDatabaseConnection}>
            运行数据库测试
          </Button>

          {/* 套餐查询结果 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">套餐查询：</span>
              <StatusIcon status={testResults.packages} />
            </div>
            {packages.length > 0 && (
              <div className="pl-4 text-sm text-gray-600">
                成功获取 {packages.length} 个套餐
                <ul className="mt-1">
                  {packages.map(pkg => (
                    <li key={pkg.id}>• {pkg.name} - ¥{pkg.salePrice}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 订单查询结果 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">订单查询：</span>
              <StatusIcon status={testResults.orders} />
            </div>
            {user && orders.length > 0 && (
              <div className="pl-4 text-sm text-gray-600">
                成功获取 {orders.length} 个订单
              </div>
            )}
            {!user && (
              <div className="pl-4 text-sm text-gray-500">
                需要登录后才能查询订单
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 环境变量检查 */}
      <Card>
        <CardHeader>
          <CardTitle>环境变量配置</CardTitle>
          <CardDescription>检查 Supabase 环境变量是否正确配置</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                <span className="text-green-600">✓ 已配置</span>
              ) : (
                <span className="text-red-600">✗ 未配置</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                <span className="text-green-600">✓ 已配置</span>
              ) : (
                <span className="text-red-600">✗ 未配置</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">模拟用户模式:</span>
              {process.env.NEXT_PUBLIC_USE_MOCK_USER === 'true' ? (
                <span className="text-yellow-600">启用（开发模式）</span>
              ) : (
                <span className="text-blue-600">禁用（生产模式）</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}