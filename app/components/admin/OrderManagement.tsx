import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ShoppingCart, Search, Filter, Download, Eye, Package } from 'lucide-react';

export function OrderManagement() {
  // 模拟订单数据
  const orders = [
    {
      id: 'ORDER789012',
      userId: 'user123',
      userEmail: 'user@example.com',
      packageName: 'ChatGPT Plus',
      amount: 98,
      status: 'delivered',
      paymentMethod: 'alipay',
      createdAt: '2024-01-20 14:30',
      deliveredAt: '2024-01-20 14:35'
    },
    {
      id: 'ORDER789011',
      userId: 'user456',
      userEmail: 'user2@example.com',
      packageName: 'ChatGPT Pro',
      amount: 158,
      status: 'paid',
      paymentMethod: 'wechat',
      createdAt: '2024-01-20 14:25',
      deliveredAt: null
    },
    // 更多订单...
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return '已发货';
      case 'paid': return '已支付';
      case 'pending': return '待支付';
      case 'failed': return '支付失败';
      default: return status;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日订单</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">较昨日 +20%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待处理</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">需要手动发货</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成功率</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">订单成功率</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日收入</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥1,754</div>
            <p className="text-xs text-muted-foreground">较昨日 +14.5%</p>
          </CardContent>
        </Card>
      </div>

      {/* 订单管理 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>订单管理</CardTitle>
              <CardDescription>管理所有订单和支付状态</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 搜索和筛选 */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="搜索订单号、用户邮箱..." className="pl-10" />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待支付</SelectItem>
                <SelectItem value="paid">已支付</SelectItem>
                <SelectItem value="delivered">已发货</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="商品" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部商品</SelectItem>
                <SelectItem value="plus">ChatGPT Plus</SelectItem>
                <SelectItem value="pro">ChatGPT Pro</SelectItem>
                <SelectItem value="team">ChatGPT Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 订单表格 */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单信息</TableHead>
                <TableHead>用户</TableHead>
                <TableHead>商品</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>支付方式</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.id}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">#{order.userId}</div>
                      <div className="text-sm text-muted-foreground">{order.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.packageName}</TableCell>
                  <TableCell>
                    <div className="font-medium">¥{order.amount}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {order.paymentMethod === 'alipay' ? '支付宝' : '微信'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{order.createdAt}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {order.status === 'paid' && (
                        <Button variant="ghost" size="icon">
                          <Package className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}