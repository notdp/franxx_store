'use client'

import { PaymentSuccess } from '@/components/PaymentSuccess'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Order } from '@/types'

export default function SuccessPage() {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const orderData = sessionStorage.getItem('currentOrder')
    if (orderData) {
      setOrder(JSON.parse(orderData))
      sessionStorage.removeItem('currentOrder')
    } else {
      router.push('/')
    }
  }, [router])

  const handleBackToHome = () => {
    router.push('/')
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return <PaymentSuccess order={order} onBackToHome={handleBackToHome} />
}