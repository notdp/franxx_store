# FRANXX Store — 前端优化与重构计划（2025-09-12）

> 目标：在不改变业务语义的前提下，按“RSC 优先 + Server Actions 写入 + 功能域分层”的方式，收紧动态范围、统一数据通道、提升可维护性与性能。

## 1. 当前进度（已完成）

- 路由与页面
  - [x] 将下单页迁移到 app/orders/new/page.tsx，首页跳转同步更新。
  - [x] 恢复原“仪表盘”页为 /orders（保留原 UI 与流程）。
  - [x] 新增 /orders/history（RSC 首屏直出列表，支持刷新/取消/跳详情）。
  - [x] 新增 /orders/[id] 详情页（RSC）。
- 数据访问与服务层
  - [x] 新增服务端 Supabase 帮手：app/lib/supabase/server.ts（Server Actions/Route 用）。
  - [x] 新增订单服务层：app/lib/services/orders.server.ts（listOrdersForCurrentUser、getOrderByIdForCurrentUser）。
  - [x] 新增订单 Actions：app/actions/orders.ts（cancelOrder、revalidateOrders）。
  - [x] 修复 useOrders 鉴权：不再从 localStorage 取伪 token，统一 supabase.auth.getSession()。
- 布局与导航
  - [x] SiteHeader 支持 initialUser（由 SSR 注入，减小首屏抖动）。
  - [x] 导航“我的订单”更名为“仪表盘”（/orders）。
- Stripe Webhook 与配置
  - [x] app/api/stripe/webhook/route.ts 显式 runtime=nodejs + dynamic=force-dynamic；
        强制 SUPABASE_SERVICE_ROLE_KEY，移除对 anon 的回退。
- 依赖与脚本
  - [x] @supabase/supabase-js 归入 dependencies；移除未用 hono；
        钉死 clsx/tailwind-merge 版本。
  - [x] 新增脚本：typecheck、lint:fix。
  - [x] .env.example 补齐 STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET/NEXT_PUBLIC_BASE_URL 等。
- 安全与卫生
  - [x] Makefile 移除明文连接串，统一读 DB_URL/DATABASE_URL。

### Auth（2025-09-13 更新）

- [x] OAuth 回调：`app/auth/callback/route.ts` 使用 @supabase/ssr 推荐的 `cookies.getAll/setAll` 适配，`exchangeCodeForSession` 成功后额外写入 `sb-access-token`/`sb-refresh-token`（SameSite=Lax，prod Secure），用于客户端自举会话。
- [x] 客户端会话自举：`AuthContext` 首个 `getSession()` 前读取上述 cookie 并 `supabase.auth.setSession()`，带 `/login?next` 跳回原页面。
- [x] 中间件鉴权改造（ES256）：`middleware.ts` 改为 `supabase.auth.getClaims()`，优先使用本地 `FRX_SUPABASE_JWKS` 离线验签，失败回退远端 JWKS；admin 路由基于 claims 中 `app_metadata.app_role` 判定。
- [x] RSC 鉴权一致化：`app/lib/supabase/rsc.ts` 优先 `getClaims(undefined,{jwks})`，失败回退远端 `getClaims()`；仅在极少数无 access-token 且仍有 refresh 的情况回退 `auth.getUser()`。
- [x] JWT 工具收敛：`app/lib/auth/jwt.ts` 移除 HS* 与手动 JWKS 验签（统一使用 getClaims）；仅保留 `readSupabaseAccessToken`/`hasSupabaseSessionCookie`/`extractRole`/`mapJwtToUser`。
- [x] 角色来源统一：角色仅来自 Access Token 声明（`user_role` 或 `app_metadata.app_role`），删除 localStorage 角色缓存与 RPC 回退。
- [x] 登出链路规整：Server Action `app/actions/auth.ts` 仅调用 `supabase.auth.signOut()`（由 cookies 适配正确回写 Set-Cookie）；客户端 `logout()` 清理自举 cookies 后执行 `router.replace('/')` + `router.refresh()`，无需手动刷新。
- [x] 日志统一：新增 `app/lib/log.ts`；中间件/RSC/AuthContext 统一使用 `log.debug` 等；生产默认静音。
- [x] 修复 PKCE 错误：所有 SSR 客户端均改为 `cookies: { getAll, setAll }`，解决 `/auth/callback` 读取 `code_verifier` 失败导致的 400/500。

已切换 ES256（完成）：
- [x] 项目使用 ES256（ECC）签名；`FRX_SUPABASE_JWKS` 已配置；全链路统一走 `getClaims()` + JWKS 验签；移除 HS* 分支与相关环境依赖。

## 2. 待办清单与优先级（可执行）

### A. 收紧动态渲染范围（高优先）

- [x] A1 鉴权标准化：Middleware/服务器端基于 Supabase JWT 本地判定
      - 启用 Auth Hook（Customize Access Token Claims，Postgres）：将 `app_metadata.app_role` 写入 JWT。
      - Middleware：读取并验签 JWT（HS* 或 JWKS），未登录 302，`/admin` 判 `admin/super_admin`。
      - 服务器端：`getUserWithRole` 从 JWT 构造用户，`requireUser/requireAdmin` 不再发 RPC。
      - 客户端：AuthContext 优先从 JWT 读取角色，无需首屏 RPC；仅在无声明时回退 RPC。
- [x] A2 根布局去除 SSR 获取用户（getUserWithRole），由 Header/客户端自恢复；根布局保持纯 RSC。
- [x] A3 移除分组级 dynamic=force-dynamic（orders/profile/(admin) 布局），仅在确需的页面/handler 标注。

### B. 清理重复/历史文件（中优先）

- [x] B1 删除未使用的 app/components/Header.tsx（全仓搜确认无引用）。
- [x] B2 在 supabase/schema/schema_flat.sql 开头加“归档/只读导出”注释，单一真源为 supabase/schema/*.sql。

### C. Supabase 类型与 any 清理（中优先）

- [x] C1 app/lib/supabase/database.ts 强类型化（Tables<T>/TablesInsert/TablesUpdate），抽出 Row→UI DTO 映射。
- [ ] C2 执行 npm run db:types（或 make db-types），清理历史漂移字段（如 card_brand）。

### F. JWT 签名与离线验签（高优先）

- [x] F1 启用 ES256 并配置 JWKS（`FRX_SUPABASE_JWKS`）。
- [x] F2 中间件/RSC 优先本地 JWKS、失败远端；日志校验 `alg/kid` 正确。
- [x] F3 移除 HS* 兼容路径与 `SUPABASE_JWT_SECRET` 依赖。

### D. 统一读写通道（高优先）

- [x] D1 站内读写收口：受保护读→RSC/服务层，写→Server Actions；暂不提供“游客订单查询”。
- [x] 移除客户端 anon-key 头用法（无游客查询场景）；`lib/api.ts` 在非鉴权分支不再注入 Authorization。
- [ ] 若未来需要游客只读查询（商品/公告），采用本地 Route Handler 暴露只读端点，并受限速与字段白名单保护。

### E. AuthProvider 范围收缩（中优先）

- [x] E1 将 AuthProvider 下沉到 (site) 分组（orders/profile 也复用 SiteShell）；根布局不再包裹。
- [ ] E2 Admin 去上下文化：逐步移除 admin 组件对 useAuth 的直接依赖，改为 RSC 注入必要数据（或最小化轻量上下文）；完成后可移除 AdminShell。

## 3. 实施顺序与预估

1) A 组（0.5–1 天）：中间件鉴权 + 根布局去 SSR 用户 + 移除分组级 dynamic。
2) D 组（0.5 天）：站内 CRUD 收口（orders 已完成，逐步覆盖 profile/admin）。
3) C 组（0.5–1 天）：强类型化与类型同步。
4) B 组（0.5 小时）：历史文件清理与归档标注。
5) E 组（0.5 天）：AuthProvider 范围收缩。

注：按模块分支小步提交，每步保持可回滚，优先确保 next build、typecheck、lint 通过。

## 4. 设计约定（落地准则）

- 数据边界
  - 读：RSC 页面/布局调用服务层（app/lib/services/*），props 下发到客户端组件。
  - 写：Server Actions（app/actions/*）+ revalidatePath；以 props 传给客户端组件调用。
  - Route Handler 仅用于四类：Webhook、第三方代理、二进制流、SSE/WebSocket。
- 组件边界
  - 默认 RSC；仅交互/状态组件用 .client.tsx；大组件 >200 行即拆分（工具条/表格/弹窗）。
- 类型准则
  - DB 类型以 app/types/database.types.ts 为准；UI 类型集中在 app/types/index.ts；Row↔UI 的映射集中在服务层/mapper。
- 鉴权
  - 受保护路由靠 middleware.ts；页面内部不再做重定向校验（避免扩大动态面）。

## 5. 验收与验证清单

- 构建/类型/Lint
  - [ ] npm run typecheck 全绿；npm run lint 无高优先告警。
  - [ ] next build 中动态页面数减少，仅确需的页面/handler 保持动态。
- 功能走查
  - [ ] /orders 仍为原“仪表盘”；/orders/history RSC 列表可刷新/取消/跳详情；/orders/[id] 可访问。
  - [ ] 未登录访问受保护路由被中间件 302 至 /login；登录后直达。
- 代码检索
  - [ ] 全仓无 components/Header.tsx 引用；lib/api.ts 仅剩访客查询用途。

## 6. 风险与回滚

- A 组改动可能影响鉴权路径：先开“影子模式”（中间件日志校验），确认无误后再删除布局侧 requireUserAt。
- C 组类型强化可能造成编译失败：按模块小步推进，先 orders，再 profile/admin。
- 任一步出现问题均可回滚至上一个小步提交（每步只动有限文件，变更面可控）。

## 7. 变更摘要（截至本次）

- 新增：
  - app/features/orders/components/OrderList.client.tsx
  - app/orders/history/page.tsx
  - app/orders/[id]/page.tsx
  - app/lib/supabase/server.ts
  - app/lib/services/orders.server.ts
  - app/actions/orders.ts
- 修改：
  - middleware.ts：改为 `auth.getClaims()` + JWKS；统一日志。
  - app/lib/supabase/rsc.ts：改为 `auth.getClaims()`；对齐中间件策略。
  - app/lib/auth/jwt.ts：移除手动验签与 HS*；仅保留读 cookie/取角色/映射。
  - app/contexts/AuthContext.tsx：删除角色缓存与 RPC；统一从 JWT 取角色；logout 刷新路由。
  - app/actions/auth.ts：移除手动 cookie 清理循环；依赖 `signOut()` + cookies.setAll。
  - app/auth/callback/route.ts：修复 PKCE 读取，统一 cookies.getAll/setAll；回调后补写自举 cookies。
  - app/components/LoginPage.tsx：社交登录按钮固定图标占位与尺寸，避免点击闪动。
  - app/orders/page.tsx 恢复为原“仪表盘”客户端页
  - app/layout.tsx 向 SiteHeader 注入 initialUser
  - app/components/layout/SiteHeader.tsx 接收 initialUser；导航更名为“仪表盘”
  - app/hooks/useOrders.ts 鉴权/headers 修复
  - app/api/stripe/webhook/route.ts 运行时与 service key 强制
  - .env.example、Makefile、package.json、.eslintrc.json
  - supabase/schema/schema_flat.sql 增加“归档/只读导出”头注释（B2）
  - app/contexts/AuthContext.tsx 使用已生成的 RPC 类型，移除 any（C1）
  - app/lib/supabase/database.ts 收敛为仅导出 typed `cardsService`（移除历史未用的 any 代码）（C1）
- 移动：
  - app/order/page.tsx → app/orders/new/page.tsx

本次新增/修改（A1+A3）：
- middleware.ts 增加受保护路由门禁（未登录跳 /login?next=...；admin 需 admin/super_admin）。
- app/lib/supabase/middleware.ts 抽出 createMiddlewareClient。
- 删除布局鉴权与强制动态：app/orders/layout.tsx、app/profile/layout.tsx、app/(admin)/admin/layout.tsx。
此外（A2）：
- app/layout.tsx 移除 SSR 注入用户，`<AuthProvider>` 与 `<SiteHeader>` 不再接收 `initialUser`。
此外（E1）：
- 新增 app/components/layout/SiteShell.tsx（client）：统一包裹 AuthProvider + SiteHeader + Toaster。
- 新增 app/(site)/layout.tsx、app/orders/layout.tsx、app/profile/layout.tsx：使用 SiteShell 包裹。
- 根布局移除 `<AuthProvider>` 与 `<SiteHeader>`（仅保留 HTML 结构）。

—— 本文档将随每个阶段性提交持续更新。
