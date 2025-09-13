import { decodeProtectedHeader, type JWTPayload } from 'jose'

export type AppJwt = JWTPayload & {
  sub?: string
  email?: string
  app_metadata?: Record<string, any>
  user_metadata?: Record<string, any>
  user_role?: 'user' | 'admin' | 'super_admin'
}

// 读取请求中的 Supabase Access Token（cookie 名称在不同版本可能差异，做多种兼容）
export function readSupabaseAccessToken(reqCookies: { get: (name: string) => { value: string } | undefined; getAll: () => { name: string; value: string }[] }) {
  // 1) 尝试常见 cookie 名
  const tryNames = [
    'sb-access-token',
    'sb:access-token',
    // 一些托管环境可能加 project 前缀或连接符，做模糊匹配
  ]
  for (const n of tryNames) {
    const c = reqCookies.get(n)
    if (c?.value) return c.value
  }

  // 2) 模糊匹配：以 sb- 或 sb: 开头且包含 access 或 auth 的 cookie
  const all = reqCookies.getAll()
  // 2.a 处理分片 cookie（sb-<ref>-auth-token.0 / .1 ...）
  const chunkRe = /^(sb[-:][^.]+-auth-token)\.(\d+)$/
  const chunks = all
    .map((c) => ({ c, m: c.name.match(chunkRe) }))
    .filter((x) => x.m)
    .map((x) => ({ base: (x.m as RegExpMatchArray)[1], idx: parseInt((x.m as RegExpMatchArray)[2], 10), value: x.c.value }))

  if (chunks.length > 0) {
    const byBase: Record<string, { idx: number; value: string }[]> = {}
    for (const ch of chunks) {
      byBase[ch.base] ||= []
      byBase[ch.base].push({ idx: ch.idx, value: ch.value })
    }
    for (const base of Object.keys(byBase)) {
      const joined = byBase[base].sort((a, b) => a.idx - b.idx).map((p) => p.value).join('')
      // 试图从分片拼接出来的值中解析出 access_token
      const token = tryExtractAccessToken(joined)
      if (token) return token
    }
  }

  // 2.b 单体模糊 cookie（可能是 JSON 或 JWT）
  const fuzzy = all.find((c) => /^(sb[-:]).*(access|auth)/i.test(c.name))
  if (fuzzy?.value) {
    const token = tryExtractAccessToken(fuzzy.value)
    if (token) return token
  }

  // 3) 遍历寻找看起来像 JWT 的 cookie（3段 . 分隔，且 header 可解码）
  for (const c of all) {
    const parts = c.value.split('.')
    if (parts.length === 3) {
      try {
        const h = decodeProtectedHeader(c.value)
        if (h && h.alg) return c.value
      } catch {}
    }
  }
  return undefined
}

export function hasSupabaseSessionCookie(reqCookies: { getAll: () => { name: string; value: string }[] }) {
  const names = reqCookies.getAll().map((c) => c.name)
  return names.some((n) => /^(sb[-:]).*(access|refresh|auth)/i.test(n))
}

function tryExtractAccessToken(raw: string): string | undefined {
  // Supabase @supabase/ssr encodes large cookie values as base64url with a "base64-" prefix
  // e.g., sb-<ref>-auth-token.0/.1 → combined value starts with "base64-" then base64url(JSON)
  if (raw.startsWith('base64-')) {
    const b64url = raw.slice('base64-'.length)
    const json = decodeBase64UrlToString(b64url)
    if (json) {
      try {
        const obj = JSON.parse(json)
        const found = extractJwtFromObject(obj)
        if (found) return found
      } catch {}
    }
  }
  // 直接当作 JWT
  if (raw.split('.').length === 3) return raw
  // 尝试 JSON
  try {
    const obj = JSON.parse(raw)
    const found = extractJwtFromObject(obj)
    if (found) return found
  } catch {}
  // 尝试 decodeURIComponent 后再 JSON
  try {
    const dec = decodeURIComponent(raw)
    const obj = JSON.parse(dec)
    if (obj && typeof obj === 'object' && typeof (obj as any).access_token === 'string') {
      return (obj as any).access_token
    }
  } catch {}
  // 尝试 base64 解码后 JSON（Edge: atob；Node: Buffer）
  try {
    // @ts-ignore
    const b64 = typeof atob === 'function'
      ? atob(raw)
      : (typeof Buffer !== 'undefined' ? Buffer.from(raw, 'base64').toString('utf-8') : '')
    if (b64) {
      const obj = JSON.parse(b64)
      const found = extractJwtFromObject(obj)
      if (found) return found
    }
  } catch {}
  return undefined
}

function decodeBase64UrlToString(input: string): string | null {
  try {
    // normalize base64url → base64
    let s = input.replace(/-/g, '+').replace(/_/g, '/');
    // pad with =
    const pad = s.length % 4
    if (pad) s = s + '='.repeat(4 - pad)
    // @ts-ignore
    if (typeof atob === 'function') return atob(s)
    if (typeof Buffer !== 'undefined') return Buffer.from(s, 'base64').toString('utf-8')
    return null
  } catch {
    return null
  }
}

function extractJwtFromObject(obj: any): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined
  // direct keys first
  for (const key of ['access_token', 'accessToken', 'token']) {
    const v = obj[key]
    if (typeof v === 'string' && looksLikeJwt(v)) return v
  }
  // nested common containers
  for (const key of ['session', 'currentSession', 'data', 'value']) {
    const v = obj[key]
    if (v && typeof v === 'object') {
      const found = extractJwtFromObject(v)
      if (found) return found
    }
  }
  // generic deep search (guarded)
  try {
    for (const k of Object.keys(obj)) {
      const v = obj[k]
      if (typeof v === 'string' && looksLikeJwt(v)) return v
      if (v && typeof v === 'object') {
        const found = extractJwtFromObject(v)
        if (found) return found
      }
    }
  } catch {}
  return undefined
}

function looksLikeJwt(s: string) {
  return typeof s === 'string' && s.split('.').length === 3
}

// legacy HS* path removed: ECC-only (ES256 via JWKS)

// verifyJwt/getClaims helpers removed — use supabase.auth.getClaims() where needed

export function extractRole(payload: AppJwt): 'user' | 'admin' | 'super_admin' | null {
  const am = payload.app_metadata || {}
  const um = payload.user_metadata || {}
  const candidates = [
    (payload.user_role as string) ?? null,
    (am.app_role as string) ?? null,
    (am.role as string) ?? null,
    (um.app_role as string) ?? null,
    (um.role as string) ?? null,
    (payload as any).role ?? null,
  ].filter(Boolean) as string[]
  const v = candidates.find((r) => r === 'user' || r === 'admin' || r === 'super_admin')
  return (v as any) || null
}

export function mapJwtToUser(payload: AppJwt) {
  const role = extractRole(payload) || 'user'
  return {
    id: payload.sub || '',
    email: (payload as any).email || '',
    name:
      (payload.user_metadata as any)?.full_name ||
      (payload.user_metadata as any)?.name ||
      ((payload as any).email?.split?.('@')?.[0] ?? 'User'),
    avatar: (payload.user_metadata as any)?.avatar_url,
    provider: ((payload.app_metadata as any)?.provider || 'google') as 'google' | 'github',
    created_at: new Date(0).toISOString(),
    role,
  }
}

// server-only cookie role helpers removed — enforce roles in middleware or handlers via getClaims
