import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  RefreshCw
} from 'lucide-react';

export function DashboardOverview() {
  // 模拟数据
  const stats = {
    revenue: {
      today: 1754,
      yesterday: 1532,
      month: 45420,
      growth: 14.5
    },
    orders: {
      today: 18,
      yesterday: 15,
      month: 387,
      growth: 20.0
    },
    users: {
      total: 2845,
      active: 245,
      new: 12,
      growth: 8.3
    },
    accounts: {
      total: 156,
      available: 89,
      assigned: 67,
      low_stock: 12
    }
  };

  const recentOrders = [
    { id: 'ORDER789012', package: 'ChatGPT Plus', amount: 98, status: 'delivered', time: '2分钟前' },
    { id: 'ORDER789011', package: 'ChatGPT Pro', amount: 158, status: 'processing', time: '5分钟前' },
    { id: 'ORDER789010', package: 'ChatGPT Team', amount: 298, status: 'delivered', time: '8分钟前' },
    { id: 'ORDER789009', package: 'ChatGPT Plus', amount: 98, status: 'pending', time: '12分钟前' },
    { id: 'ORDER789008', package: 'ChatGPT Pro', amount: 158, status: 'delivered', time: '15分钟前' }
  ];

  const alerts = [
    { type: 'warning', message: 'ChatGPT Plus 账号库存不足，仅剩 12 个', time: '10分钟前' },
    { type: 'error', message: '虚拟卡 4532****1234 余额不足', time: '25分钟前' },
    { type: 'info', message: '系统维护计划：明日 02:00-04:00', time: '1小时前' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return '已发货';
      case 'processing': return '处理中';
      case 'pending': return '待支付';
      default: return status;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日收入</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{stats.revenue.today.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{stats.revenue.growth}%</span>
              <span>较昨日</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日订单</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.today}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{stats.orders.growth}%</span>
              <span>较昨日</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在线用户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.active}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{stats.users.growth}%</span>
              <span>总用户 {stats.users.total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">可用账号</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accounts.available}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
              <span className="text-yellow-600">{stats.accounts.low_stock} 低库存</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 实时数据 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 最近订单 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>最近订单</CardTitle>
                  <CardDescription>实时订单状态监控</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  查看全部
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.package}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-medium text-sm">¥{order.amount}</p>
                      <p className="text-xs text-muted-foreground">{order.time}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 库存状态 */}
          <Card>
            <CardHeader>
              <CardTitle>库存状态</CardTitle>
              <CardDescription>ChatGPT 账号库存监控</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">ChatGPT Plus</span>
                  <span className="text-sm font-medium">45/100</span>
                </div>
                <Progress value={45} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>库存偏低</span>
                  <span>建议补充</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">ChatGPT Pro</span>
                  <span className="text-sm font-medium">78/120</span>
                </div>
                <Progress value={65} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>库存正常</span>
                  <span>充足</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">ChatGPT Team</span>
                  <span className="text-sm font-medium">23/50</span>
                </div>
                <Progress value={46} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>库存偏低</span>
                  <span>需要关注</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 侧边栏信息 */}
        <div className="space-y-6">
          {/* 系统状态 */}
          <Card>
            <CardHeader>
              <CardTitle>系统状态</CardTitle>
              <CardDescription>实时系统监控</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">支付系统</p>
                  <p className="text-xs text-muted-foreground">运行正常</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">自动发货</p>
                  <p className="text-xs text-muted-foreground">运行正常</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">邮件服务</p>
                  <p className="text-xs text-muted-foreground">轻微延迟</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">数据库</p>
                  <p className="text-xs text-muted-foreground">运行正常</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 系统通知 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>系统通知</CardTitle>
                  <CardDescription>重要提醒和警告</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{alert.message}</p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
              <CardDescription>常用管理功能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Package className="w-4 h-4 mr-2" />
                导入新账号
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                充值虚拟卡
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="w-4 h-4 mr-2" />
                手动发货
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
