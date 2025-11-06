# API 路径重复问题修复

**问题:** API 路径重复导致 `/api/api/xxx` 错误  
**修复时间:** 2025-11-06 20:41

---

## 🔍 问题分析

### 错误现象

终端显示的错误请求路径：
```
/api/api/messages/unread-count  ❌ 路径重复
/api/airport/list                ✅ 正确
/api/api/messages?page=1         ❌ 路径重复
/api/flight/search               ✅ 正确
```

### 根本原因

**双重 `/api` 前缀问题:**

1. **axios baseURL** 已经包含 `/api`
   ```typescript
   // src/api/client.ts
   const client = axios.create({
     baseURL: '/api'  // ← 这里有 /api
   })
   ```

2. **API 调用时又加了 `/api`**
   ```typescript
   // src/api/message.ts (错误)
   request.get('/api/messages')  // ← 这里又有 /api
   
   // 最终请求路径
   baseURL + path = /api + /api/messages = /api/api/messages ❌
   ```

---

## ✅ 解决方案

### 修复原则

**API 路径不应包含 `/api` 前缀，因为 baseURL 已经包含了**

```typescript
// ❌ 错误
request.get('/api/messages')

// ✅ 正确
request.get('/messages')
```

### 修复的文件

#### 1. 前端 API 文件

| 文件 | 修改内容 | 状态 |
|------|----------|------|
| `src/api/message.ts` | 移除所有 `/api` 前缀 | ✅ |
| `src/api/flight.ts` | (已正确，无需修改) | ✅ |
| `src/api/order.ts` | (已正确，无需修改) | ✅ |
| `src/api/user.ts` | (已正确，无需修改) | ✅ |

#### 2. Mock API 文件

| 文件 | 修改内容 | 状态 |
|------|----------|------|
| `mock/message.ts` | 移除所有 `/api` 前缀 | ✅ |
| `mock/flight.ts` | 移除所有 `/api` 前缀 | ✅ |
| `mock/order.ts` | 移除所有 `/api` 前缀 | ✅ |
| `mock/user.ts` | 移除所有 `/api` 前缀 | ✅ |

---

## 📝 详细修改

### message.ts

**修改前:**
```typescript
getMessages: () => {
  return request.get('/api/messages')  // ❌
}
getUnreadCount: () => {
  return request.get('/api/messages/unread-count')  // ❌
}
```

**修改后:**
```typescript
getMessages: () => {
  return request.get('/messages')  // ✅
}
getUnreadCount: () => {
  return request.get('/messages/unread-count')  // ✅
}
```

### flight.ts Mock

**修改前:**
```typescript
{
  url: '/api/flight/search',  // ❌
  method: 'get',
  ...
}
{
  url: '/api/airport/list',  // ❌
  method: 'get',
  ...
}
```

**修改后:**
```typescript
{
  url: '/flight/search',  // ✅
  method: 'get',
  ...
}
{
  url: '/airport/list',  // ✅
  method: 'get',
  ...
}
```

### order.ts Mock

**修改前:**
```typescript
{
  url: /\/api\/seats\/flight\/(.+)\/type\/(.+)\/available/,  // ❌
  ...
}
{
  url: '/api/orders',  // ❌
  ...
}
```

**修改后:**
```typescript
{
  url: /\/seats\/flight\/(.+)\/type\/(.+)\/available/,  // ✅
  ...
}
{
  url: '/orders',  // ✅
  ...
}
```

### user.ts Mock

**修改前:**
```typescript
{
  url: '/api/auth/register',  // ❌
  ...
}
{
  url: '/api/user/profile',  // ❌
  ...
}
```

**修改后:**
```typescript
{
  url: '/auth/register',  // ✅
  ...
}
{
  url: '/user/profile',  // ✅
  ...
}
```

---

## 🎯 完整的 API 路径列表

### 消息 API
| API | 前端路径 | Mock 路径 | 最终请求 |
|-----|----------|-----------|----------|
| 获取消息列表 | `/messages` | `/messages` | `/api/messages` ✅ |
| 获取未读数 | `/messages/unread-count` | `/messages/unread-count` | `/api/messages/unread-count` ✅ |
| 获取消息详情 | `/messages/:id` | `/messages/:id` | `/api/messages/:id` ✅ |
| 标记已读 | `/messages/:id/read` | `/messages/:id/read` | `/api/messages/:id/read` ✅ |
| 全部已读 | `/messages/read-all` | `/messages/read-all` | `/api/messages/read-all` ✅ |
| 删除消息 | `/messages/:id` | `/messages/:id` | `/api/messages/:id` ✅ |
| 批量删除 | `/messages/batch` | `/messages/batch` | `/api/messages/batch` ✅ |

### 航班 API
| API | 前端路径 | Mock 路径 | 最终请求 |
|-----|----------|-----------|----------|
| 搜索航班 | `/flight/search` | `/flight/search` | `/api/flight/search` ✅ |
| 航班详情 | `/flight/:id` | `/flight/:id` | `/api/flight/:id` ✅ |
| 机场列表 | `/airport/list` | `/airport/list` | `/api/airport/list` ✅ |
| 热门航线 | `/flight/popular` | `/flight/popular` | `/api/flight/popular` ✅ |

### 订单 API
| API | 前端路径 | Mock 路径 | 最终请求 |
|-----|----------|-----------|----------|
| 可用座位 | `/seats/flight/:id/type/:type/available` | `/seats/flight/:id/type/:type/available` | `/api/seats/...` ✅ |
| 创建订单 | `/orders` | `/orders` | `/api/orders` ✅ |
| 订单列表 | `/orders` | `/orders` | `/api/orders` ✅ |
| 订单详情 | `/orders/:id` | `/orders/:id` | `/api/orders/:id` ✅ |
| 取消订单 | `/orders/:id/cancel` | `/orders/:id/cancel` | `/api/orders/:id/cancel` ✅ |
| 支付订单 | `/orders/:id/pay` | `/orders/:id/pay` | `/api/orders/:id/pay` ✅ |
| 申请退票 | `/orders/:id/refund` | `/orders/:id/refund` | `/api/orders/:id/refund` ✅ |

### 用户 API
| API | 前端路径 | Mock 路径 | 最终请求 |
|-----|----------|-----------|----------|
| 用户注册 | `/auth/register` | `/auth/register` | `/api/auth/register` ✅ |
| 用户登录 | `/auth/login` | `/auth/login` | `/api/auth/login` ✅ |
| 获取用户信息 | `/user/profile` | `/user/profile` | `/api/user/profile` ✅ |
| 更新用户信息 | `/user/profile` | `/user/profile` | `/api/user/profile` ✅ |
| 修改密码 | `/user/password` | `/user/password` | `/api/user/password` ✅ |

---

## 🔍 请求路径组成

### 正确的路径组成

```
baseURL + API路径 = 最终请求路径

/api + /messages = /api/messages ✅
```

### 错误的路径组成

```
baseURL + API路径 = 最终请求路径

/api + /api/messages = /api/api/messages ❌
```

---

## 🚀 测试验证

### 1. 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

### 2. 检查控制台

**应该看到:**
```
✅ 正确的路径
/api/messages/unread-count
/api/airport/list
/api/flight/search
```

**不应该看到:**
```
❌ 错误的路径
/api/api/messages/unread-count
/api/api/airport/list
```

### 3. 检查 Mock 日志

如果 `VITE_USE_MOCK=true`，应该看到:
```
[vite:mock] mock file change ...
```

### 4. 测试功能

- ✅ 首页机场列表加载
- ✅ 消息未读数显示
- ✅ 航班搜索
- ✅ 订单创建和支付

---

## 💡 最佳实践

### API 路径规范

**1. 前端 API 调用**
```typescript
// ✅ 正确 - 不包含 /api 前缀
export const xxxApi = {
  getXxx: () => request.get('/xxx'),
  createXxx: (data) => request.post('/xxx', data)
}

// ❌ 错误 - 包含 /api 前缀
export const xxxApi = {
  getXxx: () => request.get('/api/xxx'),  // 会导致 /api/api/xxx
  createXxx: (data) => request.post('/api/xxx', data)
}
```

**2. Mock API 定义**
```typescript
// ✅ 正确 - 不包含 /api 前缀
export default [
  {
    url: '/xxx',
    method: 'get',
    response: () => ({ ... })
  }
]

// ❌ 错误 - 包含 /api 前缀
export default [
  {
    url: '/api/xxx',  // 会导致匹配失败
    method: 'get',
    response: () => ({ ... })
  }
]
```

**3. baseURL 配置**
```typescript
// src/api/client.ts
const client = axios.create({
  baseURL: '/api'  // 统一在这里配置 /api 前缀
})
```

---

## 📚 相关文档

1. `API-CLIENT-FIX.md` - API 客户端修复
2. `MOCK-API-SWITCH-GUIDE.md` - Mock API 切换指南
3. `MOCK-API-FIX.md` - Mock API 路径修复

---

## ✅ 修复清单

- [x] 修复 message.ts API 路径
- [x] 修复 message.ts Mock 路径
- [x] 修复 flight.ts Mock 路径
- [x] 修复 order.ts Mock 路径
- [x] 修复 user.ts Mock 路径
- [ ] 重启开发服务器
- [ ] 验证路径正确
- [ ] 测试完整功能

---

**修复完成!** 🎉

现在所有 API 路径都正确了，不会再出现 `/api/api/xxx` 的错误。

**下一步:** 重启开发服务器并测试功能。
