import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Order } from '@/types'
import { supabase } from '@/lib/supabase/client'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAuthHeaders = async (requireAuth: boolean = true) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (requireAuth) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) throw new Error('Unauthorized')
      headers['Authorization'] = `Bearer ${session.access_token}`
    }
    return headers
  }

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/orders`, {
        headers: await getAuthHeaders(true),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err) {
      console.error('Fetch orders error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [user]);

  const createOrder = async (orderData: any) => {
    try {
      setError(null)

      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: await getAuthHeaders(true),
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const data = await response.json()
      return data.order
    } catch (err) {
      console.error('Create order error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create order')
      throw err
    }
  }

  const completeOrder = async (orderId: string) => {
    try {
      setError(null)

      const response = await fetch(`${API_BASE}/orders/${orderId}/complete`, {
        method: 'POST',
        headers: await getAuthHeaders(true),
      })

      if (!response.ok) {
        throw new Error('Failed to complete order')
      }

      const data = await response.json()
      
      // 更新本地订单列表
      setOrders(prev => prev.map(order => (
        order.id === orderId ? data.order : order
      )))
      
      return data.order
    } catch (err) {
      console.error('Complete order error:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete order')
      throw err
    }
  }

  // 游客订单查询暂未开放。若将来需要，请改为调用本地 Route Handler 或 Server Action。

  useEffect(() => {
    if (user) {
      fetchOrders()
    } else {
      setOrders([])
    }
  }, [user, fetchOrders])

  return {
    orders,
    loading,
    error,
    createOrder,
    completeOrder,
    refetch: fetchOrders,
  }
}
