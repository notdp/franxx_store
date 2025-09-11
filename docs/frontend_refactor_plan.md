# Frontend Refactor Plan (Next.js 14 + React 18)

This document captures the agreed-upon conventions and the refactor performed in September 2025.

## Goals

- Align component structure with Next.js App Router best practices.
- Remove page-level header wiring; provide a single shared layout header.
- Enforce absolute imports using the `@/` alias.
- Centralize repeated UI logic (e.g., order status).
- Keep data models as in‑memory for now (no data‑source changes).

## Key Changes Implemented (Sep 2025)

- Added `app/components/layout/SiteHeader.tsx` and mounted it in `app/layout.tsx`.
  - Uses `next/link` + `usePathname` for active state.
  - Hides itself on `/admin` routes.
  - Consolidates desktop/mobile nav and user menu.
- Removed duplicated `<Header />` usage from pages:
  - Updated: `app/page.tsx`, `app/order/page.tsx`, `app/orders/page.tsx`, `app/profile/page.tsx`, `app/faq/page.tsx`.
- Normalized imports to `@/` alias in multiple files (e.g., `AuthContext`, Admin components).
- Added `app/constants/order.ts` with status label/style mapping and refactored `OrderQuery` to use it.
- Made Supabase typings pragmatic:
  - Mapped DB user rows to app `User` with a safe default `role: 'user'`.
  - Casted `supabase` to `any` for RPCs or tables not covered in generated types (e.g., `get_app_role`, `admin_list_virtual_cards`, `packages`).
- Reduced ESLint noise by stabilizing Auth helpers in `AuthContext`:
  - Moved role cache functions to module scope; wrapped `getUserRole` with `useCallback` and fixed effect deps.
- Home page componentization and later simplification:
  - Split: `HeroSection`, `FranxxSelection`, `FeaturesSection`, composed in `HomePage`.
  - 2025-09-12: Simplified `HeroSection` for laptop viewability (single‑screen, cleaner copy, background image via `public/images/franxx/*`).
  - Moved “神经连接配置（单人/双人/小队）” from `HeroSection` into `FeaturesSection` as a second subsection.
  - Added `#features` anchor for secondary CTA.
  - Assets relocated from `/assets` to `public/images/franxx/` for Next static serving.
- Route groups:
  - Admin moved to `app/(admin)/admin/*` with its own layout; site homepage moved to `app/(site)/page.tsx`.
  - Removed legacy `app/components/Header.tsx` in favor of global `SiteHeader`.

## Conventions

- Imports: always prefer `@/` absolute paths (configured to `app/*`).
- Components:
  - UI primitives: `app/components/ui/*` (shadcn/radix wrappers).
  - Layout: `app/components/layout/*` (`SiteHeader`, future `Footer`, etc.).
  - Feature components live close to their routes or under `app/components/<feature>`.
- Client vs Server:
  - Server by default; add `'use client'` explicitly for interactive components.
  - Server layouts may render client components.
- Routing:
  - Consider route groups for future segregation, e.g. `(site)` vs `(admin)`.
  - Use `Link` for navigation; avoid passing imperative onNavigate props.
- State & Context:
  - `AuthContext` remains the single source of truth for session/role.
  - Use small, focused hooks under `app/hooks/*`.
- Styling:
  - Tailwind utility‑first; rely on shadcn tokens.
  - Prefer composable components over large monoliths.

## Suggested Next Steps (Optional)

- Migrate remaining site routes into `(site)` group for full isolation:
  - `order/`, `orders/`, `profile/`, `faq/`, `payment/*`, `success`, `login`.
- Extract common building blocks:
  - `StatusBadge`, `EmptyState`, `LoadingSpinner` under `app/components/common/`.
  - Note: deferred until after finalizing the target UI library to avoid rework.
- Route groups to isolate admin from site:
  - Admin moved to `app/(admin)/admin/*`.
  - Site group introduced and homepage moved to `app/(site)/page.tsx` (migrate remaining routes next: order/orders/profile/faq/payment/*/success/login).
- Tighten types: extend `types/database.types.ts` RPC definitions for `get_app_role` and admin RPCs to drop `any` casts.
  - Implemented: added RPC typings for `get_app_role` and `admin_list_virtual_cards` and updated usages to typed `supabase.rpc(...)`.
- Add ESLint rule adjustments or dependencies for the remaining exhaustive‑deps warning (or refactor to satisfy it).

## Planned Work & Approach

- Finish `(site)` route grouping
  - Move remaining routes; introduce `(site)/layout.tsx` when needed (SEO metadata, per‑route headers/footers if required).
  - Keep URLs stable; grouping only affects file organization.

- Type safety consolidation
  - Add typed helpers for `packages` access or migrate to `products_public` where appropriate; remove `as any` in `database.ts`.
  - Consider a lightweight domain types module (`app/types/domain.ts`) to decouple UI from DB shape.

- Client/server boundaries
  - Prefer Server Components for static content; keep interactive parts client-only.
  - Move simple read-only sections out of `'use client'` where possible to trim bundle size.

- Performance and UX polish
  - Validate dynamic imports for admin sub-pages; set `loading.tsx` where navigation jank appears.
  - Prefetch key routes in `SiteHeader`; keep prefetch conditional on role (already applied for admin historically in old Header).

- Theming and design tokens (post library decision)
  - Once component library is chosen, extract common tokens (spacing, radii, shadows) and normalize shadcn overrides.

- Testing readiness (lightweight)
  - Add Playwright smoke tests for critical flows (home → order → stripe success callback → orders list).
  - Keep scope minimal; no blocking CI at this stage.

## Rollback

All changes are additive or minimal; header behavior can be reverted by removing `SiteHeader` from `app/layout.tsx` and restoring per‑page `<Header />` usage.
