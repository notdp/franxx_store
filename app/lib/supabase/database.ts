import { supabase } from '@/lib/supabase/client';
import { Package, Order, User, UserRole } from '@/types';

// User operations
export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    const raw = data as any
    const mapped: User = {
      id: raw.id,
      email: raw.email,
      name: raw.name ?? raw.email?.split('@')[0] ?? 'User',
      avatar: raw.avatar_url ?? undefined,
      provider: (raw.provider ?? 'google') as 'google' | 'github',
      created_at: raw.created_at,
      role: (raw.role ?? 'user') as UserRole,
      stripe_customer_id: raw.stripe_customer_id ?? undefined,
    }
    return mapped;
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    const raw = data as any
    const mapped: User = {
      id: raw.id,
      email: raw.email,
      name: raw.name ?? raw.email?.split('@')[0] ?? 'User',
      avatar: raw.avatar_url ?? undefined,
      provider: (raw.provider ?? 'google') as 'google' | 'github',
      created_at: raw.created_at,
      role: (raw.role ?? 'user') as UserRole,
      stripe_customer_id: raw.stripe_customer_id ?? undefined,
    }
    return mapped;
  }
};

// Package operations
export const packageService = {
  async getAll() {
    const { data, error } = await (supabase as any)
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Package[];
  },

  async getById(packageId: string) {
    const { data, error } = await (supabase as any)
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (error) throw error;
    return data as Package;
  },

  async getByTier(tier: 'standard' | 'advanced' | 'legendary') {
    const { data, error } = await (supabase as any)
      .from('packages')
      .select('*')
      .eq('tier', tier)
      .order('sale_price', { ascending: true });

    if (error) throw error;
    return data as Package[];
  }
};

// Order operations
export const orderService = {
  async create(orderData: Omit<Order, 'id' | 'createdAt'>) {
    const { data, error } = await (supabase as any)
      .from('orders')
      .insert({
        ...orderData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  },

  async getByUserId(userId: string) {
    const { data, error } = await (supabase as any)
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  },

  async getById(orderId: string) {
    const { data, error } = await (supabase as any)
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data as Order;
  },

  async updateStatus(orderId: string, status: Order['status']) {
    const { data, error } = await (supabase as any)
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  },

  async cancel(orderId: string) {
    return this.updateStatus(orderId, 'failed');
  }
};

// Real-time subscriptions
export const subscriptions = {
  subscribeToOrderUpdates(userId: string, callback: (order: Order) => void) {
    const subscription = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Order);
        }
      )
      .subscribe();

    return subscription;
  },

  subscribeToNewOrders(callback: (order: Order) => void) {
    const subscription = supabase
      .channel('new-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          callback(payload.new as Order);
        }
      )
      .subscribe();

    return subscription;
  },

  unsubscribe(subscription: any) {
    supabase.removeChannel(subscription);
  }
};

// Admin operations (for future use)
export const adminService = {
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        users (
          id,
          email,
          name
        ),
        packages (
          id,
          name,
          tier
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as any[]).map((raw) => ({
      id: raw.id,
      email: raw.email,
      name: raw.name ?? raw.email?.split('@')[0] ?? 'User',
      avatar: raw.avatar_url ?? undefined,
      provider: (raw.provider ?? 'google') as 'google' | 'github',
      created_at: raw.created_at,
      role: 'user' as UserRole,
      stripe_customer_id: raw.stripe_customer_id ?? undefined,
    }))
  },

  async updatePackageStock(packageId: string, stock: number) {
    const { data, error } = await (supabase as any)
      .from('packages')
      .update({ stock })
      .eq('id', packageId)
      .select()
      .single();

    if (error) throw error;
    return data as Package;
  }
};

// Virtual cards (admin only via RLS)
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'

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
