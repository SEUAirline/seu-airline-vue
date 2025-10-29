# SEUAirline Vue3 项目开发计划 - 2025-10-10

## 📋 项目修复记录

### 第一次修复 - 2025-10-10 14:11

#### 1. TypeScript 配置问题 ✅

**问题描述:**
- `tsconfig.node.json` 缺少 `strict` 编译选项（错误级别）
- `tsconfig.node.json` 缺少 `forceConsistentCasingInFileNames` 选项（警告级别）
- `tsconfig.json` 缺少 `forceConsistentCasingInFileNames` 选项（警告级别）

**修复方案:**
在 `tsconfig.node.json` 中添加:
```json
"strict": true,
"forceConsistentCasingInFileNames": true
```

在 `tsconfig.json` 中添加:
```json
"forceConsistentCasingInFileNames": true
```

**修复结果:** ✅ 已完成

---

### 第二次修复 - 2025-10-10 14:29

#### 2. 路由守卫参数类型错误 ✅

**问题描述:**
- `src/router/index.ts` 中路由守卫的参数 `to`, `from`, `next` 隐式具有 `any` 类型
- 参数 `from` 声明但未使用

**修复方案:**
```typescript
// 修复前
router.beforeEach((to, from, next) => {

// 修复后
import { type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
```

**修复结果:** ✅ 已完成

#### 3. API 函数未使用参数警告 ✅

**问题描述:**
- `src/api/flight.ts` 中 `updateFlight` 和 `deleteFlight` 的 `flightId` 参数未使用
- `src/api/user.ts` 中 `updateProfile` 的 `userId` 参数未使用

**修复方案:**
使用下划线前缀标记未使用的参数（TypeScript 约定）:
```typescript
// 修复前
async updateFlight(flightId: string, data: Partial<Flight>)
async deleteFlight(flightId: string)
async updateProfile(userId: number | string, data: Partial<User>)

// 修复后
async updateFlight(_flightId: string, data: Partial<Flight>)
async deleteFlight(_flightId: string)
async updateProfile(_userId: number | string, data: Partial<User>)
```

**修复结果:** ✅ 已完成

#### 4. 依赖安装完成 ✅

**状态:** 
- ✅ `node_modules` 已安装
- ✅ 所有依赖包已就绪
- ⏳ TypeScript 语言服务器可能需要重启以识别模块

**建议操作:**
如果 IDE 仍显示"找不到模块"错误，请执行以下操作之一：
1. 重启 TypeScript 语言服务器（VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"）
2. 重新加载窗口（VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"）
3. 重启 IDE

---

## 🎯 项目当前状态

### 已完成的工作

#### ✅ 阶段1: 项目初始化
- [x] 创建 Vite + Vue 3 + TypeScript 项目结构
- [x] 配置 Tailwind CSS
- [x] 配置 ESLint + Prettier
- [x] 设置环境变量文件

#### ✅ 阶段2: 基础架构
- [x] 配置 Vue Router (22个路由)
- [x] 配置 Pinia 状态管理 (5个 Store)
- [x] 定义 TypeScript 类型系统
- [x] 创建工具函数库

#### ✅ 阶段6: API层实现
- [x] 创建 Axios 客户端配置
- [x] 实现 Mock API 服务
- [x] 创建各模块 API 接口

#### 🚧 阶段3: 基础页面
- [x] 用户端首页 (完整实现)
- [x] 用户登录页 (完整实现)
- [x] 用户注册页 (完整实现)
- [x] 管理员登录页 (完整实现)
- [x] 404 页面
- [ ] 其他页面 (占位状态)

### 文件统计

| 类别 | 数量 | 状态 |
|------|------|------|
| 配置文件 | 8 | ✅ |
| 类型定义 | 4 | ✅ |
| API 模块 | 5 | ✅ |
| Store | 5 | ✅ |
| 工具函数 | 3 | ✅ |
| 用户端页面 | 10 | 3个完成 + 7个占位 |
| 管理端页面 | 11 | 1个完成 + 10个占位 |
| 公共组件 | 1 | ✅ |
| 数据文件 | 2 | ✅ |

**总计:** 60+ 个文件

---

## 📅 后续开发计划

### 优先级1: 用户端核心功能 (预计 3-5 天)

#### 1.1 航班搜索功能
**文件:** `src/views/user/FlightSearchPage.vue`

**功能需求:**
- [ ] 显示搜索条件摘要
- [ ] 航班列表展示（卡片式）
- [ ] 航班筛选功能（价格、时间、航空公司）
- [ ] 航班排序（价格、时间）
- [ ] 分页功能
- [ ] 无结果提示

**涉及组件:**
- [ ] `FlightCard.vue` - 航班卡片组件
- [ ] `FlightFilter.vue` - 筛选器组件
- [ ] `Pagination.vue` - 分页组件

**预计工时:** 1天

#### 1.2 航班预订功能
**文件:** `src/views/user/FlightBookPage.vue`

**功能需求:**
- [ ] 航班详情展示
- [ ] 乘客信息表单（支持多乘客）
- [ ] 舱位选择
- [ ] 联系人信息
- [ ] 表单验证
- [ ] 创建订单

**涉及组件:**
- [ ] `PassengerForm.vue` - 乘客信息表单
- [ ] `CabinSelector.vue` - 舱位选择器
- [ ] `ContactForm.vue` - 联系人表单

**预计工时:** 1.5天

#### 1.3 支付功能
**文件:** `src/views/user/PaymentPage.vue`

**功能需求:**
- [ ] 订单信息确认
- [ ] 支付方式选择（支付宝、微信、银行卡）
- [ ] 支付倒计时
- [ ] 支付模拟流程
- [ ] 支付成功跳转

**涉及组件:**
- [ ] `PaymentMethod.vue` - 支付方式选择
- [ ] `OrderSummary.vue` - 订单摘要

**预计工时:** 1天

#### 1.4 订单管理
**文件:** `src/views/user/OrderListPage.vue`

**功能需求:**
- [ ] 订单列表展示
- [ ] 订单状态筛选
- [ ] 订单详情查看
- [ ] 订单取消功能
- [ ] 订单搜索

**涉及组件:**
- [ ] `OrderCard.vue` - 订单卡片
- [ ] `OrderDetail.vue` - 订单详情

**预计工时:** 1天

#### 1.5 订单成功页
**文件:** `src/views/user/OrderSuccessPage.vue`

**功能需求:**
- [ ] 成功提示动画
- [ ] 订单信息展示
- [ ] 操作按钮（查看订单、继续预订）

**预计工时:** 0.5天

#### 1.6 个人中心
**文件:** `src/views/user/UserCenterPage.vue`

**功能需求:**
- [ ] 用户信息展示
- [ ] 个人信息编辑
- [ ] 密码修改
- [ ] 积分和会员等级
- [ ] 常用乘客管理

**涉及组件:**
- [ ] `ProfileForm.vue` - 个人信息表单
- [ ] `PasswordForm.vue` - 密码修改表单
- [ ] `FrequentPassenger.vue` - 常用乘客管理

**预计工时:** 1天

#### 1.7 帮助中心
**文件:** `src/views/user/HelpCenterPage.vue`

**功能需求:**
- [ ] 常见问题列表
- [ ] 问题分类
- [ ] 搜索功能
- [ ] 联系客服

**预计工时:** 0.5天

---

### 优先级2: 管理端功能 (预计 4-6 天)

#### 2.1 管理控制台
**文件:** `src/views/admin/DashboardPage.vue`

**功能需求:**
- [ ] 统计卡片（用户数、订单数、航班数、收入）
- [ ] 图表展示（订单趋势、收入趋势）
- [ ] 待处理事项
- [ ] 快捷操作

**涉及组件:**
- [ ] `AdminLayout.vue` - 管理端布局
- [ ] `AdminSidebar.vue` - 侧边栏
- [ ] `StatCard.vue` - 统计卡片
- [ ] `ChartCard.vue` - 图表卡片

**预计工时:** 1.5天

#### 2.2 航班管理
**文件:** `src/views/admin/FlightManagePage.vue`

**功能需求:**
- [ ] 航班列表（表格）
- [ ] 添加航班
- [ ] 编辑航班
- [ ] 删除航班
- [ ] 航班搜索和筛选
- [ ] 批量操作

**涉及组件:**
- [ ] `DataTable.vue` - 数据表格组件
- [ ] `FlightForm.vue` - 航班表单
- [ ] `Modal.vue` - 模态框

**预计工时:** 1.5天

#### 2.3 订单管理
**文件:** `src/views/admin/OrderManagePage.vue`

**功能需求:**
- [ ] 订单列表
- [ ] 订单详情查看
- [ ] 订单状态修改
- [ ] 订单搜索和筛选
- [ ] 订单导出

**预计工时:** 1天

#### 2.4 用户管理
**文件:** `src/views/admin/UserManagePage.vue`

**功能需求:**
- [ ] 用户列表
- [ ] 用户详情
- [ ] 用户状态管理
- [ ] 用户搜索

**预计工时:** 1天

#### 2.5 机场管理
**文件:** `src/views/admin/AirportManagePage.vue`

**功能需求:**
- [ ] 机场列表
- [ ] 添加/编辑机场
- [ ] 删除机场

**预计工时:** 0.5天

#### 2.6 其他管理页面
- [ ] 管理员账户管理
- [ ] 系统设置
- [ ] 日志管理
- [ ] 文档中心
- [ ] 帮助中心

**预计工时:** 2天

---

### 优先级3: 公共组件开发 (预计 2-3 天)

#### 3.1 布局组件
- [ ] `UserLayout.vue` - 用户端布局
- [ ] `AdminLayout.vue` - 管理端布局
- [ ] `AppHeader.vue` - 顶部导航
- [ ] `AppFooter.vue` - 页脚

#### 3.2 表单组件
- [ ] `FormInput.vue` - 输入框
- [ ] `FormSelect.vue` - 下拉选择
- [ ] `FormDatePicker.vue` - 日期选择器
- [ ] `FormRadio.vue` - 单选框
- [ ] `FormCheckbox.vue` - 复选框

#### 3.3 反馈组件
- [ ] `Toast.vue` - 消息提示
- [ ] `Modal.vue` - 模态框
- [ ] `Alert.vue` - 警告提示
- [ ] `Confirm.vue` - 确认对话框

#### 3.4 数据展示组件
- [ ] `DataTable.vue` - 数据表格
- [ ] `Pagination.vue` - 分页
- [ ] `Empty.vue` - 空状态
- [ ] `Badge.vue` - 徽章

---

### 优先级4: 优化和完善 (预计 2-3 天)

#### 4.1 性能优化
- [ ] 路由懒加载优化
- [ ] 组件按需加载
- [ ] 图片懒加载
- [ ] 代码分割优化

#### 4.2 用户体验优化
- [ ] 加载状态优化
- [ ] 错误处理优化
- [ ] 表单验证优化
- [ ] 响应式布局优化

#### 4.3 代码质量
- [ ] 代码重构
- [ ] 添加注释
- [ ] 单元测试（可选）
- [ ] E2E测试（可选）

#### 4.4 文档完善
- [ ] API 文档
- [ ] 组件文档
- [ ] 开发指南
- [ ] 部署文档

---

## 🔧 技术债务

### 待解决的问题
1. [ ] 完善错误处理机制
2. [ ] 添加全局 Loading 组件
3. [ ] 实现 Toast 消息提示系统
4. [ ] 优化 Mock API 数据持久化
5. [ ] 添加请求拦截器的错误处理
6. [ ] 实现文件上传功能（头像上传）

### 待优化的功能
1. [ ] 航班搜索结果缓存
2. [ ] 用户登录状态持久化优化
3. [ ] 表单验证规则统一管理
4. [ ] 日期时间处理统一
5. [ ] 响应式断点统一管理

---

## 📊 开发进度追踪

### 总体进度
- **已完成:** 30%
- **进行中:** 0%
- **待开始:** 70%

### 各模块进度

| 模块 | 进度 | 状态 |
|------|------|------|
| 项目初始化 | 100% | ✅ 已完成 |
| 基础架构 | 100% | ✅ 已完成 |
| API层 | 100% | ✅ 已完成 |
| 用户端-认证 | 100% | ✅ 已完成 |
| 用户端-首页 | 100% | ✅ 已完成 |
| 用户端-航班搜索 | 0% | ⏳ 待开始 |
| 用户端-预订流程 | 0% | ⏳ 待开始 |
| 用户端-订单管理 | 0% | ⏳ 待开始 |
| 用户端-个人中心 | 0% | ⏳ 待开始 |
| 管理端-Dashboard | 0% | ⏳ 待开始 |
| 管理端-数据管理 | 0% | ⏳ 待开始 |
| 公共组件库 | 10% | ⏳ 待开始 |
| 测试和优化 | 0% | ⏳ 待开始 |

---

## 🎯 下一步行动

### 立即执行 (今天)
1. ✅ 修复 TypeScript 配置问题
2. ⏳ 等待依赖安装完成
3. ⏳ 启动开发服务器测试
4. ⏳ 验证现有功能正常运行

### 本周计划 (10.10 - 10.16)
1. 开发航班搜索页面
2. 开发航班预订页面
3. 开发支付流程
4. 开发订单管理功能

### 下周计划 (10.17 - 10.23)
1. 完成用户端剩余功能
2. 开始管理端开发
3. 开发公共组件库

---

## 📝 备注

### 开发建议
1. 优先完成用户端核心流程（搜索-预订-支付-订单）
2. 每完成一个功能模块进行测试
3. 及时更新文档和注释
4. 保持代码风格一致

### 注意事项
1. 所有新组件都要添加 TypeScript 类型定义
2. 使用 Composition API 和 `<script setup>` 语法
3. 遵循 ESLint 和 Prettier 规范
4. 提交前运行 `npm run lint` 检查代码

---

**文档更新时间:** 2025-10-10 14:11  
**下次更新:** 完成航班搜索功能后
