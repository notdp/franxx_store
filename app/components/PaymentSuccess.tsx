import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Copy, Mail, MessageSquare, Eye, EyeOff, Globe, Lock, Users, Calendar } from 'lucide-react';
import { useState } from 'react';

interface PaymentSuccessProps {
  order: Order;
  onBackToHome: () => void;
}

export function PaymentSuccess({ order, onBackToHome }: PaymentSuccessProps) {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-800 mb-2">支付成功！</h1>
          <p className="text-green-600">您的 ChatGPT 账号已准备就绪</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              订单详情
              <Badge variant="secondary">#{order.id}</Badge>
            </CardTitle>
            <CardDescription>
              订单时间：{new Date(order.createdAt).toLocaleString('zh-CN')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">套餐名称</span>
                <p className="font-semibold">{order.packageName}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">支付金额</span>
                <p className="font-semibold text-green-600">¥{order.amount}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">联系方式</span>
                <p className="font-semibold">{order.phone}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">订单状态</span>
                <Badge className="bg-green-100 text-green-800">已完成</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {order.account && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>您的 ChatGPT 账号</span>
                <Badge className="bg-blue-100 text-blue-800">已激活</Badge>
              </CardTitle>
              <CardDescription>
                请妥善保管您的账号信息，建议立即修改密码
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">账号邮箱</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-3 bg-gray-50 rounded-md font-mono">
                    {order.account.email}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(order.account!.email)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">账号密码</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-3 bg-gray-50 rounded-md font-mono">
                    {showPassword ? order.account.password : '••••••••••••'}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(order.account!.password)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">使用提醒：</h4>
                <ul className="text-sm space-y-1 text-blue-700">
                  <li className="flex items-center space-x-2">
                    <Globe className="w-3 h-3" />
                    <span>请访问 chat.openai.com 登录您的账号</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Lock className="w-3 h-3" />
                    <span>建议首次登录后立即修改密码</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Users className="w-3 h-3" />
                    <span>不要与他人分享您的账号信息</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>账号有效期为 1 个月，到期前会提醒续费</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>后续服务</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Mail className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold">邮件通知</h4>
                  <p className="text-sm text-muted-foreground">账号信息已发送至您的邮箱</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <MessageSquare className="w-8 h-8 text-green-600" />
                <div>
                  <h4 className="font-semibold">客服支持</h4>
                  <p className="text-sm text-muted-foreground">24小时在线客服协助</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={onBackToHome} className="w-full md:w-auto">
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
