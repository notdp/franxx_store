# Supabase 数据库与迁移工作流

该目录提供一套“DDL 优先 + 单一基线（flattened baseline）+ 远端 dev 重置”的数据库工作流，仅使用 Supabase CLI（无需 DB_URL/psql）。

## 目录结构（按应用顺序）

- `schema/others/01_extensions.sql`：扩展与开发期默认配置（pgcrypto、supabase_vault、开发默认 crypto_key）
- `schema/others/02_types.sql`：枚举与类型
- `schema/models/*.sql`：业务表（无外键，配合索引与孤儿检查）
- `schema/others/04_functions.sql`：函数与触发器（含 OAuth 同步与管理员判定、加解密工具、updated_at 触发器）
- `schema/others/05_views.sql`：视图与管理侧 RPC（与依赖视图共置）
- `schema/others/06_auth_hooks.sql`：Access Token Hook（把 `user_role` 注入 JWT）
- `schema/others/07_rls.sql`：RLS 策略与授权（最后应用）
- `schema/others/08_orphan_checks.sql`：孤儿检查视图（dev-only，辅助无外键设计）
- `migrations/00000000000000_baseline.sql`：由脚本生成的扁平化基线
- `seed.sql`：开发环境种子（不写 `auth.*`，仅做最小必要数据）
- `scripts/flatten-baseline.cjs`：展开 `schema/*` 为单一基线的脚本
- `Makefile`：CLI 的薄封装（`db.link/db.baseline/db.reset/db.push/db.types`）

## 基本用法（远端 dev）

```bash
# 1) 登录并链接项目（一次性）
supabase login
export NEXT_PUBLIC_SUPABASE_PROJECT_REF=<YOUR_REF>
make db.link

# 2) 生成扁平化基线
make db.baseline

# 3) 重置远端 dev（危险操作，需确认；会执行 seed.sql）
make db.reset

# 4) 日常小改用增量迁移（非破坏性）
make db.push

# 5) 生成 TS 类型
make db.types
```

## OAuth 同步与管理员判定

- 仅支持 GitHub/Google 登录。`auth.users` 新增行后，两个触发器会运行：
  - `public.handle_new_user_profile()`：同步资料到 `public.users`（`provider` 取自 `raw_app_meta_data->>'provider'`）。
  - `public.handle_new_user_role()`：授予角色，规则见下。
- 管理员判定数据源：Supabase Vault 中的 `super_admin_emails` 密文（逗号分隔邮箱）。
  - Getter：`public.get_super_admin_emails() returns text[]`
  - Setter：`public.set_super_admin_emails(text)`（若存在则按 UUID 更新，否则创建）
  - 触发器逻辑：`new.email = ANY(public.get_super_admin_emails())` → `super_admin`，否则 `user`。
- 访问令牌 Hook（可选）：`public.custom_access_token_hook(jsonb)` 会把 `user_role` 注入 JWT；需要在 Dashboard → Auth → Settings 启用。

### 设置/更新管理员邮箱（推荐）

- 通过 helper 设置（需要 Vault 权限）：

```sql
select public.set_super_admin_emails('dp0x7ce@gmail.com,admin2@example.com');
```

- 或直接用 Vault SQL（更新需 UUID）：

```sql
select vault.create_secret('super_admin_emails', 'dp0x7ce@gmail.com');
-- 或
select vault.update_secret('<secret_uuid>', 'a@x.com,b@y.com', 'super_admin_emails', null);
```

- 查看当前密文（解密视图）：

```sql
select * from vault.decrypted_secrets where name = 'super_admin_emails';
```

## 种子（seed）策略

- 不直接写 `auth.*`。首次 OAuth 登录由 GoTrue 写入 `auth.users`，触发器自动同步资料与角色。
- `seed.sql` 会：
  - 调用 `public.set_super_admin_emails(...)`（如权限不足将输出 NOTICE，不会中断），
  - 读取 `public.get_super_admin_emails()`，对已存在的匹配邮箱用户执行 `user_roles` 的 upsert（保证本地/预览环境可立即具备超管），
  - 设置会话 `app.crypto_key`，并写入一批开发用虚拟卡测试数据（自动加密）。

## 无外键与数据一致性

- 为了性能与迁移灵活性，模型不使用外键。通过：
  - 必要索引（如 `idx_orders_user_id/idx_payments_order` 等），
  - 孤儿检查视图（`vw_orphan_*`）
  来保障可观测的一致性。若在 CI/运维中发现孤儿数据，再由任务修复。

## 加密与密钥

- 使用 `pgcrypto` 的对称加解密（`extensions.pgp_sym_encrypt/pgp_sym_decrypt`）封装为 `public.encrypt_text/decrypt_text`，需要 `app.crypto_key`。
- 开发期在 `01_extensions.sql` 中尝试对数据库设置默认密钥（若权限不足会忽略）；`seed.sql` 也会为当前会话设置兜底密钥。
- 生产请把密钥配置到数据库参数或通过安全的方式注入，避免明文散播；敏感数据（如 CVV）不建议在生产环境存储。

## 常见问题（FAQ）

- 重置时报错“Unable to set Vault secret super_admin_emails”？
  - 这是权限不足时 helper 的 NOTICE。请在 Dashboard SQL 控制台用 `vault.create_secret` 创建一次；之后 helper 的更新就会成功。
- 登录后角色仍是 `user`？
  - 确认 `vault.decrypted_secrets` 有 `super_admin_emails`，且邮箱完全匹配；
  - 确认已启用 Access Token Hook（仅影响 JWT 展现，RLS 仍按 `user_roles` 判定）。
- 为什么不用 GUC 存邮箱？
  - Supabase 托管实例通常不允许 `ALTER DATABASE` 设置自定义 GUC；因此改为 Vault 方案。

## 附：当前约束与约定

- 仅 GitHub/Google 作为 provider；`public.users.provider` 上有 check 约束。
- RLS 一律最后应用；函数/触发器带 `SECURITY DEFINER` 以便在 RLS 开启后仍能运行。
- 管理侧视图默认授予最小可见性，建议仅通过 `SECURITY DEFINER` 的 RPC 暴露敏感数据。

