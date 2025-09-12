import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { User, UserRole } from '@/types'

// RSC专用：只读客户端，禁止写Cookie，避免Next 14报错
export function createReadOnlyServerClient() {
  const store = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return store.getAll().map(({ name, value }) => ({ name, value }))
        },
        setAll() {
          // 禁止在RSC写Cookie
        },
      },
    }
  )
}

export async function getUserWithRole(): Promise<User | null> {
  const supabase = createReadOnlyServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  let role: UserRole = 'user'
  try {
    const { data: roleValue } = await supabase.rpc('get_app_role', { check_user_id: user.id })
    if (roleValue === 'user' || roleValue === 'admin' || roleValue === 'super_admin') {
      role = roleValue
    }
  } catch {}

  const mapped: User = {
    id: user.id,
    email: user.email || '',
    name:
      (user.user_metadata as any)?.full_name ||
      (user.user_metadata as any)?.name ||
      user.email?.split('@')[0] ||
      'User',
    avatar: (user.user_metadata as any)?.avatar_url,
    provider: ((user.app_metadata as any)?.provider || 'google') as 'google' | 'github',
    created_at: user.created_at,
    role,
  }

  return mapped
}

