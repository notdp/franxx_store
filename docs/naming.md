# Naming Guidelines (Next.js + App Router)

Purpose: keep names predictable and professional. Avoid subjective or temporary words that rot over time.

- Components: PascalCase file names matching the exported component, e.g. `UserMenu.tsx` → `export function UserMenu()`.
- App Router files: keep Next.js reserved names lowercase (`page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`).
- UI primitives: keep Shadcn UI under `app/components/ui/**` in kebab-case (as generated).
- No adjectives like `Simple`, `New`, `Final`, `Old`, `Test`, `Tmp`, `Quick` in filenames.
- Prefer intent-specific names: `UserMenu`, `AccountDropdown`, `AuthAvatar`.

Linting: `eslint-plugin-unicorn` enforces PascalCase for `app/components/**` (except `ui/**`). Warnings are emitted for violations to allow gradual cleanup.

