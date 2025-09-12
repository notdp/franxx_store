import { redirect } from 'next/navigation'
import type { User } from '@/types'
import { getUserWithRole } from '@/lib/supabase/rsc'

export async function requireUser(nextPath: string): Promise<User> {
  const user = await getUserWithRole()
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  }
  return user
}

export async function requireAdmin(nextPath: string): Promise<User> {
  const user = await requireUser(nextPath)
  const isAdmin = user.role === 'admin' || user.role === 'super_admin'
  if (!isAdmin) redirect('/')
  return user
}

// 极简别名，避免在布局里硬编码重覆逻辑
export const requireUserAt = requireUser
export const requireAdminAt = requireAdmin
