export interface Package {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  features: string[];
  description: string;
  savings: number;
  popular?: boolean;
  franxx?: {
    model: string;
    name: string;
    code: string;
    color: string;
    accentColor: string;
    tier: 'standard' | 'advanced' | 'legendary';
    pilot: string;
    plantation: string;
    magmaOutput: string;
    stock: number; // 机体库存数量
    totalUnits: number; // 该型号总生产数量
  };
}

export type UserRole = 'user' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'github';
  created_at: string;
  role: UserRole;
  stripe_customer_id?: string;
}

export interface Order {
  id: string;
  packageId: string;
  packageName: string;
  phone: string;
  email: string;
  status: 'pending' | 'processing' | 'delivered' | 'failed' | 'canceled' | 'expired';
  paymentMethod: string; // Now supports various Stripe payment methods
  amount: number;
  createdAt: string;
  userId?: string;
  account?: {
    email: string;
    password: string;
  };
  // Stripe-related fields
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  stripe_customer_id?: string;
  payment_status?: 'pending' | 'succeeded' | 'failed' | 'canceled';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  // 角色加载状态（独立于会话加载）
  roleLoading: boolean;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

// Stripe-related types
export interface PaymentLog {
  id: string;
  stripe_event_id: string;
  event_type: string;
  payload: any;
  created_at: string;
  processed_at?: string;
}

export interface StripeSessionData {
  id: string;
  amount_total: number;
  currency: string;
  customer_email: string | null;
  payment_status: string;
  payment_method_types: string[];
  metadata?: Record<string, string>;
  customer_details?: {
    email?: string;
    phone?: string;
    name?: string;
  };
}
