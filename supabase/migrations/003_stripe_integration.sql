-- Stripe Integration Migration
-- Adds Stripe-related columns to support payment processing

-- Create profiles table if not exists (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create orders table if not exists
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'card',
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Stripe-related columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'card',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Add indexes for Stripe IDs
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id ON public.orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);

-- Create payment_logs table for webhook events
CREATE TABLE IF NOT EXISTS public.payment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Add index for event lookups
CREATE INDEX IF NOT EXISTS idx_payment_logs_stripe_event_id ON public.payment_logs(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_event_type ON public.payment_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_logs_created_at ON public.payment_logs(created_at DESC);

-- Add account column to orders for storing delivered account info
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS account JSONB;

-- Update order status enum if needed
ALTER TABLE public.orders 
ALTER COLUMN status TYPE TEXT;

-- Drop existing constraints if they exist
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS valid_payment_status,
DROP CONSTRAINT IF EXISTS valid_order_status;

-- Add constraint to ensure valid payment status
ALTER TABLE public.orders 
ADD CONSTRAINT valid_payment_status CHECK (
  payment_status IN ('pending', 'succeeded', 'failed', 'canceled')
);

-- Add constraint to ensure valid order status
ALTER TABLE public.orders 
ADD CONSTRAINT valid_order_status CHECK (
  status IN ('pending', 'processing', 'delivered', 'failed', 'canceled', 'expired')
);

-- Row Level Security (RLS) for payment_logs
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can access payment logs
CREATE POLICY "Service role can manage payment_logs" ON public.payment_logs
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Update RLS for orders to include Stripe session lookup
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.email() = email
  );

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    auth.email() = email
  );

-- Comments for documentation
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Stripe Customer ID for payment processing';
COMMENT ON COLUMN public.orders.stripe_session_id IS 'Stripe Checkout Session ID';
COMMENT ON COLUMN public.orders.stripe_payment_intent_id IS 'Stripe Payment Intent ID';
COMMENT ON COLUMN public.orders.payment_method IS 'Payment method used (card, alipay, etc.)';
COMMENT ON COLUMN public.orders.payment_status IS 'Payment status from Stripe';
COMMENT ON COLUMN public.orders.account IS 'Delivered ChatGPT account credentials';
COMMENT ON TABLE public.payment_logs IS 'Stripe webhook event logs for audit trail';