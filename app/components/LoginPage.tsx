import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Github, Chrome, Loader2, AlertCircle, Check, Shield, Zap, DollarSign, Users, Star } from 'lucide-react';

interface LoginPageProps {
  onBack: () => void;
}

export function LoginPage({ onBack }: LoginPageProps) {
  const { signInWithOAuth } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(true);

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(provider);
    setError('');

    try {
      const result = await signInWithOAuth(provider);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // 登录成功会通过 AuthContext 自动处理页面跳转
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      setError(error.message || `${provider} 登录失败，请重试`);
      // 仅在发生错误时恢复按钮状态
      setLoading(null);
    }
  };

  const features = [
    {
      icon: DollarSign,
      title: '价格优势',
      description: '比官方价格节省高达30%'
    },
    {
      icon: Zap,
      title: '极速发货',
      description: '支付后5-30分钟自动发货'
    },
    {
      icon: Shield,
      title: '安全可靠',
      description: '独立账号，加密存储'
    },
    {
      icon: Users,
      title: '专业服务',
      description: '24小时客服支持'
    }
  ];

  const testimonials = [
    { name: '张开发', role: 'AI工程师', content: '价格便宜，发货很快，账号稳定好用！' },
    { name: '李程序', role: '前端开发', content: '客服响应及时，解决问题很专业。' },
    { name: '王产品', role: '产品经理', content: '团队都在用，比官方便宜很多。' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* 返回按钮 */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首页
        </Button>
      </div>

      <div className="flex min-h-screen">
        {/* 左侧品牌展示区 */}
        <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 relative overflow-hidden">
          {/* 背景装饰 - 使用更柔和的装饰 */}
          <div className="absolute top-20 -left-20 w-80 h-80 bg-white/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col justify-center p-8 text-slate-700">
            {/* 品牌标识 */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">F</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Franxx</h1>
              </div>
              <p className="text-xl text-slate-600 mb-2">专业的 ChatGPT 跨区订阅平台</p>
              <p className="text-slate-500">为开发者提供稳定、便宜、可靠的 AI 服务</p>
            </div>

            {/* 特色功能 */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold mb-4 text-slate-800">为什么选择我们？</h3>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center shadow-sm">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{feature.title}</h4>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 用户评价 */}
            <div className="space-y-3 mb-8">
              <h3 className="text-lg font-semibold text-slate-800">用户反馈</h3>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm mb-2 text-slate-700">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="text-xs text-slate-500">
                    <span className="font-medium">{testimonial.name}</span> - {testimonial.role}
                  </div>
                </div>
              ))}
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">2000+</div>
                <div className="text-sm text-slate-600">满意用户</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">99.9%</div>
                <div className="text-sm text-slate-600">服务可靠性</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">30%</div>
                <div className="text-sm text-slate-600">平均节省</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧登录表单区 */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-6">
          <div className="w-full max-w-lg">
            {/* 移动端品牌信息 */}
            <div className="lg:hidden text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">欢迎来到 Franxx</h1>
              <p className="text-muted-foreground">专业的 ChatGPT 跨区订阅平台</p>
            </div>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center space-y-2">
                <div className="hidden lg:block">
                  <CardTitle className="text-2xl">欢迎回来</CardTitle>
                  <CardDescription className="text-base">
                    登录您的账户以管理订单和享受个性化服务
                  </CardDescription>
                </div>
                <div className="lg:hidden">
                  <CardTitle className="text-xl">立即登录</CardTitle>
                  <CardDescription>
                    使用社交账号快速登录
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={() => handleSocialLogin('google')}
                    disabled={loading !== null}
                    className="w-full h-11"
                    variant="outline"
                    size="lg"
                  >
                    {loading === 'google' ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Chrome className="w-5 h-5 mr-2" />
                    )}
                    使用 Google 登录
                  </Button>

                  <Button
                    onClick={() => handleSocialLogin('github')}
                    disabled={loading !== null}
                    className="w-full h-11"
                    variant="outline"
                    size="lg"
                  >
                    {loading === 'github' ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Github className="w-5 h-5 mr-2" />
                    )}
                    使用 GitHub 登录
                  </Button>
                </div>

                {/* 登录优势 */}
                <div className="bg-blue-50/80 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">登录后您将享受：</h4>
                  <div className="space-y-2">
                    {[
                      '快速下单，无需重复填写信息',
                      '查看完整订单历史和状态',
                      '获得专属客服支持',
                      '享受会员专属优惠'
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-blue-700">
                        <Check className="w-4 h-4 text-blue-600" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="agree-terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="agree-terms" className="cursor-pointer leading-relaxed text-xs text-muted-foreground">
                    我已阅读并同意
                    <a href="#" className="text-primary hover:underline mx-1">《服务条款》</a>
                    和
                    <a href="#" className="text-primary hover:underline mx-1">《隐私政策》</a>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* 移动端特色功能 */}
            <div className="lg:hidden mt-6 grid grid-cols-2 gap-3">
              {features.slice(0, 4).map((feature, index) => (
                <div key={index} className="text-center p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <feature.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
