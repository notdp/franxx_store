'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function logout() {
  const store = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  await supabase.auth.signOut()
}

