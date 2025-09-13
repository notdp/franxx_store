import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 创建 Supabase 客户端（必须使用 server secret key）
const serviceKey = process.env.SUPABASE_SECRET_KEY
if (!serviceKey) {
  throw new Error('Missing SUPABASE_SECRET_KEY for Stripe webhook handler')
}
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  serviceKey
);

// Stripe webhook 处理
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    // 验证 webhook 签名
    // 注意：在生产环境中，必须设置正确的 STRIPE_WEBHOOK_SECRET
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.warn('STRIPE_WEBHOOK_SECRET 未设置，跳过签名验证（仅用于开发）');
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    }
  } catch (err: any) {
    console.error('Webhook 签名验证失败:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // 处理不同的事件类型
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Checkout session completed:', session.id);
        
        // 保存订单到数据库
        await createOrder(session);
        
        // 检查支付状态
        if (session.payment_status === 'paid') {
          // 即时支付成功（如信用卡）
          await fulfillOrder(session);
        }
        // 否则等待 async_payment_succeeded 事件（如银行转账）
        break;
      }
      
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Async payment succeeded:', session.id);
        
        // 延迟支付成功
        await fulfillOrder(session);
        break;
      }
      
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Async payment failed:', session.id);
        
        // 支付失败处理
        await handleFailedPayment(session);
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent failed:', paymentIntent.id);
        break;
      }
      
      default:
        console.log(`未处理的事件类型: ${event.type}`);
    }
    
    // 记录事件日志
    await logPaymentEvent(event);
    
  } catch (error) {
    console.error('处理 webhook 事件错误:', error);
    return NextResponse.json(
      { error: '处理事件失败' },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

// 创建订单
async function createOrder(session: Stripe.Checkout.Session) {
  try {
    const orderData = {
      user_id: session.metadata?.user_id,
      package_id: session.metadata?.package_id,
      package_name: session.metadata?.package_name,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_customer_id: session.customer as string,
      email: session.customer_details?.email || session.customer_email,
      phone: session.customer_details?.phone || '',
      amount: (session.amount_total || 0) / 100, // 转换为元
      status: 'pending',
      payment_status: session.payment_status,
      payment_method: session.payment_method_types?.[0] || 'card',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('创建订单失败:', error);
      throw error;
    }

    console.log('订单创建成功:', data);
    return data;
  } catch (error) {
    console.error('创建订单错误:', error);
    throw error;
  }
}

// 履行订单（发货）
async function fulfillOrder(session: Stripe.Checkout.Session) {
  try {
    // 更新订单状态
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: 'delivered',
        payment_status: 'succeeded',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_session_id', session.id);

    if (updateError) {
      console.error('更新订单状态失败:', updateError);
      throw updateError;
    }

    // TODO: 这里可以添加实际的发货逻辑
    // 例如：创建 ChatGPT 账号、发送邮件等
    
    // 生成模拟的账号信息
    const account = {
      email: `chatgpt.user.${Date.now()}@gmail.com`,
      password: generateSecurePassword(),
    };

    // 更新订单，添加账号信息
    const { error: accountError } = await supabaseAdmin
      .from('orders')
      .update({ 
        account: account,
      })
      .eq('stripe_session_id', session.id);

    if (accountError) {
      console.error('保存账号信息失败:', accountError);
    }

    // TODO: 发送邮件通知用户
    // await sendAccountEmail(session.customer_email, account);

    console.log('订单履行成功:', session.id);
  } catch (error) {
    console.error('履行订单错误:', error);
    throw error;
  }
}

// 处理失败的支付
async function handleFailedPayment(session: Stripe.Checkout.Session) {
  try {
    // 更新订单状态为失败
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: 'failed',
        payment_status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_session_id', session.id);

    if (error) {
      console.error('更新失败订单状态错误:', error);
      throw error;
    }

    // TODO: 发送失败通知邮件
    // await sendPaymentFailedEmail(session.customer_email);

    console.log('支付失败处理完成:', session.id);
  } catch (error) {
    console.error('处理失败支付错误:', error);
    throw error;
  }
}

// 记录支付事件
async function logPaymentEvent(event: Stripe.Event) {
  try {
    const logData = {
      stripe_event_id: event.id,
      event_type: event.type,
      payload: event.data.object,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin
      .from('payment_logs')
      .insert(logData);

    if (error) {
      console.error('记录支付事件失败:', error);
    }
  } catch (error) {
    console.error('记录支付事件错误:', error);
  }
}

// 生成安全密码
function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
