'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function logout() {
  const store = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return store.getAll().map(({ name, value }) => ({ name, value }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            store.set({ name, value, ...options })
          })
        },
      },
    }
  )
  
  // 1. 调用 Supabase 登出
  await supabase.auth.signOut()
  
  // 由 @supabase/ssr 的 cookies 适配器写回正确的 Set-Cookie；不再手动枚举清理，避免竞态与域/路径差异
}
