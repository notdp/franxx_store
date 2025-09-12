import { redirect } from 'next/navigation'
import { requireUserAt } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export default async function OrdersLayout({ children }: { children: React.ReactNode }) {
  await requireUserAt('/orders')

  return <>{children}</>
}
