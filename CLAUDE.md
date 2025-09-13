# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指导。

## 项目概述

**Franxx ChatGPT 跨区订阅平台** - 为中国开发者提供的 ChatGPT 订阅平台，通过尼日利亚订阅绕过地区限制。以动漫《DARLING in the FRANXX》为主题设计。

## 数据库连接信息

### PostgreSQL 直连（推荐）
```
主机: db.ouluzigygowgmeetahln.supabase.co
端口: 5432
数据库: postgres
用户名: postgres
密码: seven-gong-crane-knee
SSL模式: Require
```

**连接字符串：**
```
postgresql://postgres:seven-gong-crane-knee@db.ouluzigygowgmeetahln.supabase.co:5432/postgres?sslmode=require
```

### 连接池模式（备用）
```
主机: aws-0-us-west-1.pooler.supabase.com
端口: 5432
数据库: postgres
用户名: postgres.ouluzigygowgmeetahln
密码: seven-gong-crane-knee
```

**连接字符串：**
```
postgresql://postgres.ouluzigygowgmeetahln:seven-gong-crane-knee@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

### Prisma 配置
```env
# .env 文件配置
DATABASE_URL=postgresql://postgres:seven-gong-crane-knee@db.ouluzigygowgmeetahln.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:seven-gong-crane-knee@db.ouluzigygowgmeetahln.supabase.co:5432/postgres
```

## 常用命令

```bash
# 安装依赖
npm install

# 运行开发服务器（端口 3000）
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 运行代码检查
npm run lint

# 需要时清理构建缓存
rm -rf .next
```

## 环境变量

必需的环境变量：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
# 已迁移至新 API Key：
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的_supabase_publishable_key

# Stripe
STRIPE_SECRET_KEY=你的_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=你的_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=你的_stripe_webhook_secret
```

## 架构

### 技术栈

- **框架**: Next.js 14 (App Router) + React 18 + TypeScript
- **UI 组件**: shadcn/ui 配合 Radix UI 原语
- **样式**: Tailwind CSS 加自定义动画
- **后端**: Supabase（认证 + 数据库）
- **支付**: Stripe 集成
- **状态管理**: React Context (AuthContext)

### 项目结构（Next.js 13+ App Router 约定）

```plain
app/                    # 所有应用代码都在 app 目录中
├── api/               # API 路由
│   └── stripe/        # Stripe webhook 和结账端点
├── (routes)/          # 页面路由
│   ├── admin/         # 管理员仪表板路由
│   ├── faq/           # 常见问题页面路由
│   ├── login/         # 登录页面路由
│   ├── order/         # 订单表单路由
│   ├── orders/        # 用户订单仪表板
│   ├── payment/       # 支付成功/取消页面
│   └── profile/       # 用户资料路由
├── components/        # React 组件
│   ├── admin/         # 管理员仪表板组件
│   ├── ui/            # shadcn/ui 组件
│   └── figma/         # Figma 特定组件
├── contexts/          # React 上下文（AuthContext）
├── data/              # 模拟数据和常量
├── hooks/             # 自定义 React 钩子
├── lib/               # 工具函数和库
│   ├── supabase/      # Supabase 客户端配置
│   └── stripe/        # Stripe 客户端和服务器工具
├── types/             # TypeScript 类型定义
├── styles/            # 全局样式
├── guidelines/        # 业务逻辑文档
├── layout.tsx         # 带 providers 的根布局
└── page.tsx           # 首页

supabase/
└── migrations/        # 数据库迁移文件
```

### 核心业务模型

平台运营三层订阅系统，采用 FRANXX 主题品牌：

**订阅层级：**

1. **ChatGPT Plus**（标准级 FRANXX）- 标准订阅
2. **ChatGPT Pro**（高级 FRANXX）- 高级功能
3. **ChatGPT Team**（传奇级 FRANXX/鹤望兰）- 团队协作

**订阅模式：**

- **单人驾驶**（个人）- 全价，单用户
- **双人驾驶**（配对）- 每人 50% 费用，共享访问
- **小队作战**（团队）- 总费用的 85%，团体优惠

### 资源管理链

管理系统管理严格的资源层级：

```plain
虚拟卡（Virtual Card）
  ↓ [支付方式]
iOS账号（iOS Account）
  ↓ [创建并绑定]
Gmail账号（Gmail Account）
  ↓ [注册基础]
ChatGPT订阅（ChatGPT Subscription）
```

**关键关系：**

- 虚拟卡为 App Store 提供支付能力
- iOS 账号创建和管理 Gmail 账号
- Gmail 账号作为 ChatGPT 账号注册基础
- 绑定关系通过 iOS 账号界面管理

### 认证流程

Supabase Auth 集成 OAuth 提供商：

- Google OAuth 快速登录
- GitHub OAuth 开发者账号
- 通过 `AuthContext` 保持会话
- 开发时可用模拟用户（`USE_MOCK_USER` 标志）

### 数据模型

**核心实体**（`app/types/index.ts`）：

- `Package`：带定价层级的订阅套餐
- `User`：带 OAuth 集成的用户账户
- `Order`：带状态管理的订单跟踪
- `FAQ`：常见问题

**管理资源实体**（概念性）：

- `VirtualCard`：带余额跟踪的支付卡
- `IOSAccount`：带风控状态的 Apple ID
- `GmailAccount`：带封禁状态监控的 Gmail 账号

### 数据库架构

通过 Supabase 迁移管理的关键表：

- `users`：带角色的扩展用户资料
- `orders`：带 Stripe 集成的订单跟踪
- `payments`：链接到 Stripe 的支付记录
- 数据隔离的行级安全策略

### 关键业务逻辑

**订单处理流程：**

```plain
待处理 → 处理中 → 已交付 → 已过期
```

**支付流程：**

1. 用户选择订阅层级和模式
2. 通过 API 创建 Stripe 结账会话
3. 通过 Stripe 处理支付
4. Webhook 在 Supabase 中更新订单状态
5. 管理员为已完成订单分配资源

**账号健康监控：**

- 虚拟卡余额和到期跟踪
- Gmail 封禁状态（ChatGPT/Claude 分开）
- iOS 账号风控管理
- 资源可用性警报

### 开发指南

**路径配置：**

- 使用 `@/` 别名导入（映射到 `app/` 目录）
- 所有导入应通过 `@/` 使用绝对路径

**组件模式：**

- 所有 UI 组件遵循 shadcn/ui 约定
- 需要时组件使用客户端渲染（`'use client'`）
- 表单组件与 React Hook Form 集成

**状态管理：**

- 通过 `AuthContext` 的全局认证状态
- 组件特定数据的本地状态
- 开发测试可用的模拟数据

**样式方法：**

- Tailwind CSS 实用优先样式
- `app/styles/` 中的 CSS 模块用于全局样式
- 通过 `tailwindcss-animate` 的自定义动画

### API 集成点

**Stripe Webhooks**（`/api/stripe/webhook`）：

- 处理 `checkout.session.completed` 事件
- 在 Supabase 中更新订单状态
- 管理支付记录创建

**结账会话**（`/api/stripe/create-checkout-session`）：

- 为选定套餐创建 Stripe 结账
- 包含订单跟踪元数据
- 重定向到支付成功/取消页面

### FRANXX 主题集成

平台全程保持一致的动漫主题：

- **视觉设计**：机甲风格 UI，自定义字体（Orbitron、Rajdhani）
- **术语**：Parasites（用户）、Paracapacity（订阅能力）
- **层级名称**：使用 FRANXX 机体分类
- **配色方案**：与动漫视觉风格一致
