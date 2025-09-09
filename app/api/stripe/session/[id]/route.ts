import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@supabase/supabase-js';

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    if (!sessionId) {
      return NextResponse.json(
        { error: '缺少 session ID' },
        { status: 400 }
      );
    }

    // 获取 Stripe session 详情
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    });

    // 获取订单信息（如果存在）
    let order = null;
    if (session.id) {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_session_id', session.id)
        .single();
      
      order = data;
    }

    return NextResponse.json({
      session: {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_email,
        payment_status: session.payment_status,
        payment_method_types: session.payment_method_types,
        metadata: session.metadata,
        customer_details: session.customer_details,
      },
      order,
    });
  } catch (error: any) {
    console.error('获取 session 详情错误:', error);
    return NextResponse.json(
      { error: error.message || '获取支付信息失败' },
      { status: 500 }
    );
  }
}