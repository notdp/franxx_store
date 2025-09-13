# Franxx Store Makefile

# Database Configuration (read from environment)
# Export DATABASE_URL or set DB_URL when invoking make, e.g.:
#   export DATABASE_URL=postgresql://user:pass@host:6543/db
#   make db-apply
DB_URL ?= $(DATABASE_URL)

ifndef DB_URL
$(warning DB_URL is not set. Please export DATABASE_URL or pass DB_URL=...)
endif

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

.PHONY: help
help: ## Show this help message
	@echo "$(GREEN)Franxx Store - Database Management$(NC)"
	@echo ""
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

.PHONY: db-test
db-test: ## Test database connection
	@echo "$(YELLOW)Testing database connection...$(NC)"
	@psql "$(DB_URL)" -c "SELECT version();" > /dev/null 2>&1 && \
		echo "$(GREEN)✓ Database connection successful$(NC)" || \
		echo "$(RED)✗ Database connection failed$(NC)"

.PHONY: db-apply
db-apply: ## Apply database schema
	@echo "$(YELLOW)Applying database schema...$(NC)"
	@cd supabase/schema && psql "$(DB_URL)" -v ON_ERROR_STOP=1 -f schema.sql
	@echo "$(GREEN)✓ Database schema applied successfully$(NC)"

.PHONY: db-reset
db-reset: ## Reset database (DROP ALL and reapply schema) - DANGEROUS!
	@echo "$(RED)WARNING: This will DROP ALL TABLES and reset the database!$(NC)"
	@echo "Press Ctrl+C to cancel, or Enter to continue..."
	@read confirm
	@echo "$(YELLOW)Resetting database...$(NC)"
	@cd supabase/schema && psql "$(DB_URL)" -v ON_ERROR_STOP=1 -f schema.sql
	@echo "$(GREEN)✓ Database reset complete$(NC)"

.PHONY: db-seed
db-seed: ## Seed database with development data
	@echo "$(YELLOW)Seeding database...$(NC)"
	@if [ -f "supabase/seed_dev.sql" ]; then \
		psql "$(DB_URL)" -v ON_ERROR_STOP=1 -f supabase/seed_dev.sql; \
		echo "$(GREEN)✓ Database seeded successfully$(NC)"; \
	else \
		echo "$(RED)✗ seed_dev.sql not found$(NC)"; \
	fi

.PHONY: db-backup
db-backup: ## Backup database schema and data
	@echo "$(YELLOW)Creating database backup...$(NC)"
	@mkdir -p backups
	@pg_dump "$(DB_URL)" --no-owner --no-acl -f "backups/backup_$$(date +%Y%m%d_%H%M%S).sql"
	@echo "$(GREEN)✓ Backup created in backups/ directory$(NC)"

.PHONY: db-console
db-console: ## Open interactive database console
	@echo "$(YELLOW)Opening database console...$(NC)"
	@psql "$(DB_URL)"

.PHONY: db-tables
db-tables: ## List all tables
	@psql "$(DB_URL)" -c "\dt public.*"

.PHONY: db-count
db-count: ## Show row counts for all tables
	@echo "$(YELLOW)Table row counts:$(NC)"
	@psql "$(DB_URL)" -t -c "SELECT schemaname, tablename, n_live_tup as rows FROM pg_stat_user_tables WHERE schemaname = 'public' ORDER BY n_live_tup DESC;"

.PHONY: db-types
db-types: ## Generate TypeScript types from remote database
	@echo "$(YELLOW)Generating TypeScript types from remote database...$(NC)"
	@npx supabase gen types typescript \
		--db-url "$(DB_URL)" \
		--schema public \
		> app/types/database.types.ts
	@echo "$(GREEN)✓ TypeScript types generated in app/types/database.types.ts$(NC)"

.PHONY: db-types-local
db-types-local: ## Generate TypeScript types from local database
	@echo "$(YELLOW)Generating TypeScript types from local database...$(NC)"
	@npx supabase gen types typescript \
		--local \
		--schema public \
		> app/types/database.types.ts
	@echo "$(GREEN)✓ TypeScript types generated in app/types/database.types.ts$(NC)"

.PHONY: db-types-project
db-types-project: ## Generate TypeScript types using project ID
	@echo "$(YELLOW)Generating TypeScript types using project ID...$(NC)"
	@npx supabase gen types typescript \
		--project-id ouluzigygowgmeetahln \
		--schema public \
		> app/types/database.types.ts
	@echo "$(GREEN)✓ TypeScript types generated in app/types/database.types.ts$(NC)"

.PHONY: dev
dev: ## Start development server
	@echo "$(YELLOW)Starting development server...$(NC)"
	npm run dev

.PHONY: build
build: ## Build production bundle
	@echo "$(YELLOW)Building production bundle...$(NC)"
	npm run build

.PHONY: start
start: ## Start production server
	@echo "$(YELLOW)Starting production server...$(NC)"
	npm run start

.PHONY: lint
lint: ## Run linting
	@echo "$(YELLOW)Running lint...$(NC)"
	npm run lint

.PHONY: clean
clean: ## Clean build artifacts
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	rm -rf .next
	rm -rf node_modules/.cache
	@echo "$(GREEN)✓ Clean complete$(NC)"

.PHONY: install
install: ## Install dependencies
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

# Default target
.DEFAULT_GOAL := help
