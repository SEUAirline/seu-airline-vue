# 订单管理组件使用指南

本文档介绍如何使用新开发的订单管理相关组件。

---

## 📦 组件列表

### 1. OrderCard - 订单卡片组件

订单卡片组件用于在列表中展示订单的基本信息。

#### 使用示例

```vue
<template>
  <OrderCard
    :order="order"
    @view-detail="handleViewDetail"
    @pay="handlePay"
    @cancel="handleCancel"
    @check-in="handleCheckIn"
    @rebook="handleRebook"
  />
</template>

<script setup lang="ts">
import OrderCard from '@/components/OrderCard.vue'
import type { Order } from '@/types/order'

const order: Order = {
  id: 'ORD20241109001',
  userId: 1,
  flightId: 'FL001',
  flightNo: 'CA1234',
  departureCity: '北京',
  arrivalCity: '上海',
  departureTime: '2024-11-10T08:00:00',
  arrivalTime: '2024-11-10T10:30:00',
  date: '2024-11-10',
  passengers: [
    { name: '张三', idCard: '110101199001011234', phone: '13800138000', passengerType: 'adult' }
  ],
  cabinClass: 'economy',
  price: 800,
  totalAmount: 800,
  status: 'pending',
  createTime: '2024-11-09T14:30:00'
}

function handleViewDetail(orderId: string) {
  console.log('查看订单详情:', orderId)
}

function handlePay(orderId: string) {
  console.log('支付订单:', orderId)
}

function handleCancel(orderId: string) {
  console.log('取消订单:', orderId)
}

function handleCheckIn(orderId: string) {
  console.log('在线值机:', orderId)
}

function handleRebook(order: Order) {
  console.log('再次预订:', order)
}
</script>
```

#### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| order | Order | 是 | 订单对象 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| view-detail | orderId: string | 查看订单详情 |
| pay | orderId: string | 支付订单 |
| cancel | orderId: string | 取消订单 |
| check-in | orderId: string | 在线值机 |
| rebook | order: Order | 再次预订 |

---

### 2. OrderDetailModal - 订单详情弹窗组件

订单详情弹窗组件用于展示订单的完整信息。

#### 使用示例

```vue
<template>
  <div>
    <button @click="showModal = true">查看订单详情</button>
    
    <OrderDetailModal
      v-model:visible="showModal"
      :order-id="orderId"
      @pay="handlePay"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderDetailModal from '@/components/OrderDetailModal.vue'

const showModal = ref(false)
const orderId = ref('ORD20241109001')

function handlePay(orderId: string) {
  console.log('支付订单:', orderId)
  showModal.value = false
}

function handleCancel(orderId: string) {
  console.log('取消订单:', orderId)
}
</script>
```

#### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| visible | boolean | 是 | 是否显示弹窗 (支持 v-model) |
| orderId | string \| null | 是 | 订单ID |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:visible | value: boolean | 更新弹窗显示状态 |
| pay | orderId: string | 支付订单 |
| cancel | orderId: string | 取消订单 |

---

### 3. OrdersPage - 订单列表页面

完整的订单管理页面,包含筛选、搜索、分页等功能。

#### 路由配置

```typescript
{
  path: '/user/orders',
  name: 'UserOrders',
  component: () => import('@/views/user/OrdersPage.vue'),
  meta: { title: '我的订单', requiresAuth: true }
}
```

#### 页面功能

1. **订单状态筛选**
   - 全部订单
   - 待支付
   - 已支付
   - 已完成
   - 已取消

2. **订单搜索**
   - 支持订单号搜索
   - 支持航班号搜索
   - 支持乘客姓名搜索

3. **时间范围筛选**
   - 全部时间
   - 近一周
   - 近一月
   - 近三月

4. **订单操作**
   - 查看详情
   - 立即支付
   - 取消订单
   - 在线值机
   - 再次预订

---

## 🔧 API 集成

### 订单 API

```typescript
import { orderApi } from '@/api/order'

// 获取用户订单列表
const response = await orderApi.getUserOrders()
if (response.success && response.data) {
  orders.value = response.data
}

// 获取订单详情
const response = await orderApi.getOrderById(orderId)
if (response.success && response.data) {
  order.value = response.data
}

// 取消订单
const response = await orderApi.cancelOrder(orderId)
if (response.success) {
  console.log('订单已取消')
}
```

---

## 🎨 样式定制

所有组件都使用 Tailwind CSS,可以通过修改 Tailwind 配置来定制样式。

### 主题颜色

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        secondary: '#3B82F6',
        // ...
      }
    }
  }
}
```

---

## 📱 响应式设计

所有组件都支持响应式设计,在不同屏幕尺寸下都能正常显示。

### 断点

- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

---

## 🐛 常见问题

### 1. 订单列表为空

**问题:** 页面显示"暂无订单"

**解决方案:**
- 检查用户是否已登录
- 检查 API 是否正常返回数据
- 检查订单数据格式是否正确

### 2. 订单详情加载失败

**问题:** 点击查看详情时显示加载失败

**解决方案:**
- 检查订单ID是否正确
- 检查 API 接口是否正常
- 查看浏览器控制台错误信息

### 3. 倒计时不显示

**问题:** 待支付订单没有显示倒计时

**解决方案:**
- 检查订单状态是否为 'pending'
- 检查订单创建时间是否正确
- 确保组件已正确挂载

---

## 📚 相关文档

- [开发计划](./dev-plan-1109.md)
- [开发总结](./order-management-dev-summary.md)
- [API 文档](../src/api/order.ts)
- [类型定义](../src/types/order.ts)

---

## 💡 最佳实践

### 1. 错误处理

```typescript
async function loadOrders() {
  loading.value = true
  try {
    const response = await orderApi.getUserOrders()
    if (response.success && response.data) {
      orders.value = response.data
    } else {
      // 处理业务错误
      console.error('加载订单失败:', response.message)
    }
  } catch (error) {
    // 处理网络错误
    console.error('网络错误:', error)
  } finally {
    loading.value = false
  }
}
```

### 2. 状态管理

```typescript
// 使用 computed 进行数据筛选
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    // 筛选逻辑
    return order.status === currentStatus.value
  })
})
```

### 3. 性能优化

```typescript
// 使用分页减少渲染数量
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})
```

---

## 🎯 下一步

完成订单管理页面后,建议继续开发:

1. **支付页面** - 完善支付流程
2. **订单成功页面** - 优化支付成功体验
3. **个人中心页面** - 完善用户信息管理

---

**更新时间:** 2025-11-09  
**版本:** 1.0.0
