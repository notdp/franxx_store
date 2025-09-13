'use client';

import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* 取消标题 */}
        <div className="text-center mb-8">
          <XCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-red-800 mb-2">支付已取消</h1>
          <p className="text-red-600 text-lg">您已取消了支付流程</p>
        </div>

        {/* 信息卡片 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>发生了什么？</CardTitle>
            <CardDescription>
              您的订单尚未完成，没有任何费用产生
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>提示：</strong>您的订单信息已保存，可以随时返回继续支付。
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">常见问题：</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 支付页面加载缓慢？</li>
                  <li>• 不确定选择哪种支付方式？</li>
                  <li>• 对产品有疑问？</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  如有任何问题，请随时联系我们的客服团队。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={() => window.history.back()}
            variant="default"
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重新尝试支付
          </Button>
          
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
        </div>

        {/* 帮助信息 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            需要帮助？请联系客服：support@franxx.store
          </p>
        </div>
      </div>
    </div>
  );
}

