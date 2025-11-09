# Bug修复: Mock API路径不匹配问题

**Bug编号:** #004  
**修复日期:** 2025-11-10  
**严重程度:** 🔴 高 (核心功能完全无法使用)  
**状态:** ✅ 已修复

---

## 🐛 问题描述

### 用户反馈
完成订票和支付流程后,订单页面仍然显示"暂无订单",控制台显示API返回的是HTML页面而不是JSON数据。

### 控制台日志
```
📦 API响应: <!DOCTYPE html>...
✅ 响应成功? undefined
📊 响应数据: undefined
📋 数据类型: undefined 不是数组
⚠️ 响应失败或无数据
🏁 加载完成, 当前订单数: 0
```

---

## 🔍 问题分析

### 根本原因

**Mock API路径配置不匹配**

1. **前端调用路径:** `/api/orders`
   ```typescript
   // src/api/order.ts
   getUserOrders(): Promise<ApiResponse<Order[]>> {
     return request.get('/orders')  // baseURL是/api,实际请求/api/orders
   }
   ```

2. **Mock配置路径:** `/api/user/orders`
   ```typescript
   // mock-data.ts (修复前)
   if (pathname === '/api/user/orders') {
     // 处理订单列表请求
   }
   ```

3. **结果:** 
   - `/api/orders` 请求没有被Mock拦截
   - Vite开发服务器将其当作页面路由处理
   - 返回HTML页面而不是JSON数据

### 问题链条

```
前端调用 orderApi.getUserOrders()
  ↓
request.get('/orders')
  ↓
axios baseURL: /api
  ↓
实际请求: GET /api/orders
  ↓
Mock中间件检查: pathname === '/api/user/orders' ❌ 不匹配
  ↓
请求未被拦截,继续传递
  ↓
Vite开发服务器处理
  ↓
返回 index.html (SPA路由)
  ↓
前端接收到HTML字符串
  ↓
response.data = undefined
  ↓
订单列表为空
```

---

## 🔧 修复方案

### 1. 修复Mock路径匹配

**文件:** `mock-data.ts`

#### 修复前 ❌
```typescript
// 只处理 /api/user/orders
if (pathname === '/api/user/orders') {
  // ...
  res.end(JSON.stringify({
    data: {
      list: filteredOrders,  // 嵌套结构
      total: ...,
      page: ...,
      pageSize: ...
    }
  }))
}
```

#### 修复后 ✅
```typescript
// 同时处理 /api/orders 和 /api/user/orders
if (pathname === '/api/user/orders' || pathname === '/api/orders') {
  // 转换为前端期望的格式
  const formattedOrders = filteredOrders.map(order => ({
    id: order.id,
    orderNo: order.orderNo,
    flightNo: order.flightNo || 'CA1234',
    departureCity: order.departureCity || '南京',
    arrivalCity: order.arrivalCity || '上海',
    departureTime: order.departureTime || '2025-11-10 08:00',
    arrivalTime: order.arrivalTime || '2025-11-10 10:30',
    date: order.date || '2025-11-10',
    status: order.status === 1 ? 'pending' : 
            order.status === 2 ? 'paid' : 
            order.status === 3 ? 'completed' : 'cancelled',
    totalPrice: order.totalPrice,
    passengers: order.passengers || [],
    createTime: order.createTime,
    payTime: order.payTime
  }))
  
  console.log('📋 返回订单列表, 数量:', formattedOrders.length)
  
  res.end(JSON.stringify({
    data: formattedOrders  // 直接返回数组
  }))
}
```

### 2. 修复订单创建时的状态值

**问题:** 创建订单时 `status: 0`,但筛选逻辑期望 `1, 2, 3, 4`

#### 修复前 ❌
```typescript
const order = {
  // ...
  status: 0,  // ❌ 不符合规范
  departureCity: '北京',
  arrivalCity: '上海',
  departureTime: '2025-11-07 10:00',
  // ❌ 缺少 date 字段
}
```

#### 修复后 ✅
```typescript
const order = {
  // ...
  status: 1,  // ✅ 1: 待支付
  departureCity: '南京',
  arrivalCity: '上海',
  departureTime: '2025-11-10 08:00',
  arrivalTime: '2025-11-10 10:30',
  date: '2025-11-10',  // ✅ 添加日期字段
}

console.log('✅ 订单已创建:', order)
```

### 3. 添加调试日志

在Mock中添加日志,便于追踪问题:
```typescript
console.log('📋 返回订单列表, 数量:', formattedOrders.length)
console.log('✅ 订单已创建:', order)
```

---

## 📊 修复效果对比

### 修复前 ❌

```
请求: GET /api/orders
  ↓
Mock未拦截
  ↓
返回: <!DOCTYPE html>...
  ↓
response.data = undefined
  ↓
订单数: 0
```

### 修复后 ✅

```
请求: GET /api/orders
  ↓
Mock成功拦截
  ↓
返回: { success: true, data: [...] }
  ↓
response.data = [订单数组]
  ↓
订单数: X (实际订单数量)
```

---

## 🎯 验证步骤

### 1. 刷新页面
强制刷新浏览器 (Ctrl+F5)

### 2. 完成订票流程
1. 搜索航班
2. 选择航班
3. 填写乘客信息
4. 提交订单
5. 完成支付

### 3. 查看订单列表
访问 `/user/orders`,应该能看到刚创建的订单

### 4. 检查控制台日志
应该看到:
```
📡 拦截请求: /api/orders {}
✅ 订单已创建: {...}
📋 返回订单列表, 数量: 1
🔄 开始加载订单列表...
📦 API响应: {success: true, data: [...]}
✅ 响应成功? true
📊 响应数据: [...]
📋 数据类型: object 是数组
✅ 订单已设置, 数量: 1
```

---

## 🔍 技术细节

### API路径规范

| 端点 | 方法 | 用途 | Mock路径 |
|------|------|------|----------|
| `/api/orders` | GET | 获取订单列表 | ✅ 已支持 |
| `/api/orders` | POST | 创建订单 | ✅ 已支持 |
| `/api/orders/:id` | GET | 获取订单详情 | ✅ 已支持 |
| `/api/orders/:id/pay` | PUT | 支付订单 | ✅ 已支持 |
| `/api/orders/:id/cancel` | PUT | 取消订单 | ✅ 已支持 |
| `/api/user/orders` | GET | 获取用户订单 | ✅ 已支持 |

### 订单状态码规范

| 状态码 | 含义 | 前端显示 |
|--------|------|----------|
| 1 | 待支付 | pending |
| 2 | 已支付 | paid |
| 3 | 已完成 | completed |
| 4 | 已取消 | cancelled |

### 数据格式规范

**订单对象必需字段:**
```typescript
{
  id: string
  orderNo: string
  flightNo: string
  departureCity: string
  arrivalCity: string
  departureTime: string
  arrivalTime: string
  date: string  // ⚠️ 必需
  status: 1 | 2 | 3 | 4  // ⚠️ 数字
  totalPrice: number
  passengers: Array
  createTime: string
  payTime: string | null
}
```

**API响应格式:**
```typescript
{
  code: 200,
  message: string,
  success: true,
  data: Order[]  // ⚠️ 直接是数组,不是 { list: [] }
}
```

---

## ⚠️ 注意事项

### 1. Mock路径必须精确匹配
```typescript
// ❌ 错误 - 只匹配一个路径
if (pathname === '/api/user/orders')

// ✅ 正确 - 匹配多个可能的路径
if (pathname === '/api/user/orders' || pathname === '/api/orders')
```

### 2. 状态码必须一致
```typescript
// 创建订单
status: 1  // 待支付

// 支付订单
order.status = 2  // 已支付

// 返回给前端
status: order.status === 2 ? 'paid' : 'pending'
```

### 3. 数据格式必须完整
```typescript
// ❌ 缺少字段会导致前端报错
{
  id: '...',
  orderNo: '...'
  // 缺少其他必需字段
}

// ✅ 包含所有必需字段
{
  id: '...',
  orderNo: '...',
  flightNo: '...',
  date: '...',  // 必需
  status: 1,    // 必需
  // ... 其他字段
}
```

---

## 🚀 后续优化建议

### 短期优化
1. **统一API路径**
   - 制定API路径规范文档
   - 确保Mock和实际API路径一致

2. **完善Mock数据**
   - 添加更真实的航班信息
   - 支持多种订单场景

3. **增强错误处理**
   - Mock返回更详细的错误信息
   - 前端显示友好的错误提示

### 中期优化
1. **Mock数据持久化**
   ```typescript
   // 使用localStorage保存Mock数据
   const orders = JSON.parse(
     localStorage.getItem('mockOrders') || '[]'
   )
   ```

2. **API文档生成**
   - 使用Swagger/OpenAPI
   - 自动生成API文档

3. **类型安全**
   - 使用TypeScript严格模式
   - 添加运行时类型验证

---

## 📚 相关文档

- [Mock数据配置](../mock-data.ts)
- [API客户端配置](../src/api/client.ts)
- [订单API定义](../src/api/order.ts)
- [订单类型定义](../src/types/order.ts)

---

## ✅ 验证清单

- [x] Mock路径匹配修复
- [x] 订单状态码修复
- [x] 数据格式转换修复
- [x] 添加调试日志
- [x] 添加必需字段
- [ ] 功能测试通过(待用户测试)
- [ ] 边界情况测试
- [ ] 文档更新完成

---

## 🎉 总结

这个Bug的根本原因是**Mock API路径配置不匹配**,导致请求未被拦截,返回了HTML页面而不是JSON数据。

**修复内容:**
1. ✅ 添加 `/api/orders` 路径支持
2. ✅ 修复订单状态码 (0 → 1)
3. ✅ 添加缺失的字段 (date等)
4. ✅ 统一数据格式 (直接返回数组)
5. ✅ 添加调试日志

**核心经验:**
- 🔍 Mock路径必须与实际请求路径完全匹配
- 🔍 数据格式必须与前端期望一致
- 🔍 状态码规范必须统一
- 🔍 调试日志对排查问题至关重要

---

**修复完成时间:** 2025-11-10 04:05  
**修复者:** Cascade AI  
**Bug状态:** ✅ 已修复,待测试验证

---

## 🎊 测试建议

请按以下步骤测试:

1. **强制刷新浏览器** (Ctrl+F5)
2. **完成一次完整的订票流程**
3. **查看订单列表**,确认订单显示
4. **查看浏览器控制台**,确认日志正常
5. **测试状态筛选**,确认各状态正常

如有任何问题,请及时反馈! 💪
