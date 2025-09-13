import { supabase } from '@/lib/supabase/client';
import { Order } from '@/types';

// Read API base from env to avoid hardcoding project info
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface RequestOptions {
  requireAuth?: boolean;
  headers?: Record<string, string>;
}

class ApiClient {
  private async getAuthHeaders(requireAuth: boolean = false) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (requireAuth) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        } else {
          throw new Error('Authentication required');
        }
      }

      return headers;
    } catch (error) {
      console.error('Failed to get auth headers:', error);
      throw error;
    }
  }

  async get(endpoint: string, options: RequestOptions = {}) {
    try {
      const headers = await this.getAuthHeaders(options.requireAuth);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: { ...headers, ...options.headers },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `GET ${endpoint} failed`);
      }

      return response.json();
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      throw error;
    }
  }

  async post(endpoint: string, data: any = {}, options: RequestOptions = {}) {
    try {
      const headers = await this.getAuthHeaders(options.requireAuth);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { ...headers, ...options.headers },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `POST ${endpoint} failed`);
      }

      return response.json();
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      throw error;
    }
  }

  async put(endpoint: string, data: any = {}, options: RequestOptions = {}) {
    try {
      const headers = await this.getAuthHeaders(options.requireAuth);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { ...headers, ...options.headers },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `PUT ${endpoint} failed`);
      }

      return response.json();
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error);
      throw error;
    }
  }

  async delete(endpoint: string, options: RequestOptions = {}) {
    try {
      const headers = await this.getAuthHeaders(options.requireAuth);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: { ...headers, ...options.headers },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `DELETE ${endpoint} failed`);
      }

      return response.json();
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      throw error;
    }
  }

  // 便捷方法
  async createOrder(orderData: any) {
    return this.post('/orders', orderData, { requireAuth: true });
  }

  async processPayment(orderId: string) {
    return this.post(`/orders/${orderId}/pay`, {}, { requireAuth: true });
  }

  async getUserOrders(): Promise<Order[]> {
    try {
      const data = await this.get('/orders', { requireAuth: true });
      return data.orders || [];
    } catch (error) {
      console.error('Get user orders error:', error);
      return [];
    }
  }

  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const data = await this.get(`/orders/${orderId}`, { requireAuth: true });
      return data.order;
    } catch (error) {
      console.error('Get order error:', error);
      return null;
    }
  }

  async queryOrder(orderId: string, phone: string): Promise<Order> {
    return this.post('/orders/query', { orderId, phone });
  }

  async getUserStats() {
    try {
      return await this.get('/user/stats', { requireAuth: true });
    } catch (error) {
      console.error('Get user stats error:', error);
      return { stats: { totalOrders: 0, totalSpent: 0, activeAccounts: 0, lastOrderDate: null } };
    }
  }
}

export const apiClient = new ApiClient();
