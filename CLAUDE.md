# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Franxx ChatGPT跨区订阅平台** - A ChatGPT subscription platform for Chinese developers using Nigerian subscriptions to bypass regional restrictions. Themed after "DARLING in the FRANXX" anime.

## Commands

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Clean build cache when needed
rm -rf .next
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Supabase (authentication + database)
- **State Management**: React Context (AuthContext)

### Project Structure (Next.js 13+ App Router Convention)

```
app/                    # All application code in app directory
├── (routes)/          # Page routes
│   ├── admin/         # Admin dashboard route
│   ├── faq/           # FAQ page route
│   ├── login/         # Login page route
│   ├── order/         # Order form route
│   ├── orders/        # User orders dashboard
│   ├── profile/       # User profile route
│   └── success/       # Payment success route
├── components/        # React components
│   ├── admin/         # Admin dashboard components
│   ├── ui/            # shadcn/ui components
│   └── figma/         # Figma-specific components
├── contexts/          # React contexts (AuthContext)
├── data/              # Mock data and constants
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and libraries
│   ├── supabase/      # Supabase client configuration
│   └── api.ts         # API client utilities
├── types/             # TypeScript type definitions
├── styles/            # Global styles
├── guidelines/        # Business logic documentation
├── layout.tsx         # Root layout with providers
└── page.tsx           # Home page
```

### Core Business Model

The platform operates a three-tier subscription system with FRANXX-themed branding:

**Subscription Tiers:**
1. **ChatGPT Plus** (标准级FRANXX) - Standard subscription
2. **ChatGPT Pro** (高级FRANXX) - Premium features
3. **ChatGPT Team** (传奇级FRANXX/鹤望兰) - Team collaboration

**Subscription Modes:**
- **单人驾驶** (Individual) - Full price, single user
- **双人驾驶** (Paired) - 50% cost per person, shared access
- **小队作战** (Team) - 85% of total cost, group discount

### Resource Management Chain

The admin system manages a strict resource hierarchy:

```
虚拟卡 (Virtual Card) 
  ↓ [Payment Method]
iOS账号 (iOS Account)
  ↓ [Creates & Binds]
Gmail账号 (Gmail Account)
  ↓ [Registration Base]
ChatGPT订阅 (ChatGPT Subscription)
```

**Key Relationships:**
- Virtual cards provide payment capability for App Store
- iOS accounts create and manage Gmail accounts
- Gmail accounts serve as ChatGPT account registration base
- Binding relationships are managed through iOS account interface

### Authentication Flow

Supabase Auth integration with OAuth providers:
- Google OAuth for quick signin
- GitHub OAuth for developer accounts
- Session persistence via `AuthContext`
- Mock user available for development (`USE_MOCK_USER` flag)

### Data Models

**Core Entities** (`app/types/index.ts`):
- `Package`: Subscription packages with pricing tiers
- `User`: User accounts with OAuth integration
- `Order`: Order tracking with status management
- `FAQ`: Frequently asked questions

**Admin Resource Entities** (Conceptual):
- `VirtualCard`: Payment cards with balance tracking
- `IOSAccount`: Apple IDs with risk control status
- `GmailAccount`: Gmail accounts with ban status monitoring

### Critical Business Logic

**Order Processing Flow:**
```
pending → processing → delivered → expired
```

**Account Health Monitoring:**
- Virtual card balance and expiry tracking
- Gmail ban status (ChatGPT/Claude separate)
- iOS account risk control management
- Resource availability alerts

### Development Guidelines

**Path Configuration:**
- Use `@/` alias for imports (maps to `app/` directory)
- All imports should use absolute paths via `@/`

**Component Patterns:**
- All UI components follow shadcn/ui conventions
- Components use client-side rendering (`'use client'`) when needed
- Form components integrate with React Hook Form

**State Management:**
- Global auth state via `AuthContext`
- Local state for component-specific data
- Mock data available for development testing

**Styling Approach:**
- Tailwind CSS for utility-first styling
- CSS modules in `app/styles/` for global styles
- Custom animations via `tailwindcss-animate`

### FRANXX Theme Integration

The platform maintains consistent anime theming throughout:
- **Visual Design**: Mecha-inspired UI with custom fonts (Orbitron, Rajdhani)
- **Terminology**: Parasites (users), Paracapacity (subscription capability)
- **Tier Names**: Using FRANXX mech classifications
- **Color Scheme**: Consistent with anime visual identity