# Franxx ChatGPT跨区订阅平台 - 业务逻辑架构

## 🎯 平台概述

### **平台定位**
- **名称**: Franxx ChatGPT跨区订阅平台
- **目标用户**: 国内编码工作者
- **核心服务**: 通过尼日利亚订阅解决国内ChatGPT订阅难题
- **主题设定**: 基于《DARLING in the FRANXX》世界观设计

### **服务套餐**
1. **ChatGPT Plus** - 标准级FRANXX
2. **ChatGPT Pro** - 高级FRANXX  
3. **ChatGPT Team** - 传奇级FRANXX（鹤望兰）

---

## 🚀 用户端业务流程

### **1. 用户注册/登录流程**
```
访问平台 → 浏览套餐 → 选择套餐 → 登录/注册 → 填写订单 → 支付 → 获取账号
```

### **2. 订阅模式（FRANXX驾驶系统）**

#### **🤖 单人驾驶（独立订阅）**
- **描述**: 用户独享一个ChatGPT账号
- **价格**: 原价
- **适用**: 个人开发者、独立工作者

#### **👥 双人驾驶（结对拼车）**
- **描述**: 两人共享一个ChatGPT账号
- **价格**: 费用减半
- **限制**: 需要配对机制，共享使用时间
- **适用**: 团队协作、学习伙伴

#### **⚡ 小队作战（团队订阅）**
- **描述**: 3台FRANXX组队
- **价格**: 85折优惠
- **适用**: 小团队、工作室

### **3. 订单状态流转**
```
pending(待支付) → processing(处理中) → delivered(已交付) → expired(已过期)
```

### **4. 核心功能页面**
- **首页**: 套餐展示、选择
- **登录页**: 用户认证
- **订单页**: 订单信息填写（≤3步）
- **支付成功页**: 账号交付
- **用户中心**: 订单查询、账号管理
- **FAQ页**: 常见问题

---

## 🔧 管理后台业务流程

### **1. 资源管理核心模块（按业务流程顺序）**

#### **💳 虚拟卡管理 (第一层基础)**
```typescript
interface VirtualCard {
  id: string;
  cardNumber: string;        // 卡号
  expiryDate: string;        // 有效期
  cvv: string;              // CVV
  holderName: string;        // 持卡人姓名
  billingAddress: string;    // 账单地址
  balance: number;           // 余额
  status: 'active' | 'suspended' | 'expired';
  provider: string;          // 发卡机构
  region: string;           // 发卡地区（尼日利亚）
}
```
- **作用**: 提供支付能力，用于订阅ChatGPT服务
- **管理**: 卡片状态、余额监控、有效期管理

#### **📧 Gmail账号管理 (第二层业务)**
```typescript
interface GmailAccount {
  id: string;
  email: string;            // Gmail邮箱
  password: string;         // 密码
  status: 'normal' | 'chatgpt-banned' | 'claude-banned' | 'all-banned';
  phone?: string;           // 绑定手机号
  bindedIOSAccount?: string; // 绑定的iOS账号ID（只读）
  createdAt: string;
  updatedAt: string;
  notes?: string;
}
```
- **作用**: 作为ChatGPT账号的基础邮箱
- **状态管理**: 监控封禁状态，支持ChatGPT/Claude分别管理
- **绑定关系**: 被iOS账号绑定（只读显示）

#### **📱 iOS账号管理 (第三层业务)**
```typescript
interface IOSAccount {
  id: string;
  email: string;            // Apple ID邮箱
  password: string;         // 密码
  birthDate: string;        // 出生日期
  fullName: string;         // 姓名
  virtualCardNumber: string; // 绑定的虚拟卡
  status: 'active' | 'suspended' | 'banned' | 'pending';
  riskControlLifted: boolean; // 风控解除状态
  chatgptAccountId: string;   // 绑定的ChatGPT账号（Gmail）
}
```
- **作用**: 在App Store订阅ChatGPT服务
- **绑定管理**: 创建iOS账号到Gmail账号的绑定关系
- **支付链路**: 使用虚拟卡完成App Store支付

### **2. 资源管理业务逻辑**

#### **🔗 绑定关系管理**
```
虚拟卡 ← 绑定 ← iOS账号 ← 绑定 ← Gmail账号 ← 创建 ← ChatGPT订阅
```

1. **虚拟卡 → iOS账号**: iOS账号选择可用虚拟卡进行支付
2. **iOS账号 → Gmail账号**: iOS账号管理界面创建到Gmail的绑定关系
3. **Gmail账号状态**: 只读显示绑定状态，不能修改绑定关系

#### **📊 业务数据流**
```
用户下单 → 分配Gmail账号 → 查找绑定的iOS账号 → 使用虚拟卡订阅 → 交付账号
```

### **3. 订单管理业务流程**

#### **📋 订单处理流程**
1. **订单接收**: 用户下单后创建订单记录
2. **资源分配**: 根据套餐类型分配可用的Gmail账号
3. **账号配置**: 通过绑定的iOS账号完成ChatGPT服务订阅
4. **交付确认**: 验证账号可用性后交付给用户
5. **状态跟踪**: 监控账号使用状态和到期时间

#### **🎛️ 管理功能**
- **订单查询**: 支持多维度筛选和搜索
- **状态更新**: 手动调整订单状态
- **账号重置**: 处理账号异常情况
- **退款处理**: 处理服务异常退款

---

## 🔄 完整业务闭环

### **1. 资源准备阶段**
```
采购虚拟卡 → 注册iOS账号 → 注册Gmail账号 → 建立绑定关系 → 预充值
```

### **2. 订单处理阶段**
```
用户下单 → 分配Gmail账号 → 通过iOS账号订阅 → 账号配置 → 交付用户
```

### **3. 运营监控阶段**
```
账号状态监控 → 异常处理 → 资源补充 → 数据分析 → 优化调整
```

---

## 📈 关键业务指标

### **运营指标**
- **订单转化率**: 从访问到成功付费的转化
- **账号可用率**: 交付账号的正常使用率
- **客户满意度**: 服务质量和响应速度
- **资源利用率**: 虚拟卡、iOS账号、Gmail账号的使用效率

### **技术指标**
- **系统稳定性**: 平台可用性和响应时间
- **支付成功率**: 虚拟卡支付的成功率
- **账号健康度**: Gmail和iOS账号的风控状态

---

## 🛡️ 风险控制

### **账号风险**
- **Gmail封禁**: 分类管理ChatGPT和Claude封禁状态
- **iOS风控**: 监控Apple ID的风控状态
- **虚拟卡异常**: 监控卡片余额和可用状态

### **业务风险**
- **资源短缺**: 提前预警和补充机制
- **政策变化**: 关注相关平台政策调整
- **汇率波动**: 影响成本计算的汇率因素

---

## 🎨 FRANXX主题设定

### **世界观整合**
- **Parasites系统**: 用户角色设定
- **Paracapacity概念**: 订阅能力评估
- **机体数据**: 使用真实FRANXX设定
- **等级系统**: 传奇级（鹤望兰）、高级、标准级

### **界面设计**
- **配色方案**: 使用FRANXX官方色彩
- **字体系统**: Orbitron、Rajdhani、Londrina Outline
- **交互体验**: 符合动漫世界观的界面反馈

---

这个业务逻辑架构确保了平台的完整性和可扩展性，同时保持了FRANXX主题的一致性。每个模块都有明确的职责边界，资源管理遵循严格的业务流程顺序。