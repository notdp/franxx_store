'use client'

import { PaymentSuccess } from '@/components/PaymentSuccess'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import type { Order, StripeSessionData } from '@/types'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

function sessionToOrder(session: StripeSessionData): Order {
  const paid = String(session.payment_status || '').toLowerCase()
  const paymentSucceeded = paid === 'paid' || paid === 'succeeded'
  return {
    id: session.id,
    packageId: String(session.metadata?.package_id || ''),
    packageName: String(session.metadata?.package_name || 'FRANXX 订阅'),
    phone: session.customer_details?.phone || '—',
    email: session.customer_details?.email || session.customer_email || '',
    status: paymentSucceeded ? 'delivered' : 'processing',
    paymentMethod: session.payment_method_types?.[0] || 'card',
    amount: Math.round((session.amount_total || 0) / 100),
    createdAt: new Date().toISOString(),
    stripe_session_id: session.id,
    payment_status: paymentSucceeded ? 'succeeded' : 'pending',
  }
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const loadFromStripe = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/stripe/session/${id}`)
      if (!res.ok) throw new Error('无法获取支付会话信息')
      const data = await res.json()
      if (data?.order) {
        setOrder({ ...data.order, createdAt: data.order.createdAt || new Date().toISOString() })
      } else if (data?.session) {
        setOrder(sessionToOrder(data.session as StripeSessionData))
      } else {
        throw new Error('支付数据为空')
      }
    } catch (e: any) {
      setError(e.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadFromSessionStorage = useCallback(() => {
    try {
      const val = sessionStorage.getItem('currentOrder')
      if (!val) throw new Error('没有找到订单信息')
      const parsed: Order = JSON.parse(val)
      setOrder(parsed)
      sessionStorage.removeItem('currentOrder')
    } catch (e: any) {
      setError(e.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (sessionId) {
      void loadFromStripe(sessionId)
    } else {
      loadFromSessionStorage()
    }
  }, [sessionId, loadFromStripe, loadFromSessionStorage])

  const handleBackToHome = () => router.push('/')

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || '未找到订单'}</p>
          <Button className="mt-4" onClick={() => router.push('/')}>返回首页</Button>
        </div>
      </div>
    )
  }

  return <PaymentSuccess order={order} onBackToHome={handleBackToHome} />
}
