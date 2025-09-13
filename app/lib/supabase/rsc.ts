import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { User, UserRole } from '@/types'
import { readSupabaseAccessToken, mapJwtToUser } from '@/lib/auth/jwt'
import { log } from '@/lib/log'

// RSC专用：只读客户端，禁止写Cookie，避免Next 14报错
export function createReadOnlyServerClient() {
  const store = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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

const DEBUG = process.env.NODE_ENV !== 'production' && process.env.FRX_DEBUG_AUTH !== '0'

export async function getUserWithRole(): Promise<User | null> {
  const store = cookies()
  const token = readSupabaseAccessToken(store as any)
  if (DEBUG) {
    const names = (store as any).getAll().map((c: any) => c.name)
    log.debug('RSC', 'getUserWithRole', { hasToken: Boolean(token), cookieNames: names })
  }
  // 统一走 getClaims（优先本地 JWKS，失败远端）
  const supabase = createReadOnlyServerClient()
  try {
    let claimsResult: any = null
    try {
      const envJwks = process.env.FRX_SUPABASE_JWKS
      let jwks: any = null
      if (envJwks) {
        try {
          const parsed = JSON.parse(envJwks)
          jwks = parsed.keys ? parsed : { keys: [parsed] }
        } catch {}
      }
      if (jwks) claimsResult = await supabase.auth.getClaims(undefined, { jwks })
    } catch {}
    if (!claimsResult?.data) claimsResult = await supabase.auth.getClaims()
    if (claimsResult?.data?.claims) {
      if (DEBUG) log.debug('RSC', 'JWT ok → user from token')
      return mapJwtToUser(claimsResult.data.claims as any)
    }
  } catch {}

  // Fallback: 访问 Supabase 以获取用户（极少数情况下：access-token 尚未落入 Cookie 但 refresh 仍在）
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // 角色来自 app_metadata（由数据库 Auth Hook 注入到 Access Token）；无则默认为 user
    const roleMeta = ((user.app_metadata as any)?.app_role || (user.app_metadata as any)?.role) as UserRole
    const role: UserRole = (roleMeta === 'admin' || roleMeta === 'super_admin' || roleMeta === 'user') ? roleMeta : 'user'

    const u = {
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
    if (DEBUG) log.debug('RSC', 'fallback getUser() → user', { role })
    return u
  } catch {
    if (DEBUG) log.debug('RSC', 'fallback getUser() failed')
    return null
  }
}
