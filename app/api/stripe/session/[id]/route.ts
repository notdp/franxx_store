import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 通过 SSR 客户端 + RLS 保护，仅允许登录用户访问自己的订单

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

    // 解析用户会话（必须登录）
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, _options: CookieOptions) {
            cookieStore.delete(name)
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    // 获取 Stripe session 详情
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    })

    // 基于元数据或邮箱进行所有权校验（防止非本人查询）
    const ownerUserId = (session.metadata as any)?.user_id
    const ownerEmail = session.customer_email || session.customer_details?.email
    const isOwner = (ownerUserId && ownerUserId === user.id) || (ownerEmail && ownerEmail === user.email)

    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 获取订单信息（如果存在）——受 RLS 保护，仅本人可见
    let order = null
    if (session.id) {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_session_id', session.id)
        .single()

      order = data
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
    console.error('获取 session 详情错误:', error)
    return NextResponse.json(
      { error: error.message || '获取支付信息失败' },
      { status: 500 }
    )
  }
}
