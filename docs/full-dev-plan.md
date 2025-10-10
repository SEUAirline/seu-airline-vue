# SEUAirline 航班预订系统 - 前后端开发总计划

**项目技术栈:** Vue3 + TypeScript (前端) + Spring Boot (后端)  
**文档创建时间:** 2025-10-10  
**文档版本:** v1.0

---

## 📋 目录

1. [项目概述](#1-项目概述)
2. [需求分析总结](#2-需求分析总结)
3. [系统架构设计](#3-系统架构设计)
4. [前端开发计划](#4-前端开发计划)
5. [后端开发计划](#5-后端开发计划)
6. [数据库设计](#6-数据库设计)
7. [接口设计规范](#7-接口设计规范)
8. [开发时间线](#8-开发时间线)
9. [技术难点与解决方案](#9-技术难点与解决方案)
10. [测试与部署](#10-测试与部署)

---

## 1. 项目概述

### 1.1 项目背景
Southeast Airline 航班预订系统是一个面向用户和管理员的在线机票预订平台，提供航班查询、机票预订、订单管理、用户管理等核心功能。

### 1.2 核心目标
- **用户端:** 提供便捷、安全的机票预订体验
- **管理端:** 提供高效的航班和订单管理工具
- **系统性能:** 支持高并发访问，响应时间 < 500ms
- **用户体验:** 现代化UI设计，移动端友好

### 1.3 技术选型

#### 前端: Vue3 + TypeScript
- **Vue3 Composition API:** 更好的代码组织和类型推导
- **TypeScript:** 类型安全，减少运行时错误
- **Vite:** 快速的开发体验和构建速度
- **Tailwind CSS:** 快速构建现代化UI
- **Pinia:** 轻量级状态管理

#### 后端: Spring Boot
- **成熟稳定:** 企业级Java框架，生态完善
- **快速开发:** 约定优于配置，开箱即用
- **微服务友好:** 便于后期扩展
- **安全性:** Spring Security 提供完善的安全方案

---

## 2. 需求分析总结

### 2.1 核心功能模块

#### 用户端功能
1. **用户认证:** 注册、登录、密码管理
2. **航班搜索:** 单程/往返搜索、筛选、排序
3. **机票预订:** 乘客信息填写、附加服务选择
4. **支付功能:** 多种支付方式、支付流程
5. **订单管理:** 订单查询、取消、退改签
6. **个人中心:** 个人信息、常用乘客、会员中心

#### 管理端功能
1. **系统概览:** 数据统计、图表展示
2. **航班管理:** 航班CRUD、航班调度
3. **订单管理:** 订单查询、退改签审核
4. **用户管理:** 用户信息、状态管理
5. **系统管理:** 管理员管理、系统配置

### 2.2 非功能性需求
- **性能:** 页面加载 < 2s，接口响应 < 500ms
- **安全:** HTTPS、JWT认证、数据加密
- **可用性:** 99.9% 可用性
- **兼容性:** 主流浏览器、移动端适配

---

## 3. 系统架构设计

### 3.1 整体架构

```
用户层 (PC Web / Mobile Web)
        ↓ HTTPS
前端层 (Vue3 + TypeScript)
        ↓ REST API
网关层 (Nginx / Spring Cloud Gateway) [可选]
        ↓
后端层 (Spring Boot)
        ↓
数据层 (MySQL + Redis + OSS)
```

### 3.2 前端架构

```
seu-airline-vue/
├── src/
│   ├── api/           # API 接口层
│   ├── assets/        # 静态资源
│   ├── components/    # 公共组件
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   ├── types/         # TypeScript 类型
│   ├── utils/         # 工具函数
│   ├── views/         # 页面组件
│   ├── App.vue
│   └── main.ts
```

### 3.3 后端架构

```
seu-airline-backend/
├── src/main/java/com/seu/airline/
│   ├── controller/    # 控制器层
│   ├── service/       # 服务层
│   ├── repository/    # 数据访问层
│   ├── entity/        # 实体类
│   ├── dto/           # 数据传输对象
│   ├── security/      # 安全相关
│   ├── exception/     # 异常处理
│   ├── util/          # 工具类
│   └── common/        # 公共类
```

---

## 4. 前端开发计划

### 4.1 第一阶段: 基础设施 (已完成 ✅)

- [x] 项目初始化 (Vite + Vue3 + TypeScript)
- [x] 配置 Tailwind CSS
- [x] 配置 Vue Router (22个路由)
- [x] 配置 Pinia (5个 Store)
- [x] TypeScript 类型系统
- [x] API 层实现
- [x] 基础页面 (首页、登录、注册)

### 4.2 第二阶段: 用户端核心功能 (5-7天)

#### Day 1-2: 航班搜索与预订
**任务清单:**
- [ ] 航班搜索页面 `FlightSearchPage.vue`
  - 航班列表展示
  - 筛选组件 `FlightFilter.vue`
  - 排序功能
  - 分页组件 `Pagination.vue`
- [ ] 航班预订页面 `FlightBookPage.vue`
  - 航班详情展示
  - 乘客信息表单 `PassengerForm.vue`
  - 联系人表单 `ContactForm.vue`

**关键组件:**
- `FlightCard.vue` - 航班卡片
- `PassengerForm.vue` - 乘客信息表单
- `FlightFilter.vue` - 筛选器

#### Day 3: 支付流程
**任务清单:**
- [ ] 支付页面 `PaymentPage.vue`
  - 订单确认
  - 支付方式选择 `PaymentMethod.vue`
  - 支付倒计时
  - 支付状态轮询
- [ ] 支付成功页 `OrderSuccessPage.vue`

**关键功能:**
- 倒计时逻辑
- 支付状态轮询
- 订单状态更新

#### Day 4-5: 订单管理
**任务清单:**
- [ ] 订单列表页 `OrderListPage.vue`
  - 订单卡片 `OrderCard.vue`
  - 订单筛选
  - 订单搜索
- [ ] 订单详情页 `OrderDetailPage.vue`
  - 订单信息展示
  - 订单操作（取消、退票、改签）

#### Day 6-7: 个人中心
**任务清单:**
- [ ] 个人中心页 `UserCenterPage.vue`
  - 个人信息编辑
  - 头像上传
  - 常用乘客管理
  - 会员中心
  - 安全设置

### 4.3 第三阶段: 管理端功能 (5-7天)

#### Day 1-2: 管理端布局与Dashboard
**任务清单:**
- [ ] 管理端布局 `AdminLayout.vue`
  - 侧边栏菜单 `AdminSidebar.vue`
  - 顶部导航 `AdminHeader.vue`
- [ ] Dashboard页面 `DashboardPage.vue`
  - 统计卡片 `StatCard.vue`
  - 图表组件 `ChartCard.vue` (使用 Chart.js)
  - 待处理事项

#### Day 3-4: 数据管理
**任务清单:**
- [ ] 航班管理页 `FlightManagePage.vue`
  - 数据表格 `DataTable.vue`
  - 航班表单 `FlightForm.vue`
  - 批量操作
- [ ] 订单管理页 `OrderManagePage.vue`
  - 订单列表
  - 订单详情
  - 退改签审核

#### Day 5-7: 其他管理功能
**任务清单:**
- [ ] 用户管理页 `UserManagePage.vue`
- [ ] 机场管理页 `AirportManagePage.vue`
- [ ] 管理员账户页 `AdminAccountPage.vue`
- [ ] 系统设置页 `SystemSettingsPage.vue`

### 4.4 第四阶段: 公共组件库 (2-3天)

#### 布局组件
- [ ] `UserLayout.vue` - 用户端布局
- [ ] `AppHeader.vue` - 顶部导航
- [ ] `AppFooter.vue` - 页脚

#### 表单组件
- [ ] `FormInput.vue` - 输入框
- [ ] `FormSelect.vue` - 下拉选择
- [ ] `FormDatePicker.vue` - 日期选择器

#### 反馈组件
- [ ] `Toast.vue` - 消息提示
- [ ] `Modal.vue` - 模态框
- [ ] `Loading.vue` - 加载状态
- [ ] `Empty.vue` - 空状态

#### 数据展示组件
- [ ] `DataTable.vue` - 数据表格
- [ ] `Pagination.vue` - 分页
- [ ] `Badge.vue` - 徽章
- [ ] `Tag.vue` - 标签

### 4.5 第五阶段: 优化与完善 (2-3天)

- [ ] 性能优化（路由懒加载、代码分割）
- [ ] 用户体验优化（加载状态、错误处理）
- [ ] 响应式布局优化
- [ ] 代码重构和注释
- [ ] 文档完善

---

## 5. 后端开发计划

### 5.1 第一阶段: 项目搭建 (1-2天)

#### Day 1: 项目初始化
**任务清单:**
- [ ] 创建 Spring Boot 项目
  - Maven/Gradle 配置
  - 项目结构搭建
  - 依赖管理
- [ ] 配置文件设置
  - `application.yml` 主配置
  - `application-dev.yml` 开发环境
  - `application-prod.yml` 生产环境
- [ ] 数据库连接配置
  - MySQL 连接
  - MyBatis/JPA 配置
  - 连接池配置

#### Day 2: 基础架构
**任务清单:**
- [ ] 统一响应格式 `Result.java`
- [ ] 全局异常处理 `GlobalExceptionHandler.java`
- [ ] 跨域配置 `CorsConfig.java`
- [ ] Swagger API 文档配置
- [ ] 日志配置 (Logback)

### 5.2 第二阶段: 安全与认证 (2-3天)

#### JWT 认证系统
**任务清单:**
- [ ] JWT 工具类 `JwtTokenProvider.java`
  - Token 生成
  - Token 解析
  - Token 验证
- [ ] JWT 过滤器 `JwtAuthFilter.java`
- [ ] Security 配置 `SecurityConfig.java`
  - 认证规则
  - 权限控制
  - 密码加密
- [ ] UserDetailsService 实现

#### 用户认证接口
**任务清单:**
- [ ] 用户注册接口
- [ ] 用户登录接口
- [ ] Token 刷新接口
- [ ] 密码重置接口

### 5.3 第三阶段: 核心业务模块 (7-10天)

#### Day 1-2: 用户模块
**Entity:**
```java
User (用户表)
- id, username, password, email, phone
- realName, idCard, avatar
- memberLevel, points, status
- createTime, updateTime
```

**接口清单:**
- [ ] 获取用户信息 `GET /api/user/profile`
- [ ] 更新用户信息 `PUT /api/user/profile`
- [ ] 修改密码 `PUT /api/user/password`
- [ ] 上传头像 `POST /api/user/avatar`
- [ ] 常用乘客管理 CRUD

#### Day 3-4: 航班模块
**Entity:**
```java
Flight (航班表)
- id, flightNo, airline
- departureAirport, arrivalAirport
- departureTime, arrivalTime
- price, economySeats, businessSeats
- status, createTime, updateTime

Airport (机场表)
- id, code, name, city, country
```

**接口清单:**
- [ ] 航班搜索 `GET /api/flight/search`
- [ ] 航班详情 `GET /api/flight/{id}`
- [ ] 热门航线 `GET /api/flight/popular`
- [ ] 航班管理 CRUD (管理端)

#### Day 5-7: 订单模块
**Entity:**
```java
Order (订单表)
- id, orderNo, userId, flightId
- totalPrice, status, paymentMethod
- contactName, contactPhone
- createTime, payTime, cancelTime

OrderPassenger (订单乘客表)
- id, orderId, name, idCard
- passengerType, seatNo
```

**接口清单:**
- [ ] 创建订单 `POST /api/order`
- [ ] 订单列表 `GET /api/order/list`
- [ ] 订单详情 `GET /api/order/{id}`
- [ ] 取消订单 `PUT /api/order/{id}/cancel`
- [ ] 订单支付 `POST /api/order/{id}/pay`
- [ ] 退票申请 `POST /api/order/{id}/refund`
- [ ] 改签申请 `POST /api/order/{id}/change`

#### Day 8-10: 支付与管理模块
**支付模块:**
- [ ] 支付接口集成（支付宝/微信）
- [ ] 支付回调处理
- [ ] 支付状态查询

**管理模块:**
- [ ] Dashboard 统计接口
- [ ] 订单管理接口
- [ ] 用户管理接口
- [ ] 系统配置接口

### 5.4 第四阶段: Redis 缓存 (1-2天)

**缓存策略:**
- [ ] Redis 配置 `RedisConfig.java`
- [ ] Redis 工具类 `RedisUtil.java`
- [ ] 航班信息缓存
- [ ] 用户信息缓存
- [ ] 热点数据缓存
- [ ] 缓存更新策略

### 5.5 第五阶段: 测试与优化 (2-3天)

- [ ] 单元测试
- [ ] 接口测试
- [ ] 性能测试
- [ ] 代码优化
- [ ] 文档完善

---

## 6. 数据库设计

### 6.1 核心表结构

#### 用户表 (user)
```sql
CREATE TABLE `user` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100),
  `phone` VARCHAR(20),
  `real_name` VARCHAR(50),
  `id_card` VARCHAR(18),
  `avatar` VARCHAR(255),
  `member_level` TINYINT DEFAULT 1,
  `points` INT DEFAULT 0,
  `status` TINYINT DEFAULT 1 COMMENT '1:正常 0:冻结',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 航班表 (flight)
```sql
CREATE TABLE `flight` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `flight_no` VARCHAR(20) NOT NULL,
  `airline` VARCHAR(50) NOT NULL,
  `departure_airport` VARCHAR(10) NOT NULL,
  `arrival_airport` VARCHAR(10) NOT NULL,
  `departure_time` DATETIME NOT NULL,
  `arrival_time` DATETIME NOT NULL,
  `economy_price` DECIMAL(10,2),
  `business_price` DECIMAL(10,2),
  `first_price` DECIMAL(10,2),
  `economy_seats` INT DEFAULT 0,
  `business_seats` INT DEFAULT 0,
  `first_seats` INT DEFAULT 0,
  `aircraft_type` VARCHAR(50),
  `status` TINYINT DEFAULT 1 COMMENT '1:正常 2:延误 3:取消',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_flight_no (flight_no),
  INDEX idx_departure (departure_airport, departure_time),
  INDEX idx_route (departure_airport, arrival_airport)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 订单表 (order)
```sql
CREATE TABLE `order` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_no` VARCHAR(32) UNIQUE NOT NULL,
  `user_id` BIGINT NOT NULL,
  `flight_id` BIGINT NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `status` TINYINT DEFAULT 1 COMMENT '1:待支付 2:已支付 3:已取消 4:已退款',
  `payment_method` VARCHAR(20),
  `contact_name` VARCHAR(50),
  `contact_phone` VARCHAR(20),
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `pay_time` DATETIME,
  `cancel_time` DATETIME,
  INDEX idx_order_no (order_no),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (flight_id) REFERENCES flight(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 订单乘客表 (order_passenger)
```sql
CREATE TABLE `order_passenger` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `id_card` VARCHAR(18) NOT NULL,
  `passenger_type` TINYINT DEFAULT 1 COMMENT '1:成人 2:儿童 3:婴儿',
  `seat_no` VARCHAR(10),
  FOREIGN KEY (order_id) REFERENCES `order`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 机场表 (airport)
```sql
CREATE TABLE `airport` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `code` VARCHAR(10) UNIQUE NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `country` VARCHAR(50) DEFAULT '中国',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 管理员表 (admin)
```sql
CREATE TABLE `admin` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `real_name` VARCHAR(50),
  `role` VARCHAR(20) DEFAULT 'ADMIN',
  `status` TINYINT DEFAULT 1,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 7. 接口设计规范

### 7.1 RESTful API 规范

#### 请求格式
```
GET    /api/resource       # 获取列表
GET    /api/resource/{id}  # 获取详情
POST   /api/resource       # 创建资源
PUT    /api/resource/{id}  # 更新资源
DELETE /api/resource/{id}  # 删除资源
```

#### 统一响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1696934400000
}
```

#### 分页响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

#### 错误响应格式
```json
{
  "code": 400,
  "message": "参数错误",
  "data": null,
  "timestamp": 1696934400000
}
```

### 7.2 核心接口列表

#### 用户认证接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /api/auth/register | POST | 用户注册 |
| /api/auth/login | POST | 用户登录 |
| /api/auth/logout | POST | 用户登出 |
| /api/auth/refresh | POST | 刷新Token |

#### 航班接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /api/flight/search | GET | 搜索航班 |
| /api/flight/{id} | GET | 航班详情 |
| /api/flight/popular | GET | 热门航线 |

#### 订单接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /api/order | POST | 创建订单 |
| /api/order/list | GET | 订单列表 |
| /api/order/{id} | GET | 订单详情 |
| /api/order/{id}/cancel | PUT | 取消订单 |
| /api/order/{id}/pay | POST | 支付订单 |

---

## 8. 开发时间线

### 总体时间规划 (约 4-5 周)

#### 第 1 周: 基础搭建
- **Day 1-2:** 前端项目初始化 (已完成 ✅)
- **Day 3-4:** 后端项目搭建、数据库设计
- **Day 5-7:** 安全认证系统、基础接口

#### 第 2 周: 用户端核心功能
- **Day 1-2:** 航班搜索与预订
- **Day 3:** 支付流程
- **Day 4-5:** 订单管理
- **Day 6-7:** 个人中心

#### 第 3 周: 管理端功能
- **Day 1-2:** 管理端布局与Dashboard
- **Day 3-4:** 航班管理、订单管理
- **Day 5-7:** 用户管理、系统管理

#### 第 4 周: 优化与测试
- **Day 1-2:** 公共组件开发
- **Day 3-4:** 性能优化、代码重构
- **Day 5-7:** 测试、Bug修复

#### 第 5 周: 部署上线
- **Day 1-2:** 部署准备、环境配置
- **Day 3-4:** 部署测试
- **Day 5-7:** 上线、监控、文档

---

## 9. 技术难点与解决方案

### 9.1 前端技术难点

#### 1. 航班搜索性能优化
**问题:** 大量航班数据渲染导致页面卡顿

**解决方案:**
- 使用虚拟滚动技术
- 实现分页加载
- 筛选和排序使用 Web Worker
- 航班数据缓存

#### 2. 表单验证复杂度
**问题:** 多乘客表单验证逻辑复杂

**解决方案:**
- 使用 VeeValidate + Yup 统一验证
- 封装可复用的验证规则
- 实现表单数据持久化

#### 3. 支付状态轮询
**问题:** 支付状态实时更新

**解决方案:**
- 使用轮询机制（每2秒查询一次）
- 设置最大轮询次数
- 支付超时自动取消订单

### 9.2 后端技术难点

#### 1. 并发订单处理
**问题:** 高并发下的座位超卖问题

**解决方案:**
- 使用 Redis 分布式锁
- 数据库乐观锁（version 字段）
- 订单状态机设计

#### 2. 支付安全性
**问题:** 支付接口安全性

**解决方案:**
- 使用 HTTPS 加密传输
- 支付签名验证
- 支付回调幂等性处理
- 订单金额二次校验

#### 3. 数据库性能优化
**问题:** 大量订单查询性能问题

**解决方案:**
- 合理设计索引
- 使用 Redis 缓存热点数据
- 订单表分表策略
- 慢查询优化

---

## 10. 测试与部署

### 10.1 测试计划

#### 前端测试
- **单元测试:** 工具函数、组件测试
- **集成测试:** 页面流程测试
- **E2E测试:** 用户完整流程测试
- **浏览器兼容性测试**
- **移动端适配测试**

#### 后端测试
- **单元测试:** Service 层测试
- **接口测试:** Postman/JMeter
- **性能测试:** 压力测试、并发测试
- **安全测试:** SQL注入、XSS测试

### 10.2 部署方案

#### 前端部署
```bash
# 构建生产版本
npm run build

# 部署到 Nginx
nginx 配置:
- 静态资源托管
- Gzip 压缩
- 缓存策略
- 反向代理
```

#### 后端部署
```bash
# 打包 JAR
mvn clean package

# Docker 部署
docker build -t seu-airline-backend .
docker run -d -p 8080:8080 seu-airline-backend

# 或使用 Docker Compose
docker-compose up -d
```

#### 数据库部署
- MySQL 主从配置
- Redis 集群配置
- 定时备份策略

---

## 📝 附录

### A. 开发规范

#### 前端代码规范
- 使用 ESLint + Prettier
- 组件命名: PascalCase
- 文件命名: kebab-case
- 使用 Composition API
- TypeScript 严格模式

#### 后端代码规范
- 遵循阿里巴巴 Java 开发手册
- 使用 Lombok 简化代码
- 统一异常处理
- 接口文档使用 Swagger

### B. Git 工作流

```
main (生产分支)
  ↑
develop (开发分支)
  ↑
feature/* (功能分支)
```

### C. 参考文档

- [Vue3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)
- [MySQL 官方文档](https://dev.mysql.com/doc/)

---

**文档维护:** 请在每个开发阶段完成后更新此文档  
**最后更新:** 2025-10-10
