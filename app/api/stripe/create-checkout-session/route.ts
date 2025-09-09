import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // 获取用户信息
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete(name);
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 获取请求数据
    const { packageId, packageName, packageDescription, salePrice } = await request.json();

    // 检查或创建 Stripe Customer
    let customerId = null;
    
    // 首先检查数据库中是否已有 stripe_customer_id
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (userData?.stripe_customer_id) {
      customerId = userData.stripe_customer_id;
    } else {
      // 创建新的 Stripe Customer
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.user_metadata?.name || user.email!.split('@')[0],
        metadata: {
          user_id: user.id,
        },
      });
      
      customerId = customer.id;

      // 保存到数据库
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // 创建 Checkout Session
    // 注意：不指定 payment_method_types，让 Stripe Dashboard 管理
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `FRANXX ${packageName}`,
              description: packageDescription || `FRANXX ${packageName} 订阅服务`,
              images: ['https://your-domain.com/franxx-logo.png'], // 可以添加产品图片
            },
            unit_amount: Math.round(salePrice * 100), // 转换为分
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      locale: 'auto', // 自动检测用户语言
      metadata: {
        user_id: user.id,
        package_id: packageId,
        package_name: packageName,
      },
      // 可选：启用账单地址收集
      billing_address_collection: 'auto',
      // 可选：自动税费计算（需要在 Dashboard 配置）
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    });
  } catch (error) {
    console.error('创建 Checkout Session 错误:', error);
    return NextResponse.json(
      { error: '创建支付会话失败，请重试' },
      { status: 500 }
    );
  }
}