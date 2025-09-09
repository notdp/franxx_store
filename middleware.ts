import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // 仅在需要保护的页面运行中间件，减少无关路由开销
  matcher: ['/admin/:path*', '/orders/:path*', '/profile/:path*'],
}
