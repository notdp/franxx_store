'use client'

import { OrderForm } from '@/components/OrderForm'
import { Header } from '@/components/Header'
import { useRouter, useSearchParams } from 'next/navigation'
import { packages } from '@/data/mockData'
import { Order } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

export default function OrderPage() {
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

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      router.push('/')
    } else {
      router.push(`/${page}`)
    }
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
    router.push('/success')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="order" onNavigate={handleNavigate} />
      <OrderForm
        package={selectedPackage}
        onBack={handleBack}
        onSubmit={handleOrderSubmit}
        onLogin={handleLogin}
      />
    </div>
  )
}