'use client'

import { ProfilePage } from '@/components/ProfilePage'
import { Header } from '@/components/Header'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export default function Profile() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="profile" onNavigate={handleNavigate} />
      <ProfilePage onBack={handleBack} />
    </div>
  )
}