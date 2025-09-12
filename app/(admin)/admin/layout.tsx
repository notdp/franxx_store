import { redirect } from 'next/navigation'
import { requireAdminAt } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminAt('/admin')

  return <>{children}</>
}
