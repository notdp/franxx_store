### Franxx Store Makefile (clean, CLI-only)

# Colors
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

.PHONY: help
help: ## Show available commands
	@echo "$(GREEN)Franxx Store - Tasks$(NC)" && echo && \
	grep -E '^[a-zA-Z0-9_.-]+:.*?## ' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS=":.*?## "} {printf "  $(YELLOW)%-22s$(NC) %s\n", $$1, $$2}'

# ---------- App ----------
.PHONY: dev
dev: ## Start Next.js dev server
	npm run dev

.PHONY: build
build: ## Build production bundle
	npm run build

.PHONY: start
start: ## Start production server
	npm run start

.PHONY: lint
lint: ## Run ESLint
	npm run lint

.PHONY: typecheck
typecheck: ## Run TypeScript checks
	npm run typecheck

.PHONY: clean
clean: ## Clean build artifacts
	rm -rf .next node_modules/.cache

# ---------- Supabase (CLI-only) ----------
.PHONY: db.link
db.link: ## Link this repo to a Supabase project (env: NEXT_PUBLIC_SUPABASE_PROJECT_REF)
	@test -n "$$NEXT_PUBLIC_SUPABASE_PROJECT_REF" || { echo "Set NEXT_PUBLIC_SUPABASE_PROJECT_REF first"; exit 1; }
	supabase link --project-ref "$$NEXT_PUBLIC_SUPABASE_PROJECT_REF"

.PHONY: db.baseline
db.baseline: ## Generate flattened baseline at supabase/schema/baseline.sql
	node scripts/flatten-baseline.cjs

.PHONY: db.reset
db.reset: ## Reset linked database (dangerous; CLI will confirm; runs seed.sql)
	supabase db reset --linked

.PHONY: db.push
db.push: ## Apply migrations incrementally to linked project
	supabase db push --linked

.PHONY: db.types
db.types: ## Generate TS types from linked project
	supabase gen types typescript --linked --schema public > app/types/database.types.ts

# Default
.DEFAULT_GOAL := help

