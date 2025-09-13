"use client"

import type { PropsWithChildren } from 'react'
import type { User } from '@/types'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'

export function AdminShell({ children, initialUser }: PropsWithChildren & { initialUser?: User | null }) {
  return (
    <AuthProvider initialUser={initialUser}>
      {children}
      <Toaster />
    </AuthProvider>
  )
}
