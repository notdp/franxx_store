'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export function SiteFooter() {
  const pathname = usePathname()
  const hidden = pathname?.startsWith('/admin')

  const year = useMemo(() => new Date().getFullYear(), [])

  if (hidden) return null

  return (
    <footer className="bg-gradient-to-br from-blue-50 to-purple-50/30 relative z-10">
      <div className="container mx-auto max-w-7xl px-4 py-2">
        <p className="text-center text-[11px] sm:text-xs leading-none text-muted-foreground">© {year} FRANXX</p>
      </div>
    </footer>
  )
}
