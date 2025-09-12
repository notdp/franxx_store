import { NextResponse } from 'next/server'
import type { User } from '@/types'
import { getUserWithRole } from '@/lib/supabase/rsc'

export const dynamic = 'force-dynamic'

export async function GET() {
  // 只读：不在此处刷新/写Cookie，保证Middleware是唯一刷新点
  const user: User | null = await getUserWithRole()
  return NextResponse.json({ user })
}
