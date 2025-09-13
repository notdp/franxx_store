# Repository Guidelines

## Project Structure & Module Organization

- Next.js App Router lives in `app/` with route groups: `app/(public)`, `app/(protected)`, `app/(admin)`. API routes are under `app/api/**`.
- UI components: feature components in `app/components/**` and Shadcn primitives in `app/components/ui/**`.
- Shared code in `app/lib/**`, types in `app/types/**`, styles in `app/globals.css`.
- Database assets in `supabase/schema/*.sql` and `supabase/seed.sql`. Additional notes live in `docs/`.

## Build, Test, and Development Commands

- `npm run dev` — start the dev server at `http://localhost:3000`.
- `npm run build` / `npm run start` — production build and serve.
- `npm run lint` / `npm run lint:fix` — ESLint check/fix.
- `npm run typecheck` — TypeScript strict checks.
- Database via Supabase CLI (Makefile wrappers; no DB_URL):
  - `make db.link` — link repo to project via `NEXT_PUBLIC_SUPABASE_PROJECT_REF`
  - `make db.baseline` — generate flattened baseline at `supabase/schema/baseline.sql`
  - `make db.publish` — copy baseline into `supabase/migrations/00000000000000_baseline.sql`
  - `make db.reset` — reset linked DB (CLI confirmation; runs `supabase/seed.sql`)
  - `make db.push` — incremental migrate linked DB
  - `make db.types` — generate TS types to `app/types/database.types.ts`

## Coding Style & Naming Conventions

- Language: TypeScript with strict mode; path alias `@/* → app/*`.
- Components in `app/components/**` use PascalCase filenames and exports (e.g., `UserMenu.tsx`).
- Keep Next.js reserved files lowercase: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`.
- Shadcn UI in `app/components/ui/**` stays kebab-case as generated.
- ESLint: extends `next/core-web-vitals`; uses `react-hooks`, `unused-imports` (warns), and `unicorn/filename-case` (warns for components). Run `npm run lint:fix` before pushing.

## Testing Guidelines

- No test runner is configured yet. For new features, prefer Playwright e2e tests under `e2e/` (e.g., checkout flow, auth redirects). Include a `test` script (e.g., `playwright test`) in your PR if you add tests.
- Keep tests hermetic; use Supabase/Stripe test keys and mock network when possible.

## Commit & Pull Request Guidelines

- Follow Conventional Commits: `feat|fix|refactor(scope): message` (see history, e.g., `feat(auth): ...`).
- PRs should include: clear description, linked issues, screenshots for UI, and notes for any DB changes.
- If schema changes: update `supabase/schema/**/*.sql`, run `make db.baseline`, then `make db.reset` (dev-only) or `make db.push` (incremental).
- CI expectations: `npm run lint` and `npm run typecheck` pass; build is green.

## Security & Configuration Tips

- Copy `.env.example` to `.env.local`; never commit secrets. Required envs commonly used here: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL`. Optional: `FRX_SUPABASE_JWKS` for offline JWT verify.
- Middleware guards protected routes; do not expose admin-only pages outside `app/(admin)`.
