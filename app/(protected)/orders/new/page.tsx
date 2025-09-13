'use client'

import { Suspense } from 'react'
import { OrderForm } from '@/components/OrderForm'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { packages } from '@/data/mockData'
import { Order } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

function OrderPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const packageId = searchParams.get('package')

  const selectedPackage = packages.find(pkg => pkg.id === packageId)

  if (!selectedPackage) {
    router.push('/')
    return null
  }

  const handleBack = () => {
    router.push('/')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const handleOrderSubmit = (orderData: any) => {
    if (!user) {
      router.push('/login')
      return
    }

    const order: Order = {
      id: orderData.orderId || Math.random().toString(36).substr(2, 6).toUpperCase(),
      packageId: orderData.packageId,
      packageName: orderData.packageName,
      phone: orderData.phone,
      email: user.email,
      status: 'delivered',
      paymentMethod: orderData.paymentMethod,
      amount: orderData.amount,
      createdAt: new Date().toISOString(),
      userId: user.id,
      account: {
        email: `chatgpt.user.${Date.now()}@gmail.com`,
        password: 'SecurePass123!'
      }
    }

    // 保存订单数据到 sessionStorage 以便在成功页面使用
    sessionStorage.setItem('currentOrder', JSON.stringify(order))
    router.push('/payment/success')
  }

  return (
    <div className="min-h-screen bg-background">
      <OrderForm
        package={selectedPackage}
        onBack={handleBack}
        onSubmit={handleOrderSubmit}
        onLogin={handleLogin}
      />
    </div>
  )
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      }
    >
      <OrderPageInner />
    </Suspense>
  )
}
