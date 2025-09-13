import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'
import { getUserWithRole } from '@/lib/supabase/rsc'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const initialUser = await getUserWithRole()
  const role = initialUser?.role
  if (!(role === 'admin' || role === 'super_admin')) {
    redirect('/')
  }
  return <AdminShell initialUser={initialUser}>{children}</AdminShell>
}

