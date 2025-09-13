# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Franxx ChatGPT Cross-Region Subscription Platform** - A ChatGPT subscription platform for Chinese developers, bypassing regional restrictions through Nigerian subscriptions. Themed after the anime "DARLING in the FRANXX".

## Commands

```bash
# Development
npm run dev                  # Start development server (port 3000)
npm run build               # Build for production
npm run start               # Start production server
npm run typecheck           # Run TypeScript type checking
npm run lint                # Run ESLint
npm run lint:fix            # Auto-fix linting issues

# Database Management (via Makefile)
make db-test                # Test database connection
make db-apply               # Apply database schema
make db-types               # Generate TypeScript types from database
make db-diff                # Check schema differences
make db-migration name=xxx  # Create new migration

# Clean build cache when needed
rm -rf .next
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Supabase (Auth + Database)
- **Payments**: Stripe integration
- **State Management**: React Context (AuthContext)

### Authentication Architecture

**ES256 JWT with JWKS** - Upgraded from HS256 for enhanced security:
- Local JWT verification using cached JWKS (fallback to remote)
- Middleware-level route protection at `/middleware.ts`
- Role-based access via JWT claims (user_role/app_metadata.app_role)
- Offline verification support to reduce network dependency

### Data Access Patterns

**RSC-First + Server Actions for writes**:
- Read: RSC pages → service layer → props to client components
- Write: Server Actions + revalidatePath for cache invalidation
- Type-safe Supabase client with generated types

### Component Architecture
- Default to RSC (server components)
- Use `'use client'` only for interactive/stateful components
- Follow shadcn/ui conventions
- Split components >200 lines

## Database

### Supabase Configuration
- **Project URL**: https://njfnsiwznqjbjqohuukc.supabase.co
- **Project Reference**: njfnsiwznqjbjqohuukc
- Database connections managed through Supabase client SDK
- Row-level security enabled for data isolation

### Core Business Model

**Resource Management Chain:**
```
Virtual Card → iOS Account → Gmail Account → ChatGPT Subscription
```

**Subscription Tiers:**
- ChatGPT Plus (Standard FRANXX)
- ChatGPT Pro (Advanced FRANXX)
- ChatGPT Team (Legendary FRANXX/Strelitzia)

**Subscription Modes:**
- Single Pilot (Individual) - Full price
- Dual Pilot (Paired) - 50% per person
- Squad Combat (Team) - 85% total cost

## Project Structure (Next.js 13+ App Router)

```
app/
├── (admin)/          # Admin routes group
├── (protected)/      # Protected routes requiring auth
├── (public)/         # Public routes
├── api/              # API routes (Stripe webhooks, checkout)
├── components/       # React components
│   ├── admin/        # Admin dashboard components
│   ├── ui/           # shadcn/ui components
│   └── [feature]/    # Feature-specific components
├── lib/              # Utilities and services
│   ├── supabase/     # Supabase client configs
│   ├── stripe/       # Stripe utilities
│   └── auth/         # Authentication helpers
├── types/            # TypeScript type definitions
└── contexts/         # React contexts

supabase/
├── migrations/       # Database migrations
└── schema/          # Database schema definitions
```

## Key Integration Points

### Stripe Webhooks (`/api/stripe/webhook`)
- Handles `checkout.session.completed` events
- Updates order status in Supabase
- Creates payment records

### Checkout Sessions (`/api/stripe/create-checkout-session`)
- Creates Stripe checkout for selected packages
- Includes order tracking metadata
- Redirects to payment success/cancel pages

## Development Guidelines

**Path Configuration:**
- Use `@/` alias for imports (maps to `app/` directory)
- All imports should use absolute paths via `@/`

**Component Patterns:**
- Follow shadcn/ui conventions for all UI components
- Use client-side rendering (`'use client'`) only when needed
- Integrate forms with React Hook Form

**State Management:**
- Global auth state via `AuthContext`
- Local state for component-specific data
- Mock data available for development testing

## Environment Variables

Required environment variables (`.env.local`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://njfnsiwznqjbjqohuukc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key
NEXT_PUBLIC_SUPABASE_PROJECT_REF=njfnsiwznqjbjqohuukc

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# JWT Keys (for ES256 authentication)
FRX_SUPABASE_JWKS=your_jwks_json_string
```

## FRANXX Theme Integration

Platform maintains consistent anime theming throughout:
- **Visual Design**: Mecha-style UI with custom fonts (Orbitron, Rajdhani)
- **Terminology**: Parasites (users), Paracapacity (subscription capability)
- **Tier Names**: Uses FRANXX mecha classifications
- **Color Scheme**: Consistent with anime visual style