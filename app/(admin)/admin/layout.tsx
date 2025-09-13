import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { getUserWithRole } from '@/lib/supabase/rsc'

// Note: server-side guard temporarily disabled to test Middleware + offline JWKS path.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const initialUser = await getUserWithRole()
  return <AdminShell initialUser={initialUser}>{children}</AdminShell>
}
