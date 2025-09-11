import type { Metadata } from 'next'
import { Inter, Orbitron, Rajdhani, Londrina_Outline } from 'next/font/google'
import './globals.css'
import './franxx-logo.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { User, UserRole } from '@/types'

const inter = Inter({ subsets: ['latin'] })

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const londrinaOutline = Londrina_Outline({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-londrina',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Franxx - ChatGPT跨区订阅平台',
  description: '基于DARLING in the FRANXX世界观的ChatGPT订阅服务',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // SSR 解析当前会话与角色，并将其注入到 AuthProvider
  let initialUser: User | null = null

  try {
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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      let role: UserRole = 'user'
      try {
        const { data: roleValue } = await supabase.rpc('get_app_role', { check_user_id: user.id })
        if (roleValue === 'user' || roleValue === 'admin' || roleValue === 'super_admin') {
          role = roleValue
        }
      } catch (_) { /* ignore */ }

      initialUser = {
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
    }
  } catch (e) {
    // SSR 注入失败不影响渲染，客户端仍可自恢复
    console.warn('[layout] SSR auth bootstrap failed:', e)
  }

  return (
    <html lang="zh-CN" className={`${orbitron.variable} ${rajdhani.variable} ${londrinaOutline.variable}`}>
      <body className={inter.className}>
        <AuthProvider initialUser={initialUser}>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
