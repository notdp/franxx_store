'use client'

import { ProfilePage } from '@/components/ProfilePage'
import { Header } from '@/components/Header'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Profile() {
  const router = useRouter()
  const { user } = useAuth()

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

  // SSR 布局已做登录校验，这里不再阻塞渲染

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="profile" onNavigate={handleNavigate} />
      <ProfilePage onBack={handleBack} />
    </div>
  )
}
