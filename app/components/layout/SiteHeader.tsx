"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Menu, LogOut, Shield, User as UserIcon } from 'lucide-react'
import type { User } from '@/types'

// 接受服务端注入的用户，减少对全局 AuthProvider 的硬依赖
export function SiteHeader({ initialUser }: { initialUser?: User | null } = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user: ctxUser, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)
  const hidden = pathname?.startsWith('/admin')

  // Prefer live client context when available; fall back to SSR user.
  const user = ctxUser ?? initialUser

  const isActive = (href: string) => (pathname === href || pathname?.startsWith(href + '/'))

  const nav = useMemo(() => {
    const items: { label: string; href: string }[] = [
      { label: '首页', href: '/' },
      { label: 'FAQ', href: '/faq' },
    ]
    if (user) items.splice(1, 0, { label: '仪表盘', href: '/orders' })
    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
    if (isAdmin) items.push({ label: '后台', href: '/admin' })
    return items
  }, [user])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('logout failed', e)
    }
  }

  if (hidden) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-1 min-w-0">
          <div className="franxx-logo-container franxx-logo-large franxx-logo-normal-outline select-none">
            <span className="franxx-logo">
              FRAN
              <span className="text-blue-600 franxx-x">X</span>
              <span className="text-red-600 franxx-x">X</span>
              .STORE
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={
                'px-3 py-2 rounded-md transition-colors ' +
                (isActive(item.href) ? 'text-primary bg-accent' : 'text-muted-foreground hover:text-foreground')
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right area */}
        <div className="hidden lg:flex items-center space-x-3 flex-1 justify-end">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                      <div className="text-sm font-medium truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <UserIcon className="w-4 h-4 mr-2" /> 个人资料
                  </Link>
                </DropdownMenuItem>
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Shield className="w-4 h-4 mr-2" /> 管理后台
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onSelect={(e) => {
                    e.preventDefault();
                    setConfirmLogoutOpen(true);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" /> 退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={`/login?next=${encodeURIComponent(pathname || '/')}`}>
              <Button variant="outline">登录</Button>
            </Link>
          )}
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="mt-6 flex flex-col space-y-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className={
                    'px-3 py-2 rounded-md transition-colors ' +
                    (isActive(item.href) ? 'text-primary bg-accent' : 'text-muted-foreground hover:text-foreground')
                  }
                >
                  {item.label}
                </Link>
              ))}
              {!user && (
                <Link href={`/login?next=${encodeURIComponent(pathname || '/')}`} onClick={() => setOpen(false)}>
                  <Button className="w-full">登录</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* Confirm Logout Dialog mounted outside Dropdown to avoid unmount */}
      <AlertDialog open={confirmLogoutOpen} onOpenChange={setConfirmLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认退出登录？</AlertDialogTitle>
            <AlertDialogDescription>
              退出后将无法访问仪表盘等需要登录的页面。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setConfirmLogoutOpen(false)
                await handleLogout()
              }}
            >
              确认退出
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}
