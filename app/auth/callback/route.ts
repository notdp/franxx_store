import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const DEBUG = process.env.NODE_ENV !== 'production' && process.env.FRX_DEBUG_AUTH !== '0'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll().map(({ name, value }) => ({ name, value }))
          },
          async setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options })
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      // keep error visible in logs but unify format
      console.error('[FRX][CB]', 'Code exchange error:', error)
      return NextResponse.redirect(`${origin}/auth/error`)
    }

    // Additionally expose short-lived, non-HttpOnly cookies so the browser client can bootstrap.
    // This mirrors @supabase/ssr client expectations (reads `sb-access-token` / `sb-refresh-token`).
    try {
      const accessToken = data?.session?.access_token
      const refreshToken = data?.session?.refresh_token
      if (accessToken && refreshToken) {
        const secure = process.env.NODE_ENV === 'production'
        // Keep access token as a session cookie (no maxAge) to avoid clock skew issues.
        cookieStore.set({
          name: 'sb-access-token',
          value: accessToken,
          httpOnly: false,
          sameSite: 'lax',
          path: '/',
          secure,
        })
        // Refresh token persists a bit longer to survive soft navigations.
        // Supabase default refresh TTL is 2 weeks; choose a conservative 7 days.
        cookieStore.set({
          name: 'sb-refresh-token',
          value: refreshToken,
          httpOnly: false,
          sameSite: 'lax',
          path: '/',
          secure,
          maxAge: 60 * 60 * 24 * 7,
        })
      }
    } catch {}

    if (DEBUG) {
      try {
        const all = cookieStore.getAll().map((c) => c.name)
      console.log('[FRX][CB]', 'code → session ok', { next, cookieNamesAfterSet: all, userId: data?.user?.id })
      } catch {}
    }

    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
