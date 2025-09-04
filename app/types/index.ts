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
}

export interface Order {
  id: string;
  packageId: string;
  packageName: string;
  phone: string;
  email: string;
  status: 'pending' | 'paid' | 'delivered' | 'failed';
  paymentMethod: 'alipay' | 'wechat';
  amount: number;
  createdAt: string;
  userId?: string;
  account?: {
    email: string;
    password: string;
  };
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
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: any }>;
  logout: () => Promise<void>;
}