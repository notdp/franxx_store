'use client'

import { UserDashboard } from '@/components/UserDashboard'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Orders() {
  const router = useRouter()
  const { user } = useAuth()

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <UserDashboard onLogin={handleLogin} />
    </div>
  )
}
