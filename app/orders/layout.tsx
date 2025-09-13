import type { ReactNode } from 'react'
import { SiteShell } from '@/components/layout/SiteShell'
import { getUserWithRole } from '@/lib/supabase/rsc'

export default async function OrdersLayout({ children }: { children: ReactNode }) {
  const initialUser = await getUserWithRole()
  return <SiteShell initialUser={initialUser}>{children}</SiteShell>
}
