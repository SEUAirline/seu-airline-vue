# SEUAirline 测试指南

**更新时间:** 2025-10-29  
**适用版本:** v1.0+

---

## 📋 测试环境说明

### API 架构

本项目采用**前后端分离架构**，支持两种API模式：

#### 1. Mock API（开发/演示模式）
- **前缀:** `/mock/api/*`
- **用途:** 前端独立开发、功能演示
- **数据:** 内存中的模拟数据（刷新丢失）
- **配置:** `vite-plugin-mock` 拦截请求

#### 2. 真实后端API（集成/生产模式）
- **前缀:** `/api/*`
- **用途:** 完整的前后端集成
- **数据:** MySQL数据库持久化
- **配置:** Vite代理转发到 `http://localhost:8080`

### 测试数据来源

| 模式         | 数据来源                           | 初始数据                 |
| ------------ | ---------------------------------- | ------------------------ |
| **Mock API** | `mock/*.ts` 文件中的 `mockjs` 生成 | 随机生成（每次启动不同） |
| **真实API**  | MySQL数据库                        | `init-db.sql` 脚本初始化 |

---

## 🚀 启动前准备

### 使用Mock API测试

```powershell
# 1. 进入前端目录
cd seu-airline-vue

# 2. 启动开发服务器（Mock自动启用）
npm run dev
```

**访问:** `http://localhost:5173`

### 使用真实后端API测试

```powershell
# 1. 启动MySQL服务
# 确保MySQL已启动

# 2. 启动Redis服务
redis-server

# 3. 启动后端（在后端目录）
cd seu-airline-backend
mvn spring-boot:run

# 4. 启动前端（在前端目录）
cd seu-airline-vue
npm run dev
```

**访问:** `http://localhost:5173`

---

## 🧪 测试账户

### Mock API测试账户

```typescript
// mock/user.ts 中定义
用户名: user001
密码: 123456
```

### 真实后端测试账户

```sql
-- init-db.sql 中初始化

管理员账户:
用户名: admin
密码: admin123

普通用户:
用户名: user001
密码: 123456

普通用户2:
用户名: passenger1
密码: passenger123
```

---

## 📊 测试数据对照

### 航班数据

#### Mock API
- **数量:** 每次搜索随机生成 15-30 个航班
- **特点:** 
  - 数据随机，每次不同
  - 支持的城市：北京、上海、广州、深圳、成都、杭州、西安、重庆、厦门、南京
  - 7个航空公司
  - 价格范围：400-2000元

#### 真实后端API
- **数量:** 根据 `init-db.sql` 初始化的航班
- **特点:**
  - 数据固定，来自数据库
  - 示例航班：CA1001 (北京→上海)、MU2002 (上海→广州) 等
  - 需要先在数据库中插入数据才能查询

### 机场数据

#### Mock API
```javascript
10个城市机场（硬编码）:
北京 - PEK - 首都国际机场
上海 - PVG - 浦东国际机场
// ...等
```

#### 真实后端API
```sql
-- 来自 init-db.sql 的 airports 表
PEK - 首都国际机场 - 北京
SHA - 虹桥国际机场 - 上海
PVG - 浦东国际机场 - 上海
// ...等
```

---

## ✅ 功能测试清单

### 1. 航班搜索功能

#### 测试步骤
1. 访问首页 `http://localhost:5173`
2. 填写搜索表单：
   - **出发地:** 北京
   - **目的地:** 上海
   - **出发日期:** 选择未来日期
3. 点击"搜索航班"

#### 预期结果（Mock API）
- ✅ 显示 15-30 个随机航班
- ✅ 航班信息完整（航班号、时间、价格等）
- ✅ 网络请求: `GET /mock/api/flight/search?departureCity=北京&...`

#### 预期结果（真实API）
- ✅ 显示数据库中的真实航班
- ✅ 如果数据库为空，显示"未找到航班"
- ✅ 网络请求: `GET /api/flight/search?departureCity=北京&...`

### 2. 航班筛选功能

#### 测试场景
- 价格筛选：拖动滑块调整范围
- 时间筛选：勾选时间段（早晨/上午/下午/晚上）
- 航空公司筛选：勾选航空公司

#### 预期结果
- ✅ 航班列表实时更新
- ✅ 只显示符合条件的航班
- ✅ 重置按钮恢复默认

### 3. 航班排序功能

#### 测试场景
- 价格从低到高/从高到低
- 起飞时间早到晚/晚到早
- 飞行时长短到长

#### 预期结果
- ✅ 航班按选定方式排序
- ✅ 排序后页码重置到第1页

### 4. 用户登录功能

#### 测试步骤（Mock API）
1. 访问 `/login`
2. 输入测试账号：`user001` / `123456`
3. 点击登录

#### 预期结果
- ✅ 登录成功，跳转首页
- ✅ localStorage存储token
- ✅ 顶部显示用户名

#### 测试步骤（真实API）
1. 确保后端已启动
2. 访问 `/login`
3. 输入：`admin` / `admin123`
4. 点击登录

#### 预期结果
- ✅ 后端验证通过
- ✅ 返回JWT token
- ✅ 登录成功跳转

---

## 🔍 调试技巧

### 检查当前使用的API模式

打开浏览器控制台，查看Network标签：

```
Mock API模式:
- 请求URL包含 /mock/api/*
- 响应非常快（本地拦截）
- 数据每次可能不同

真实API模式:
- 请求URL为 /api/*
- Vite代理到 localhost:8080
- 数据来自数据库（稳定）
```

### 查看网络请求

```javascript
// 在控制台执行，测试航班搜索

// Mock API
fetch('/mock/api/flight/search?departureCity=北京&arrivalCity=上海&departureDate=2025-11-01')
  .then(res => res.json())
  .then(data => console.log('Mock数据:', data))

// 真实API
fetch('/api/flight/search?departureCity=北京&arrivalCity=上海&departureDate=2025-11-01')
  .then(res => res.json())
  .then(data => console.log('真实数据:', data))
```

### 常见问题排查

#### Q1: Mock API返回数据，但真实API返回404
**原因:** 后端未启动或数据库无数据

**解决:**
```powershell
# 检查后端是否启动
# 访问: http://localhost:8080/api/flight/search?...

# 检查数据库
mysql -u root -p
USE seu_airline;
SELECT COUNT(*) FROM flights;
```

#### Q2: 前端调用/api/*被拦截到Mock
**原因:** 前端代码可能写错了路径

**解决:**
- 检查 `src/api/*.ts` 中的URL
- 确保真实API路径为 `/airport/list` 而不是 `/mock/api/airport/list`
- `baseURL` 已经是 `/api`，不要重复添加

#### Q3: 数据库为空，无法测试
**解决:**
```sql
-- 执行初始化脚本
mysql -u root -p seu_airline < src/main/resources/init-db.sql

-- 或在MySQL中执行
SOURCE /path/to/init-db.sql;
```

---

## 📝 测试报告模板

### 功能测试报告

```markdown
## 测试报告

**测试人员:** [姓名]
**测试时间:** 2025-10-29
**测试模式:** [ ] Mock API  [ ] 真实API
**浏览器:** Chrome / Firefox / Edge

### 测试环境
- 前端: http://localhost:5173 - [√] 正常
- 后端: http://localhost:8080 - [√] 正常（真实API模式）
- 数据库: MySQL - [√] 正常（真实API模式）
- Redis: - [√] 正常（真实API模式）

### 测试结果
| 功能     | Mock API          | 真实API           | 备注 |
| -------- | ----------------- | ----------------- | ---- |
| 航班搜索 | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail |      |
| 航班筛选 | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail |      |
| 航班排序 | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail |      |
| 用户登录 | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail |      |
| 用户注册 | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail |      |

### 发现的问题
1. [问题描述]
2. [问题描述]

### 截图
[粘贴截图]
```

---

## 🎯 下一步

### 如果使用Mock API开发
1. ✅ 继续开发前端功能
2. ✅ 不依赖后端进度
3. ⚠️ 注意：Mock数据不持久化

### 如果切换到真实API
1. ✅ 测试完整的前后端交互
2. ✅ 验证数据持久化
3. ✅ 测试真实业务流程
4. ⚠️ 需要后端和数据库同时启动

---

**更新日志:**
- 2025-10-29: 创建统一测试指南，明确Mock和真实API的区别
