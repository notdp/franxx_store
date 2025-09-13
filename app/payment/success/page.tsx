'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, Copy, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSessionDetails = useCallback(async () => {
    try {
      // 获取 session 详情
      const response = await fetch(`/api/stripe/session/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('获取支付信息失败');
      }

      const data = await response.json();
      setSessionData(data.session);
      setOrderData(data.order);
    } catch (err: any) {
      console.error('获取支付详情错误:', err);
      setError(err.message || '获取支付信息失败');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    } else {
      setError('缺少支付会话 ID');
      setLoading(false);
    }
  }, [sessionId, fetchSessionDetails]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 可以添加 toast 提示
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载支付信息...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* 成功标题 */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-green-800 mb-2">支付成功！</h1>
          <p className="text-green-600 text-lg">感谢您的购买，您的 FRANXX 订阅已激活</p>
        </div>

        {/* 订单信息卡片 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              订单详情
              <Badge variant="secondary">#{sessionData?.metadata?.package_id || 'N/A'}</Badge>
            </CardTitle>
            <CardDescription>
              订单时间：{new Date().toLocaleString('zh-CN')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">套餐名称</p>
                <p className="font-semibold">{sessionData?.metadata?.package_name || 'FRANXX 订阅'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">支付金额</p>
                <p className="font-semibold text-green-600">
                  ${((sessionData?.amount_total || 0) / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">支付方式</p>
                <p className="font-semibold capitalize">
                  {sessionData?.payment_method_types?.[0] || 'Card'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">订单状态</p>
                <Badge className="bg-green-100 text-green-800">已完成</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 账号信息卡片（如果有） */}
        {orderData?.account && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>您的 ChatGPT 账号</CardTitle>
              <CardDescription>
                请妥善保管您的账号信息，建议立即修改密码
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">账号邮箱</label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="flex-1 p-2 bg-gray-100 rounded">
                    {orderData.account.email}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(orderData.account.email)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">初始密码</label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="flex-1 p-2 bg-gray-100 rounded">
                    {orderData.account.password}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(orderData.account.password)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 后续步骤 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>接下来的步骤</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold">检查邮箱</p>
                  <p className="text-sm text-muted-foreground">
                    我们已将账号信息发送到您的邮箱
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold">访问 ChatGPT</p>
                  <p className="text-sm text-muted-foreground">
                    前往 chat.openai.com 使用您的新账号
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => router.push('/orders')}
            variant="outline"
          >
            查看订单
          </Button>
          <Button onClick={() => router.push('/')}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">加载支付信息...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessInner />
    </Suspense>
  )
}
