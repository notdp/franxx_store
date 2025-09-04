import { supabase } from './client';
import { Package, Order, User } from '@/types';

// User operations
export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as User;
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }
};

// Package operations
export const packageService = {
  async getAll() {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Package[];
  },

  async getById(packageId: string) {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (error) throw error;
    return data as Package;
  },

  async getByTier(tier: 'standard' | 'advanced' | 'legendary') {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  },

  async getById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data as Order;
  },

  async updateStatus(orderId: string, status: Order['status']) {
    const { data, error } = await supabase
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
    return data as User[];
  },

  async updatePackageStock(packageId: string, stock: number) {
    const { data, error } = await supabase
      .from('packages')
      .update({ stock })
      .eq('id', packageId)
      .select()
      .single();

    if (error) throw error;
    return data as Package;
  }
};