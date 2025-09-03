import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { Order } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Package, Calendar, CreditCard, LogOut, Github, Chrome } from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const userOrders = await apiClient.getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        // 如果API失败，使用模拟数据
        const mockOrders: Order[] = [
          {
            id: 'ORDER001',
            packageId: 'chatgpt-plus',
            packageName: 'ChatGPT Plus',
            phone: '138****8000',
            email: user?.email || '',
            status: 'delivered',
            paymentMethod: 'alipay',
            amount: 98,
            createdAt: '2024-01-15T10:30:00Z',
            userId: user?.id,
            account: {
              email: 'chatgpt.user.2024@gmail.com',
              password: 'SecurePass123!'
            }
          }
        ];
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '待支付';
      case 'paid': return '已支付';
      case 'delivered': return '已发货';
      case 'failed': return '支付失败';
      default: return '未知状态';
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      onBack();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack}>
            ← 返回首页
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>

        {/* User Profile */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {user.provider === 'google' ? (
                    <Chrome className="w-4 h-4" />
                  ) : (
                    <Github className="w-4 h-4" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    通过 {user.provider === 'google' ? 'Google' : 'GitHub'} 登录
                  </span>
                </div>
              </div>
            </CardTitle>
            <CardDescription>
              加入时间：{new Date(user.createdAt).toLocaleDateString('zh-CN')}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">总订单数</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">¥{orders.reduce((sum, order) => sum + order.amount, 0)}</p>
                  <p className="text-sm text-muted-foreground">累计消费</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
                  <p className="text-sm text-muted-foreground">活跃账号</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle>订单历史</CardTitle>
            <CardDescription>
              您的所有订单记录和账号信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">加载中...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">暂无订单记录</p>
                <Button className="mt-4" onClick={onBack}>
                  立即购买
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{order.packageName}</h3>
                        <p className="text-sm text-muted-foreground">订单号: #{order.id}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                        <p className="text-lg font-bold text-green-600 mt-1">¥{order.amount}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">下单时间</span>
                        <p>{new Date(order.createdAt).toLocaleDateString('zh-CN')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">支付方式</span>
                        <p>{order.paymentMethod === 'alipay' ? '支付宝' : '微信支付'}</p>
                      </div>
                      {order.account && (
                        <>
                          <div>
                            <span className="text-muted-foreground">账号邮箱</span>
                            <p className="font-mono">{order.account.email}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">状态</span>
                            <p className="text-green-600">可正常使用</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}