import type { Metadata } from 'next'
import { Inter, Orbitron, Rajdhani, Londrina_Outline } from 'next/font/google'
import './globals.css'
import './franxx-logo.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${orbitron.variable} ${rajdhani.variable} ${londrinaOutline.variable}`}>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}