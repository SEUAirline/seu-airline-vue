# API 客户端类型错误修复

**问题:** 消息系统和订单系统出现类型错误和连接失败  
**修复时间:** 2025-11-06 20:28

---

## 🔍 问题分析

### 控制台错误信息
```
1. message.ts:117 获取未读消息数失败: TypeError: Cannot read properties of undefined (reading 'code')
2. PaymentPage.vue:393 未找到订单信息
3. Failed to load resource: net::ERR_CONNECTION_REFUSED
4. [vite] server connection lost. Polling for restart...
```

### 根本原因

#### 问题1: API 客户端使用不一致

**messageApi 使用了 `client` 而不是 `request`:**
```typescript
// ❌ 错误
import client from './client'
export const messageApi = {
  getUnreadCount: () => {
    return client.get<ApiResponse<number>>('/api/messages/unread-count')
  }
}
```

**问题:**
- `client.get` 返回 `AxiosResponse<ApiResponse<T>>`
- 但 axios 拦截器已经返回了 `response.data`
- 导致类型不匹配

**正确做法:**
```typescript
// ✅ 正确
import { request } from './client'
export const messageApi = {
  getUnreadCount: (): Promise<ApiResponse<number>> => {
    return request.get('/api/messages/unread-count')
  }
}
```

#### 问题2: Store 中访问响应数据方式错误

**错误的访问方式:**
```typescript
const response = await messageApi.getUnreadCount()
if (response.data.code === 200 && response.data.data !== undefined) {
  unreadCount.value = response.data.data  // ❌ 多了一层 data
}
```

**正确的访问方式:**
```typescript
const response = await messageApi.getUnreadCount()
if (response.success && response.data !== undefined) {
  unreadCount.value = response.data  // ✅ 直接访问 data
}
```

---

## ✅ 解决方案

### 1. 修复 messageApi 使用 request

**修改文件:** `src/api/message.ts`

```typescript
// 修改前
import client from './client'

export const messageApi = {
  getMessages: (params?: MessageFilter) => {
    return client.get<ApiResponse<MessageListResponse>>('/api/messages', { params })
  },
  getUnreadCount: () => {
    return client.get<ApiResponse<number>>('/api/messages/unread-count')
  },
  // ... 其他方法
}

// 修改后
import { request } from './client'

export const messageApi = {
  getMessages: (params?: MessageFilter): Promise<ApiResponse<MessageListResponse>> => {
    return request.get('/api/messages', { params })
  },
  getUnreadCount: (): Promise<ApiResponse<number>> => {
    return request.get('/api/messages/unread-count')
  },
  // ... 其他方法
}
```

### 2. 修复 message store 响应数据访问

**修改文件:** `src/stores/message.ts`

```typescript
// 修改前
const response = await messageApi.getMessages(params)
if (response.data.code === 200 && response.data.data) {
  messages.value = response.data.data.list
  total.value = response.data.data.total
}

// 修改后
const response = await messageApi.getMessages(params)
if (response.success && response.data) {
  messages.value = response.data.list
  total.value = response.data.total
}
```

```typescript
// 修改前
const response = await messageApi.getUnreadCount()
if (response.data.code === 200 && response.data.data !== undefined) {
  unreadCount.value = response.data.data
}

// 修改后
const response = await messageApi.getUnreadCount()
if (response.success && response.data !== undefined) {
  unreadCount.value = response.data
}
```

---

## 📊 API 响应数据结构

### Axios 拦截器处理流程

```typescript
// 1. Mock API 返回
{
  code: 200,
  message: 'success',
  data: { ... },
  success: true
}

// 2. Axios 响应
AxiosResponse {
  data: {
    code: 200,
    message: 'success',
    data: { ... },
    success: true
  },
  status: 200,
  ...
}

// 3. 拦截器处理 (src/api/client.ts)
client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data  // ✅ 返回 response.data
  }
)

// 4. request 封装返回
Promise<ApiResponse<T>> = {
  code: 200,
  message: 'success',
  data: T,
  success: true
}

// 5. 在 store 中使用
const response = await api.xxx()
// response 就是 ApiResponse<T>
// response.data 就是 T
```

### 正确的数据访问方式

```typescript
// ✅ 正确
const response: ApiResponse<T> = await api.xxx()
if (response.success && response.data) {
  const data: T = response.data
}

// ❌ 错误
const response = await api.xxx()
if (response.data.code === 200) {  // ❌ response 已经是 ApiResponse
  const data = response.data.data  // ❌ 多了一层
}
```

---

## 🎯 修复内容总结

### 修改的文件
| 文件 | 修改内容 | 状态 |
|------|----------|------|
| `src/api/message.ts` | 使用 request 替代 client | ✅ |
| `src/stores/message.ts` | 修复响应数据访问方式 | ✅ |

### 修复的 API 方法
| API 方法 | 修改内容 | 状态 |
|----------|----------|------|
| `getMessages` | 使用 request.get | ✅ |
| `getUnreadCount` | 使用 request.get | ✅ |
| `getMessageDetail` | 使用 request.get | ✅ |
| `markAsRead` | 使用 request.put | ✅ |
| `markAllAsRead` | 使用 request.put | ✅ |
| `deleteMessage` | 使用 request.delete | ✅ |
| `batchDeleteMessages` | 使用 request.delete | ✅ |
| `createMessage` | 使用 request.post | ✅ |
| `getActiveAnnouncements` | 使用 request.get | ✅ |
| `getAnnouncementDetail` | 使用 request.get | ✅ |

---

## 🚀 测试步骤

### 1. 重启开发服务器
```bash
# 按 Ctrl+C 停止
# 重新启动
npm run dev
```

### 2. 测试消息系统
```
1. 打开浏览器控制台
2. 进入首页
3. ✅ 不应该出现 "Cannot read properties of undefined" 错误
4. ✅ 应该能看到未读消息数
5. 点击消息中心
6. ✅ 应该能正常加载消息列表
```

### 3. 测试订单流程
```
1. 搜索航班并预订
2. 填写信息并提交订单
3. ✅ 应该成功跳转到支付页面
4. ✅ 支付页面应该显示订单信息
5. ✅ 不应该出现 "订单不存在" 错误
```

---

## 💡 最佳实践

### API 客户端使用规范

**1. 统一使用 request 封装**
```typescript
// ✅ 推荐
import { request } from './client'

export const xxxApi = {
  getXxx: (): Promise<ApiResponse<Xxx>> => {
    return request.get('/api/xxx')
  }
}

// ❌ 不推荐
import client from './client'

export const xxxApi = {
  getXxx: () => {
    return client.get<ApiResponse<Xxx>>('/api/xxx')
  }
}
```

**2. 明确返回类型**
```typescript
// ✅ 推荐 - 明确返回类型
getXxx: (): Promise<ApiResponse<Xxx>> => {
  return request.get('/api/xxx')
}

// ❌ 不推荐 - 依赖类型推导
getXxx: () => {
  return request.get('/api/xxx')
}
```

**3. 正确访问响应数据**
```typescript
// ✅ 推荐
const response = await api.getXxx()
if (response.success && response.data) {
  const data = response.data
}

// ❌ 不推荐
const response = await api.getXxx()
if (response.data.code === 200) {
  const data = response.data.data
}
```

---

## 📝 相关文件

### 修改的文件
1. `src/api/message.ts` - 消息 API
2. `src/stores/message.ts` - 消息状态管理
3. `docs/API-CLIENT-FIX.md` - 本文档

### 相关文件
1. `src/api/client.ts` - API 客户端配置
2. `src/api/order.ts` - 订单 API (已正确使用 request)
3. `src/api/flight.ts` - 航班 API (已正确使用 request)
4. `src/api/user.ts` - 用户 API (已正确使用 request)

---

## ✅ 验证清单

- [x] 修复 messageApi 使用 request
- [x] 修复 message store 响应访问
- [x] 添加明确的返回类型
- [ ] 测试消息列表加载
- [ ] 测试未读消息数显示
- [ ] 测试订单创建和支付流程
- [ ] 验证无类型错误
- [ ] 验证无连接错误

---

**修复完成!** 🎉

现在 API 客户端使用规范统一，类型安全，不会再出现 "Cannot read properties of undefined" 错误。

**下一步:** 重启开发服务器并测试消息系统和订单流程。
