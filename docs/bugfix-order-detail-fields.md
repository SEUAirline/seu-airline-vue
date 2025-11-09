# Bug修复: 订单详情字段缺失

**Bug编号:** #006  
**修复日期:** 2025-11-10  
**严重程度:** 🔴 高 (订单详情无法显示)  
**状态:** ✅ 已修复

---

## 🐛 问题描述

### 错误信息
```
Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'toFixed')
    at OrderDetailModal.vue:54:91
```

### 问题表现
- 点击"查看详情"按钮
- 弹窗显示加载中
- 控制台报错
- 详情内容无法显示

---

## 🔍 问题分析

### 根本原因

**订单详情接口返回的数据格式与订单列表不一致**

#### 订单列表接口 ✅
```typescript
// GET /api/orders - 已修复
data: [{
  totalAmount: 800,
  cabinClass: 'economy',
  // ... 完整字段
}]
```

#### 订单详情接口 ❌
```typescript
// GET /api/orders/:id - 未修复
data: {
  totalPrice: 800,  // ❌ 字段名不对
  // ❌ 缺少 cabinClass, totalAmount 等
}
```

---

## 🔧 修复方案

**文件:** `mock-data.ts`

### 修复前 ❌
```typescript
// 获取订单详情
if (pathname?.startsWith('/api/orders/') && req.method === 'GET') {
  const order = orders.find(o => o.id === orderId)
  
  res.end(JSON.stringify({
    success: true,
    data: order  // ❌ 直接返回原始数据
  }))
}
```

### 修复后 ✅
```typescript
// 获取订单详情
if (pathname?.startsWith('/api/orders/') && req.method === 'GET') {
  const order = orders.find(o => o.id === orderId)
  
  // 转换为前端期望的格式
  const formattedOrder = {
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
    cabinClass: order.cabinClass || 'economy',
    price: order.totalPrice || 0,
    totalAmount: order.totalPrice || 0,  // ✅ 添加
    passengers: order.passengers || [],
    createTime: order.createTime,
    payTime: order.payTime,
    paymentMethod: order.paymentMethod
  }
  
  console.log('📋 返回订单详情:', formattedOrder)
  
  res.end(JSON.stringify({
    success: true,
    data: formattedOrder  // ✅ 返回格式化后的数据
  }))
}
```

---

## 📊 修复效果

### 修复前 ❌
```
点击"查看详情"
  ↓
请求 GET /api/orders/order_1
  ↓
返回 { totalPrice: 800 }
  ↓
OrderDetailModal 渲染
  ↓
访问 order.totalAmount
  ↓
undefined.toFixed(2)
  ↓
TypeError
```

### 修复后 ✅
```
点击"查看详情"
  ↓
请求 GET /api/orders/order_1
  ↓
返回 { totalAmount: 800, cabinClass: 'economy', ... }
  ↓
OrderDetailModal 渲染
  ↓
访问 order.totalAmount
  ↓
800.toFixed(2) = "800.00"
  ↓
详情正常显示
```

---

## 🎯 验证步骤

1. **刷新浏览器** (Ctrl+F5)
2. **访问订单列表** (/user/orders)
3. **点击任意订单的"查看详情"按钮**
4. **确认详情弹窗正常显示**:
   - ✅ 订单号和创建时间
   - ✅ 航班信息
   - ✅ 总金额 (¥800.00)
   - ✅ 舱位等级
   - ✅ 乘客列表
   - ✅ 订单状态

---

## 📝 相关修复

这是继 #005 之后的相关修复:

| Bug | 接口 | 问题 | 状态 |
|-----|------|------|------|
| #005 | GET /api/orders | 订单列表字段缺失 | ✅ 已修复 |
| #006 | GET /api/orders/:id | 订单详情字段缺失 | ✅ 已修复 |

**核心问题:** 两个接口都需要返回相同格式的数据

---

## ⚠️ 注意事项

### 数据格式一致性

所有返回订单数据的接口都应该使用相同的格式转换逻辑:

```typescript
// ✅ 统一的格式转换函数
function formatOrder(order) {
  return {
    id: order.id,
    orderNo: order.orderNo,
    // ... 统一的字段映射
    totalAmount: order.totalPrice || 0,
    cabinClass: order.cabinClass || 'economy',
    // ...
  }
}

// 订单列表
data: filteredOrders.map(formatOrder)

// 订单详情
data: formatOrder(order)
```

---

## 🚀 后续优化建议

### 1. 提取公共格式转换函数
```typescript
// mock-data.ts
function formatOrderForFrontend(order: any) {
  return {
    id: order.id,
    orderNo: order.orderNo,
    flightNo: order.flightNo || 'CA1234',
    // ... 统一的转换逻辑
    totalAmount: order.totalPrice || 0,
    cabinClass: order.cabinClass || 'economy',
  }
}

// 在多处使用
const formattedOrders = orders.map(formatOrderForFrontend)
const formattedOrder = formatOrderForFrontend(order)
```

### 2. 类型定义
```typescript
// 定义内部存储格式
interface OrderInternal {
  totalPrice: number
  status: 1 | 2 | 3 | 4
}

// 定义前端使用格式
interface OrderFrontend {
  totalAmount: number
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
}
```

---

## ✅ 验证清单

- [x] 订单详情接口添加格式转换
- [x] 添加 totalAmount 字段
- [x] 添加 cabinClass 字段
- [x] 添加 price 字段
- [x] 状态码转换为字符串
- [x] 添加调试日志
- [ ] 功能测试通过(待用户测试)

---

## 🎉 总结

**问题:** 订单详情接口直接返回原始数据,未进行格式转换

**修复:** 与订单列表接口保持一致,统一进行格式转换

**经验:** 
- 🔍 相同类型的数据应该使用统一的格式
- 🔍 多个接口返回相同数据时要保持一致性
- 🔍 建议提取公共的格式转换函数

---

**修复完成时间:** 2025-11-10 04:58  
**修复者:** Cascade AI  
**Bug状态:** ✅ 已修复,待测试验证
