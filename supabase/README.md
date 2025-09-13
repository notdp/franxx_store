# Supabase 数据库设置指南

## 开发期：单一事实源（SSoT）

开发阶段不再产出多份迁移，统一维护 `./supabase/schema/` 下的 SQL（按 01–05 顺序）：

- `01_extensions.sql`：扩展
- `02_types.sql`：枚举/类型
- `models/*.sql`：业务表（users/user_roles/packages/orders/payment_logs/products/virtual_cards/ios_accounts/email_accounts/email_platform_status/payments）
- `03_functions.sql`：函数与触发器
- `04_rls.sql`：RLS 策略与基础 GRANT
- `05_views.sql`：视图
- `schema.sql` 为入口文件，按如上次序逐个 `\i` 引入。
- 本地或开发库重建：

```bash
export DB_URL="postgres://user:pass@host:5432/dbname"
npm run db:apply
npm run db:seed   # 可选：插入样例套餐
```

新增表（与文档设计一致）：

- `models/products.sql`：商品目录（平台 `openai/anthropic`、服务 `tag` 枚举、定价与库存声明）
- `models/virtual_cards.sql`：虚拟卡（`pan_encrypted/cvv_encrypted/last4/brand` 等，加密存储，仅管理员可见）
- `models/ios_accounts.sql`：iOS 账号（绑定虚拟卡，`slot_combo` 合并占用位）
- `models/email_accounts.sql`：邮箱账号（可分配/保留/回收）
- `models/email_platform_status.sql`：邮箱在各平台状态（`openai/anthropic`）
- `models/payments.sql`：Stripe 支付流水（Checkout/PI/Charge/Refund 各 ID + 幂等 `stripe_event_id`）

生成 TypeScript 数据库类型：

```bash
npm run db:types
```

当模型稳定、准备上生产时，再用 Supabase CLI 生成一次基线迁移：

```bash
supabase db diff -f baseline_init
```

后续再进入迁移化流程。

## 配置 OAuth 认证

### Google OAuth 设置

1. 在 Supabase Dashboard 中进入 **Authentication** > **Providers**
2. 启用 **Google** provider
3. 添加 Google OAuth 客户端 ID 和密钥
4. 设置重定向 URL：`https://njfnsiwznqjbjqohuukc.supabase.co/auth/v1/callback`

### GitHub OAuth 设置

1. 在 Supabase Dashboard 中进入 **Authentication** > **Providers**
2. 启用 **GitHub** provider
3. 添加 GitHub OAuth App ID 和密钥
4. 设置重定向 URL：`https://njfnsiwznqjbjqohuukc.supabase.co/auth/v1/callback`

## 环境变量配置

确保在 `.env.local` 文件中设置了以下变量：

```env
NEXT_PUBLIC_SUPABASE_URL=https://njfnsiwznqjbjqohuukc.supabase.co
# New API keys
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
# Server secret (replaces legacy service role)
SUPABASE_SECRET_KEY=your-secret-key
```

## 测试认证流程

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问 http://localhost:3000/login
3. 测试 Google 和 GitHub 登录

## 数据库结构

### 表结构（public schema）

- `users`：用户资料（扩展 `auth.users`），含 `stripe_customer_id`
- `user_roles`：用户角色（`app_role` 枚举：user/admin/super_admin）
- `packages`：订阅套餐（支持软删 `deleted_at`）
- `products`：商品目录（`platform/tag` 枚举、定价、库存声明）
- `orders`：订单（新增 `final_amount/discount_type/discount_snapshot/currency/payment_status` 等，同时保留旧字段兼容 UI）
- `payments`：Stripe 流水（`cs_/pi_/ch_/re_/cus_/evt_` 字段与状态）
- `virtual_cards`：虚拟卡（敏感信息加密存储）
- `ios_accounts`：iOS 账号（`slot_combo` 聚合占位）
- `email_accounts`：邮箱账号
- `email_platform_status`：邮箱在 OpenAI/Anthropic 的平台状态
- `payment_logs`：Stripe Webhook 事件原始日志（仅 service role 访问）

### RLS 策略

- `users`：本人可读写；管理员可读全量
- `user_roles`：本人可读；仅 `super_admin` 可写
- `packages`：所有人可读；仅管理员可写
- `products`：所有人可读（在售）；仅管理员可写
- `orders`：本人（按 `user_id` 或邮箱）可读/写部分状态；管理员可读写
- `payments`：本人可读（通过 `orders` 关联）；仅管理员可写
- `virtual_cards` / `ios_accounts` / `email_accounts` / `email_platform_status`：仅管理员可管理
- `payment_logs`：不创建策略（仅 service role 可越过 RLS）

## 故障排除

### 认证问题

- 确保 OAuth 回调 URL 配置正确
- 检查环境变量是否正确设置
- 查看浏览器控制台错误信息

### 数据库连接问题

- 确认 Supabase 项目已启动
- 检查网络连接
- 验证 API 密钥是否正确
