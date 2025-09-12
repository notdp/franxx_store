import type { Metadata } from 'next'
import { Inter, Orbitron, Rajdhani, Londrina_Outline } from 'next/font/google'
import './globals.css'
import './franxx-logo.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import type { User } from '@/types'
import { getUserWithRole } from '@/lib/supabase/rsc'
import { SiteHeader } from '@/components/layout/SiteHeader'

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
    // RSC 内只读获取当前用户与角色（由 Middleware 负责刷新）
    initialUser = await getUserWithRole()
  } catch (e) {
    // SSR 注入失败不影响渲染，客户端仍可自恢复
    console.warn('[layout] SSR auth bootstrap failed:', e)
  }

  return (
    <html lang="zh-CN" className={`${orbitron.variable} ${rajdhani.variable} ${londrinaOutline.variable}`}>
      <body className={inter.className}>
        <AuthProvider initialUser={initialUser}>
          <SiteHeader />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
