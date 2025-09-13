import { createReadOnlyServerClient } from '@/lib/supabase/rsc'
import type { Tables } from '@/types/database.types'
import type { Order } from '@/types'

type OrderRow = Tables<'orders'>

function mapRowToUI(row: OrderRow): Order {
  return {
    id: row.id,
    packageId: row.package_id ?? '',
    packageName: row.package_name ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    status: row.status as Order['status'],
    paymentMethod: row.payment_method ?? 'card',
    amount: Number(row.amount ?? 0),
    createdAt: row.created_at,
    userId: row.user_id ?? undefined,
    account: (row.account as any) ?? undefined,
    stripe_session_id: row.stripe_session_id ?? undefined,
    stripe_payment_intent_id: row.stripe_payment_intent_id ?? undefined,
    stripe_customer_id: row.stripe_customer_id ?? undefined,
    payment_status: (row.payment_status as any) ?? undefined,
  }
}

export async function listOrdersForCurrentUser(): Promise<Order[]> {
  const supabase = createReadOnlyServerClient()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr) throw userErr
  if (!user) return []

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapRowToUI)
}

export async function getOrderByIdForCurrentUser(id: string): Promise<Order | null> {
  const supabase = createReadOnlyServerClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data ? mapRowToUI(data as OrderRow) : null
}

