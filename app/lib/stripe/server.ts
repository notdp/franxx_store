import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

// Use library default API version to avoid TS drift issues
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});
