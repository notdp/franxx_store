"use client"

import type { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'

export default function LoginLayout({ children }: { children: ReactNode }) {
  // 登录页只需要认证上下文，不需要全站导航头
  return <AuthProvider>{children}</AuthProvider>
}

