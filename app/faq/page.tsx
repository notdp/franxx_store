'use client'

import { FAQ } from '@/components/FAQ'
import { Header } from '@/components/Header'
import { useRouter } from 'next/navigation'

export default function FAQPage() {
  const router = useRouter()

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      router.push('/')
    } else {
      router.push(`/${page}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="faq" onNavigate={handleNavigate} />
      <FAQ />
    </div>
  )
}