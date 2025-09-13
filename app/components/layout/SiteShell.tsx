"use client"

import type { PropsWithChildren } from 'react'
import type { User } from '@/types'
import { AuthProvider } from '@/contexts/AuthContext'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Toaster } from '@/components/ui/sonner'

export function SiteShell({ children, initialUser }: PropsWithChildren & { initialUser?: User | null }) {
  return (
    <AuthProvider initialUser={initialUser}>
      <SiteHeader initialUser={initialUser} />
      {children}
      <Toaster />
    </AuthProvider>
  )
}
