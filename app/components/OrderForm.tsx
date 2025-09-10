import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Package } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Shield, LogIn, CheckCircle, Clock, Mail, FileText, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderFormProps {
  package: Package;
  onBack: () => void;
  onSubmit: (orderData: any) => void;
  onLogin: () => void;
}

interface FormErrors {
  submit?: string;
}

export function OrderForm({ package: pkg, onBack, onSubmit, onLogin }: OrderFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // 使用 Stripe Checkout 处理支付
  const handleStripePayment = async () => {
    if (!user) {
      // 未登录用户跳转到登录页面
      onLogin();
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // 调用 Stripe Checkout Session API
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: pkg.id,
          packageName: pkg.name,
          packageDescription: pkg.description,
          salePrice: pkg.salePrice,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '创建支付会话失败');
      }

      const { url } = await response.json();
      
      // 跳转到 Stripe Checkout 页面
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('未能获取支付链接');
      }
    } catch (error: any) {
      console.error('Stripe payment error:', error);
      setErrors({
        submit: error.message || '支付初始化失败，请重试'
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleStripePayment();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回套餐选择
          </Button>
          
          <div className="text-center">
            <h1 className="mb-2">确认订单</h1>
            <p className="text-muted-foreground">
              {user ? `欢迎回来，${user.name}！` : '请先登录完成购买'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>订单摘要</CardTitle>
              <CardDescription>请确认您的订单信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{pkg.name}</h3>
                  <div className="text-right">
                    <div className="font-bold text-primary">¥{pkg.salePrice}</div>
                    <div className="text-sm text-muted-foreground line-through">¥{pkg.originalPrice}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded text-sm">
                  节省 ¥{pkg.savings}
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>商品金额：</span>
                  <span>¥{pkg.salePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>优惠折扣：</span>
                  <span className="text-green-600">-¥{pkg.savings}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>实付金额：</span>
                  <span className="text-primary">¥{pkg.salePrice}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">购买须知：</h4>
                <ul className="text-sm space-y-1 text-blue-700">
                  <li className="flex items-center space-x-2">
                    <User className="w-3 h-3" />
                    <span>账号为全新注册，仅供您一人使用</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>支付成功后5-30分钟内自动发货</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Mail className="w-3 h-3" />
                    <span>账号信息将发送到您的登录邮箱</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FileText className="w-3 h-3" />
                    <span>可在个人中心查看所有订单历史</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <HelpCircle className="w-3 h-3" />
                    <span>如有问题请及时联系客服</span>
                  </li>
                </ul>
              </div>

            </CardContent>
          </Card>

          {/* Order Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {user ? <User className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                <span>{user ? '确认支付' : '登录购买'}</span>
              </CardTitle>
              <CardDescription>
                {user ? `登录用户：${user.name}` : '请先登录您的账户'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {user ? (
                  // 已登录用户：显示用户信息和支付方式
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">{user.name}</p>
                          <p className="text-sm text-green-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-green-700">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">账号信息将发送至此邮箱</span>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">支付方式</h4>
                      <p className="text-sm text-yellow-700">
                        点击支付后，您将被重定向到 Stripe 安全支付页面
                      </p>
                      <p className="text-sm text-yellow-600 mt-2">
                        支持：银行卡、Apple Pay、Google Pay、支付宝、加密货币等
                      </p>
                    </div>

                  </>
                ) : (
                  // 未登录用户：显示登录提示
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-blue-800 mb-2">需要登录才能购买</h3>
                      <p className="text-sm text-blue-600 mb-4">
                        为了保障您的账号安全和订单管理，我们需要您先登录账户
                      </p>
                      <div className="space-y-2 text-sm text-blue-600">
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>支持Google/GitHub快捷登录</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>订单自动关联到您的账户</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>账号信息安全发送到邮箱</span>
                        </div>
                      </div>
                    </div>

                  </>
                )}

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      正在跳转到支付页面...
                    </>
                  ) : user ? (
                    `确认支付 ¥${pkg.salePrice}`
                  ) : (
                    '登录支付'
                  )}
                </Button>

                {user && (
                  <div className="text-center text-sm text-muted-foreground">
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>享受已登录用户的便捷购买体验</span>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
