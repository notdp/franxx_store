import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { SiteShell } from '@/components/layout/SiteShell'
import { getUserWithRole } from '@/lib/supabase/rsc'

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const initialUser = await getUserWithRole()
  if (!initialUser) {
    // Middleware 也会保护这些路由；这里做 SSR 级兜底
    redirect('/login')
  }
  return <SiteShell initialUser={initialUser}>{children}</SiteShell>
}

