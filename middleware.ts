import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'
import { hasSupabaseSessionCookie, readSupabaseAccessToken, extractRole } from '@/lib/auth/jwt'
import { log } from '@/lib/log'

const DEBUG = process.env.NODE_ENV !== 'production' && process.env.FRX_DEBUG_MW !== '0'
const STRICT_ADMIN_IN_MW = process.env.FRX_STRICT_MW_ADMIN === '1'

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const inAdmin = pathname.startsWith('/admin')
  const inProtected =
    inAdmin ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/payment')

  // 避免 Next<Link> 预取触发重定向导致的缓存/跳转异常
  const isPrefetch =
    request.headers.get('purpose') === 'prefetch' ||
    request.headers.get('x-purpose') === 'prefetch' ||
    request.headers.get('sec-purpose') === 'prefetch' ||
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('x-middleware-prefetch') === '1'

  if (!inProtected || isPrefetch) return NextResponse.next()

  const token = readSupabaseAccessToken(request.cookies as any)
  if (DEBUG) {
    const cookieNames = (request.cookies as any).getAll().map((c: any) => c.name)
    log.debug('MW', {
      url: pathname + (search || ''),
      inAdmin,
      cookieNames,
      hasAnySbCookie: hasSupabaseSessionCookie(request.cookies as any),
      hasAccessToken: Boolean(token),
    })
  }
  if (!token) {
    // 允许已登录但尚未拿到 access-token 的场景（交由布局层严格判定）
    // 若显式开启严格模式，则 admin 仍在中间件直接要求登录
    const hasSb = hasSupabaseSessionCookie(request.cookies as any)
    if (hasSb && (!STRICT_ADMIN_IN_MW || !inAdmin)) {
      if (DEBUG) log.debug('MW', 'allow without access-token (has sb-* cookie)')
      return NextResponse.next()
    }
    const loginUrl = new URL('/login', request.url)
    const next = pathname + (search || '')
    loginUrl.searchParams.set('next', next)
    if (DEBUG) log.debug('MW', 'redirect → /login', { next })
    return NextResponse.redirect(loginUrl)
  }

  // Supabase 推荐：通过 supabase.auth.getClaims() 校验并取 claims
  const res = NextResponse.next()
  const supabase = createMiddlewareClient(request, res)

  // 内联 JWKS（优先离线验证），失败再无参调用回退远端 JWKS
  let claimsResult: any = null
  try {
    const envJwks = process.env.FRX_SUPABASE_JWKS
    let jwks: any = null
    if (envJwks) {
      try {
        const parsed = JSON.parse(envJwks)
        jwks = parsed.keys ? parsed : { keys: [parsed] }
      } catch {}
    }
    if (jwks) {
      claimsResult = await supabase.auth.getClaims(undefined, { jwks })
    }
  } catch {}
  if (!claimsResult?.data) {
    claimsResult = await supabase.auth.getClaims()
  }
  if (!claimsResult?.data) {
    const loginUrl = new URL('/login', request.url)
    const next = pathname + (search || '')
    loginUrl.searchParams.set('next', next)
    if (DEBUG) log.debug('MW', 'invalid token (getClaims) → /login', { next })
    return NextResponse.redirect(loginUrl)
  }

  if (DEBUG) {
    const h: any = claimsResult.data.header
    const c: any = claimsResult.data.claims
    log.debug('MW', 'claims ok', { alg: h?.alg, kid: h?.kid, iss: c?.iss, aud: c?.aud, sub: c?.sub })
  }

  if (inAdmin) {
    const role = extractRole(claimsResult.data.claims as any)
    if (DEBUG) log.debug('MW', 'role check', { role })
    if (!(role === 'admin' || role === 'super_admin')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (DEBUG) log.debug('MW', 'pass')
  return res
}

export const config = {
  // 仅在需要保护的页面运行中间件，减少无关路由开销
  matcher: ['/admin/:path*', '/orders/:path*', '/profile/:path*', '/payment/:path*'],
}
