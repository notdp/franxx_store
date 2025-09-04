'use client'

import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { RoleGuard } from '@/components/RoleGuard'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const router = useRouter()

  const handleBackToMain = () => {
    router.push('/')
  }

  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']} redirectTo="/">
      <div className="min-h-screen bg-sidebar">
        <AdminDashboard onBackToMain={handleBackToMain} />
      </div>
    </RoleGuard>
  )
}