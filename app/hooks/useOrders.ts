import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('supabase.auth.token');
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || anon}`,
    };
  };

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/orders`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createOrder = async (orderData: any) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      return data.order;
    } catch (err) {
      console.error('Create order error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    }
  };

  const completeOrder = async (orderId: string) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE}/orders/${orderId}/complete`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to complete order');
      }

      const data = await response.json();
      
      // 更新本地订单列表
      setOrders(prev => prev.map(order => 
        order.id === orderId ? data.order : order
      ));
      
      return data.order;
    } catch (err) {
      console.error('Complete order error:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete order');
      throw err;
    }
  };

  const queryGuestOrder = async (orderId: string, phone: string) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE}/orders/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
        },
        body: JSON.stringify({ orderId, phone })
      });

      if (!response.ok) {
        throw new Error('Order not found');
      }

      const data = await response.json();
      return data.order;
    } catch (err) {
      console.error('Query order error:', err);
      setError(err instanceof Error ? err.message : 'Failed to query order');
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user, fetchOrders]);

  return {
    orders,
    loading,
    error,
    createOrder,
    completeOrder,
    queryGuestOrder,
    refetch: fetchOrders
  };
}
