import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({ name, value }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options })
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/admin`)
  }

  // 查询角色（统一走单次 RPC）
  let role: 'user' | 'admin' | 'super_admin' = 'user'
  try {
    const { data: roleValue } = await supabase.rpc('get_app_role', { check_user_id: user.id })
    if (roleValue === 'user' || roleValue === 'admin' || roleValue === 'super_admin') {
      role = roleValue
    }
  } catch (_) { /* ignore */ }

  const isAdmin = role === 'admin' || role === 'super_admin'
  if (!isAdmin) {
    redirect('/')
  }

  return <>{children}</>
}

