'use client'

import { FAQ } from '@/components/FAQ'
import { useRouter } from 'next/navigation'

export default function FAQPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <FAQ />
    </div>
  )
}
