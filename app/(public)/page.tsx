'use client'

import { HomePage } from '@/components/HomePage'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleSelectPackage = (packageId: string) => {
    router.push(`/orders/new?package=${packageId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <HomePage onSelectPackage={handleSelectPackage} />
    </div>
  )
}

