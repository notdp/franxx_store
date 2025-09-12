import { redirect } from 'next/navigation'
import { requireUserAt } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  await requireUserAt('/profile')

  return <>{children}</>
}
