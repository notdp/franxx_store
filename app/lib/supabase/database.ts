import { supabase } from '@/lib/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'

// Virtual cards (admin only via RLS)
type VirtualCardRow = Tables<'virtual_cards'>
type VirtualCardInsert = TablesInsert<'virtual_cards'>
type VirtualCardUpdate = TablesUpdate<'virtual_cards'>

// Admin RPC return type
export type AdminCard = {
  id: string
  pan_plain: string | null
  last4: string | null
  expiry: string | null // 'YYYY/MM'
  cvv_plain: string | null
  provider: string | null
  holder_name: string | null
  balance: number | null
  currency: VirtualCardRow['currency']
  status: VirtualCardRow['status']
  monthly_limit: number | null
  used_this_month: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export const cardsService = {
  async list(): Promise<AdminCard[]> {
    const { data, error } = await supabase.rpc('admin_list_virtual_cards')
    if (error) throw error
    return (data ?? []) as AdminCard[]
  },

  async create(input: {
    pan: string
    cvv: string
    expiry: string // 'YYYY/MM'
    currency: VirtualCardRow['currency']
    status: VirtualCardRow['status']
    provider?: string | null
    holder_name?: string | null
    balance?: number | null
    monthly_limit?: number | null
    notes?: string | null
  }): Promise<VirtualCardRow> {
    const last4 = input.pan.slice(-4)
    const payload: VirtualCardInsert = {
      pan_encrypted: input.pan,
      cvv_encrypted: input.cvv,
      last4,
      expiry_date: input.expiry,
      provider: input.provider ?? null,
      holder_name: input.holder_name ?? null,
      balance: input.balance ?? 0,
      currency: input.currency,
      status: input.status,
      monthly_limit: input.monthly_limit ?? null,
      notes: input.notes ?? null,
    }
    const { data, error } = await supabase
      .from('virtual_cards')
      .insert(payload)
      .select('*')
      .single()
    if (error) throw error
    return data as VirtualCardRow
  },

  async update(id: string, updates: Partial<{
    pan: string
    cvv: string
    expiry: string
    currency: VirtualCardRow['currency']
    status: VirtualCardRow['status']
    provider: string | null
    holder_name: string | null
    balance: number | null
    monthly_limit: number | null
    used_this_month: number | null
    notes: string | null
  }>): Promise<VirtualCardRow> {
    const payload: VirtualCardUpdate = {}
    if (updates.pan) {
      payload.pan_encrypted = updates.pan
      payload.last4 = updates.pan.slice(-4)
    }
    if (updates.cvv) payload.cvv_encrypted = updates.cvv
    if (updates.currency) payload.currency = updates.currency
    if (updates.status) payload.status = updates.status
    if ('provider' in updates) payload.provider = updates.provider ?? null
    if ('holder_name' in updates) payload.holder_name = updates.holder_name ?? null
    if ('balance' in updates) payload.balance = updates.balance ?? null
    if ('monthly_limit' in updates) payload.monthly_limit = updates.monthly_limit ?? null
    if ('used_this_month' in updates) payload.used_this_month = updates.used_this_month ?? null
    if ('notes' in updates) payload.notes = updates.notes ?? null
    if (updates.expiry) payload.expiry_date = updates.expiry

    const { data, error } = await supabase
      .from('virtual_cards')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw error
    return data as VirtualCardRow
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('virtual_cards')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}
