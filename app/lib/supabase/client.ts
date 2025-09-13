import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Require the new Publishable Key only (no legacy fallback)
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
}

declare global {
  // eslint-disable-next-line no-var
  var __supabase_singleton__: SupabaseClient | undefined
}

// 开发环境下使用全局变量持久化，避免 HMR 多实例；生产环境按模块单例
export const supabase: SupabaseClient<Database> =
  (globalThis.__supabase_singleton__ as SupabaseClient<Database> | undefined) ??
  createBrowserClient<Database>(supabaseUrl, supabasePublishableKey, { db: { schema: 'public' } })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__supabase_singleton__ = supabase
}
