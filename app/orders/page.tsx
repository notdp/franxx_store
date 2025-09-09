'use client'

import { UserDashboard } from '@/components/UserDashboard'
import { Header } from '@/components/Header'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Orders() {
  const router = useRouter()
  const { user } = useAuth()

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

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="orders" onNavigate={handleNavigate} />
      <UserDashboard onLogin={handleLogin} />
    </div>
  )
}
