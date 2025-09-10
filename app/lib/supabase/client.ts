import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

declare global {
  // eslint-disable-next-line no-var
  var __supabase_singleton__: SupabaseClient | undefined
}

// 开发环境下使用全局变量持久化，避免 HMR 多实例；生产环境按模块单例
export const supabase: SupabaseClient<Database> =
  (globalThis.__supabase_singleton__ as SupabaseClient<Database> | undefined) ??
  createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, { db: { schema: 'public' } })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__supabase_singleton__ = supabase
}
