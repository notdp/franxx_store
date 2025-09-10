import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, CreditCard, Eye, EyeOff, Copy, User, History, RefreshCw, LogIn } from 'lucide-react';

interface OrderQueryProps {
  onLogin?: () => void;
}

export function OrderQuery({ onLogin }: OrderQueryProps) {
  const { user } = useAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<{[key: string]: boolean}>({});
  const [refreshing, setRefreshing] = useState(false);

  const loadUserOrders = useCallback(async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      const orders = await apiClient.getUserOrders();
      setUserOrders(orders);
    } catch (error) {
      console.error('Failed to load user orders:', error);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  // 获取用户订单历史
  useEffect(() => {
    if (user) {
      loadUserOrders();
    }
  }, [user, loadUserOrders]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '待支付';
      case 'processing': return '处理中';
      case 'delivered': return '已发货';
      case 'failed': return '支付失败';
      default: return '未知状态';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const togglePasswordVisibility = (orderId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const renderOrderCard = (orderData: Order) => (
    <Card key={orderData.id} className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>订单 #{orderData.id}</span>
          </span>
          <Badge className={getStatusColor(orderData.status)}>
            {getStatusText(orderData.status)}
          </Badge>
        </CardTitle>
        <CardDescription>
          {orderData.packageName} • 下单时间：{new Date(orderData.createdAt).toLocaleString('zh-CN')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">套餐名称</span>
            <p className="font-semibold">{orderData.packageName}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">支付金额</span>
            <p className="font-semibold text-green-600">¥{orderData.amount}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">支付方式</span>
            <p className="font-semibold">{orderData.paymentMethod === 'alipay' ? '支付宝' : '微信支付'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">联系邮箱</span>
            <p className="font-semibold">{orderData.email}</p>
          </div>
        </div>

        {orderData.account && orderData.status === 'delivered' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold mb-3 text-green-800 flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>ChatGPT 账号信息</span>
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">账号邮箱</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 p-2 bg-white rounded-md font-mono text-sm border">
                    {orderData.account.email}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(orderData.account!.email)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">账号密码</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 p-2 bg-white rounded-md font-mono text-sm border">
                    {showPassword[orderData.id] ? orderData.account.password : '••••••••••••'}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => togglePasswordVisibility(orderData.id)}
                  >
                    {showPassword[orderData.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(orderData.account!.password)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                💡 请访问 <strong>chat.openai.com</strong> 使用您的账号，建议首次登录后修改密码
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // 未登录用户显示登录提示
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="mb-4">订单查询</h1>
            <p className="text-muted-foreground">
              请先登录查看您的订单历史
            </p>
          </div>

          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>
              
              <h3 className="font-semibold mb-3">需要登录查看订单</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                为了保护您的隐私和订单安全，订单查询功能仅对登录用户开放。
                登录后您可以查看所有订单历史和账号信息。
              </p>

              <div className="space-y-4 max-w-sm mx-auto">
                <Button 
                  onClick={onLogin} 
                  className="w-full"
                  size="lg"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  立即登录
                </Button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-blue-700 mb-2">
                    <User className="w-4 h-4" />
                    <span className="font-semibold text-sm">登录后您可以：</span>
                  </div>
                  <ul className="text-sm space-y-1 text-blue-600">
                    <li>• 📋 查看所有订单历史</li>
                    <li>• 🔐 安全管理账号信息</li>
                    <li>• 🚀 享受一键下单体验</li>
                    <li>• 📱 支持Google/GitHub登录</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              如有任何问题，请联系客服：400-000-0000
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 已登录用户显示订单历史
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="mb-4">我的订单</h1>
          <p className="text-muted-foreground">
            欢迎回来，{user.name}！查看您的所有订单记录和账号信息
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>订单历史</span>
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadUserOrders}
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  刷新
                </Button>
              </CardTitle>
              <CardDescription>
                您的所有订单记录和账号信息
              </CardDescription>
            </CardHeader>
          </Card>

          {loading ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">加载订单中...</p>
              </CardContent>
            </Card>
          ) : userOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">还没有订单</h3>
                <p className="text-muted-foreground mb-4">去选择一个套餐开始您的 ChatGPT 之旅吧！</p>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  浏览套餐
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userOrders.map(order => renderOrderCard(order))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2 text-blue-800">💡 小提示</h4>
            <p className="text-sm text-blue-700">
              登录用户可以查看所有历史订单，账号信息永久保存在您的个人中心
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            如有任何问题，请联系客服：400-000-0000
          </p>
        </div>
      </div>
    </div>
  );
}
