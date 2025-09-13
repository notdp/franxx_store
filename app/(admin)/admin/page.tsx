"use client"

import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-sidebar">
      <AdminDashboard onBackToMain={() => router.push('/')} />
    </div>
  )
}

