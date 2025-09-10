\set ON_ERROR_STOP on

-- Development-only rebuild of business schema (single source of truth)
-- This script is intended for local/dev usage. For production, generate a baseline migration via `supabase db diff`.

\i 01_extensions.sql
\i 02_types.sql

-- Models
\i models/users.sql
\i models/user_roles.sql
\i models/packages.sql
\i models/orders.sql
\i models/payment_logs.sql
\i models/products.sql
\i models/virtual_cards.sql
\i models/ios_accounts.sql
\i models/email_accounts.sql
\i models/email_platform_status.sql
\i models/payments.sql

-- Functions, triggers, policies, views
\i 03_functions.sql
\i 04_rls.sql
\i 05_views.sql
