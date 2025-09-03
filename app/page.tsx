'use client'

import { HomePage } from '@/components/HomePage'
import { Header } from '@/components/Header'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleSelectPackage = (packageId: string) => {
    router.push(`/order?package=${packageId}`)
  }

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      router.push('/')
    } else {
      router.push(`/${page}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="home" onNavigate={handleNavigate} />
      <HomePage onSelectPackage={handleSelectPackage} />
    </div>
  )
}