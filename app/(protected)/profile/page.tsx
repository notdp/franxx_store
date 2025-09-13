'use client'

import { ProfilePage } from '@/components/ProfilePage'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Profile() {
  const router = useRouter()
  const { user } = useAuth()

  const handleBack = () => {
    router.push('/')
  }

  // SSR 受保护布局已做登录校验
  return (
    <div className="min-h-screen bg-background">
      <ProfilePage onBack={handleBack} />
    </div>
  )
}

