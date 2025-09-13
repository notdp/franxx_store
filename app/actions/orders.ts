'use server'

import { revalidatePath } from 'next/cache'
import { createWritableServerClient } from '@/lib/supabase/server'

export async function cancelOrder(orderId: string) {
  const supabase = createWritableServerClient()

  // Ensure user is authenticated (RLS will also protect)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('orders')
    .update({ status: 'canceled' })
    .eq('id', orderId)
    .select('id')
    .single()

  if (error) throw error
  revalidatePath('/orders')
}

export async function revalidateOrders() {
  revalidatePath('/orders')
}

