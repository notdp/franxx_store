# Supabase 数据库设置指南

## 执行数据库迁移

### 方法一：使用 Supabase Dashboard（推荐）

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **SQL Editor**
4. 按顺序执行以下 SQL 文件：
   - `migrations/001_initial_schema.sql` - 创建基础表结构
   - `migrations/002_row_level_security.sql` - 设置安全策略

### 方法二：使用 Supabase CLI

1. 安装 Supabase CLI：
```bash
npm install -g supabase
```

2. 登录并连接项目：
```bash
supabase login
supabase link --project-ref ouluzigygowgmeetahln
```

3. 执行迁移：
```bash
supabase db push
```

## 配置 OAuth 认证

### Google OAuth 设置

1. 在 Supabase Dashboard 中进入 **Authentication** > **Providers**
2. 启用 **Google** provider
3. 添加 Google OAuth 客户端 ID 和密钥
4. 设置重定向 URL：`https://ouluzigygowgmeetahln.supabase.co/auth/v1/callback`

### GitHub OAuth 设置

1. 在 Supabase Dashboard 中进入 **Authentication** > **Providers**
2. 启用 **GitHub** provider
3. 添加 GitHub OAuth App ID 和密钥
4. 设置重定向 URL：`https://ouluzigygowgmeetahln.supabase.co/auth/v1/callback`

## 环境变量配置

确保在 `.env.local` 文件中设置了以下变量：

```env
NEXT_PUBLIC_SUPABASE_URL=https://ouluzigygowgmeetahln.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 测试认证流程

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问 http://localhost:3000/login
3. 测试 Google 和 GitHub 登录

## 数据库结构

### 表结构

- **users** - 用户资料（扩展 auth.users）
- **packages** - 订阅套餐
- **orders** - 订单记录

### RLS 策略

- 用户只能查看和修改自己的数据
- 套餐信息对所有人公开
- 管理员可以查看所有数据

## 故障排除

### 认证问题

- 确保 OAuth 回调 URL 配置正确
- 检查环境变量是否正确设置
- 查看浏览器控制台错误信息

### 数据库连接问题

- 确认 Supabase 项目已启动
- 检查网络连接
- 验证 API 密钥是否正确