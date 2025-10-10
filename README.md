# SEUAirline 航空预订系统 - Vue 3 版本

基于 Vue 3 + TypeScript + Vite 构建的现代化航空预订系统前端项目。

## 项目概述

这是 SEUAirline 航空预订系统的 Vue 3 升级版本，从原有的纯 HTML/JS 原型升级为使用现代前端框架的完整应用。

### 主要特性

- ✅ **Vue 3 Composition API** - 使用最新的 Vue 3 特性和 `<script setup>` 语法
- ✅ **TypeScript** - 完整的类型安全支持
- ✅ **Vite** - 极速的开发体验和构建性能
- ✅ **Vue Router 4** - 客户端路由管理
- ✅ **Pinia** - 现代化的状态管理
- ✅ **Tailwind CSS** - 实用优先的 CSS 框架
- ✅ **Mock API** - 完整的模拟后端接口
- ✅ **响应式设计** - 适配各种屏幕尺寸

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue | 3.4+ |
| 语言 | TypeScript | 5.x |
| 构建工具 | Vite | 5.x |
| 路由 | Vue Router | 4.x |
| 状态管理 | Pinia | 2.x |
| UI 框架 | Tailwind CSS | 3.x |
| HTTP 客户端 | Axios | 1.x |
| 日期处理 | dayjs | 1.x |
| 图表 | Chart.js + vue-chartjs | 4.x + 5.x |
| 表单验证 | VeeValidate + Yup | 4.x + 1.x |
| 图标 | @iconify/vue + lucide-vue-next | - |

## 项目结构

```
seu-airline-vue/
├── public/                    # 静态资源
│   └── data/                  # JSON 数据文件
│       ├── airports.json
│       └── flights.json
├── src/
│   ├── api/                   # API 层
│   │   ├── client.ts          # Axios 配置
│   │   ├── mock.ts            # Mock API 实现
│   │   ├── user.ts            # 用户 API
│   │   ├── admin.ts           # 管理员 API
│   │   ├── flight.ts          # 航班 API
│   │   └── order.ts           # 订单 API
│   ├── assets/                # 资源文件
│   │   └── styles/
│   │       └── main.css       # 全局样式
│   ├── components/            # 公共组件
│   │   ├── common/            # 通用组件
│   │   ├── user/              # 用户端组件
│   │   └── admin/             # 管理端组件
│   ├── router/                # 路由配置
│   │   └── index.ts
│   ├── stores/                # Pinia 状态管理
│   │   ├── user.ts            # 用户状态
│   │   ├── admin.ts           # 管理员状态
│   │   ├── flight.ts          # 航班状态
│   │   ├── order.ts           # 订单状态
│   │   └── app.ts             # 应用状态
│   ├── types/                 # TypeScript 类型定义
│   │   ├── user.ts
│   │   ├── flight.ts
│   │   ├── order.ts
│   │   └── api.ts
│   ├── utils/                 # 工具函数
│   │   ├── format.ts          # 格式化工具
│   │   ├── validation.ts      # 验证工具
│   │   └── storage.ts         # 存储工具
│   ├── views/                 # 页面组件
│   │   ├── user/              # 用户端页面 (10个)
│   │   └── admin/             # 管理端页面 (10个)
│   ├── App.vue                # 根组件
│   ├── main.ts                # 入口文件
│   └── vite-env.d.ts          # Vite 类型声明
├── .env.development           # 开发环境变量
├── .env.production            # 生产环境变量
├── .eslintrc.cjs              # ESLint 配置
├── .prettierrc.json           # Prettier 配置
├── index.html                 # HTML 入口
├── package.json               # 依赖配置
├── postcss.config.js          # PostCSS 配置
├── tailwind.config.js         # Tailwind 配置
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
└── README.md                  # 项目文档
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm (推荐)
pnpm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 功能模块

### 用户端功能

- ✅ **首页** - 航班搜索、特色服务展示
- ✅ **用户登录/注册** - 完整的认证流程
- 🚧 **航班搜索** - 多条件搜索航班
- 🚧 **航班预订** - 选择乘客、舱位
- 🚧 **订单支付** - 多种支付方式
- 🚧 **订单管理** - 查看、取消订单
- 🚧 **个人中心** - 用户信息管理
- 🚧 **帮助中心** - 常见问题解答

### 管理端功能

- ✅ **管理员登录** - 独立的管理员认证
- 🚧 **仪表盘** - 数据统计和图表
- 🚧 **航班管理** - CRUD 操作
- 🚧 **订单管理** - 订单查询和处理
- 🚧 **用户管理** - 用户信息管理
- 🚧 **机场管理** - 机场信息维护
- 🚧 **系统设置** - 系统配置
- 🚧 **日志管理** - 操作日志查询

图例: ✅ 已完成 | 🚧 开发中 | ⏳ 计划中

## 开发指南

### 代码规范

- 使用 ESLint + Prettier 保证代码质量
- 组件命名使用 PascalCase
- 使用 Composition API 和 `<script setup>` 语法
- Props 和 Emits 使用 TypeScript 类型定义
- 优先使用 Tailwind CSS 工具类

### 状态管理

使用 Pinia 进行状态管理，主要 Store:

- `useUserStore` - 用户认证和信息
- `useAdminStore` - 管理员认证
- `useFlightStore` - 航班搜索和数据
- `useOrderStore` - 订单管理
- `useAppStore` - 应用全局状态

### API 调用

所有 API 调用都通过 `src/api` 目录下的模块进行，当前使用 Mock API 模拟后端。

### 路由守卫

- 用户端需要认证的路由使用 `requiresAuth` meta
- 管理端路由使用 `requiresAdmin` meta
- 未认证用户会被重定向到登录页

## 测试账号

### 用户端
- 任意用户名和密码都可以登录（Mock 模式）

### 管理端
- 用户名: `admin`
- 密码: `admin123`

## 部署

### GitHub Pages

```bash
# 构建
npm run build

# 部署到 gh-pages 分支
# (需要配置 vite.config.ts 中的 base 路径)
```

### 其他平台

构建后的 `dist` 目录可以部署到任何静态托管服务。

## 开发进度

- [x] 阶段 1: 项目初始化和基础架构
- [ ] 阶段 2: 用户端核心功能开发
- [ ] 阶段 3: 管理端功能开发
- [ ] 阶段 4: 组件优化和代码重构
- [ ] 阶段 5: 测试和文档完善

## 许可证

本项目仅供学习和演示使用。

## 致谢

- Vue.js 团队
- Vite 团队
- Tailwind CSS
- 所有开源贡献者

---

© 2024 SEUAirline 航空预订系统
