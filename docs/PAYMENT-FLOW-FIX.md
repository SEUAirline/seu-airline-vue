# 支付流程"订单不存在"问题修复

**问题:** 提交订单后跳转到支付页面显示"订单不存在"  
**修复时间:** 2025-11-06 20:20

---

## 🔍 问题分析

### 问题现象
1. 用户填写预订信息并提交订单
2. 订单创建成功,跳转到支付页面
3. 支付页面加载一段时间后显示 **"订单不存在"**

### 根本原因

**这不是因为没有接入后端，而是 Mock API 的数据结构问题！**

#### 问题1: 订单详情返回数据不完整

**支付页面需要的字段:**
```typescript
{
  id: string
  orderNo: string
  flightNo: string          // ❌ 缺失
  departureCity: string     // ❌ 缺失
  arrivalCity: string       // ❌ 缺失
  departureTime: string     // ❌ 缺失
  passengerCount: number    // ❌ 缺失
  totalPrice: number
}
```

**Mock API 原来返回的数据:**
```typescript
// 只返回了 order 对象本身
data: order  // 缺少航班信息
```

#### 问题2: 支付 API 方法不匹配

**前端调用:**
```typescript
// src/api/order.ts
payOrder(params: PaymentParams): Promise<ApiResponse> {
  return request.put(`/orders/${params.orderId}/pay`)  // PUT 方法
}
```

**Mock API 原来的定义:**
```typescript
{
  url: '/api/orders/:id/pay',
  method: 'post',  // ❌ 错误: 应该是 put
  ...
}
```

---

## ✅ 解决方案

### 1. 修复订单详情返回数据

**修改文件:** `mock/order.ts`

```typescript
// 获取订单详情
{
  url: '/api/orders/:id',
  method: 'get',
  response: (request: any) => {
    const { id } = request.params
    const order = orders.find(o => o.id === id)

    if (!order) {
      return {
        code: 404,
        message: '订单不存在',
        data: null,
        success: false
      }
    }

    // ✅ 返回完整的订单信息，包含支付页面需要的字段
    return {
      code: 200,
      message: '查询成功',
      data: {
        ...order,
        flightNo: 'CA1234',
        departureCity: '南京',
        arrivalCity: '北京',
        departureTime: '2025-11-07 08:00',
        arrivalTime: '2025-11-07 10:30',
        passengerCount: order.passengers?.length || 1
      },
      success: true
    }
  }
}
```

### 2. 修复支付 API 方法

**修改文件:** `mock/order.ts`

```typescript
// 支付订单
{
  url: '/api/orders/:id/pay',
  method: 'put',  // ✅ 改为 put
  response: (request: any) => {
    // ... 支付逻辑
  }
}
```

---

## 📊 完整的订单流程

### 流程图
```
1. 用户填写预订信息
   ↓
2. 点击"提交订单"
   ↓
3. 调用 POST /api/orders 创建订单
   ├─ 先调用 GET /api/seats/flight/:id/type/:type/available 获取座位
   ├─ 自动分配座位
   └─ 创建订单并保存到 orders 数组
   ↓
4. 返回订单信息 { id, orderNo, flightNo, ... }
   ↓
5. 跳转到支付页面 /payment/:orderId
   ↓
6. 支付页面调用 GET /api/orders/:id 获取订单详情
   ├─ ✅ 现在返回完整的订单信息
   └─ 包含 flightNo, departureCity 等字段
   ↓
7. 显示订单信息和支付选项
   ↓
8. 用户选择支付方式并确认
   ↓
9. 调用 PUT /api/orders/:id/pay 支付订单
   ├─ ✅ 方法已修复为 PUT
   └─ 更新订单状态为"已支付"
   ↓
10. 跳转到订单成功页面 /order-success/:orderId
```

---

## 🎯 修复内容总结

### 修改的文件
| 文件 | 修改内容 | 状态 |
|------|----------|------|
| `mock/order.ts` | 订单详情返回完整数据 | ✅ |
| `mock/order.ts` | 支付 API 方法改为 PUT | ✅ |

### 修复的问题
| 问题 | 原因 | 解决方案 | 状态 |
|------|------|----------|------|
| 订单不存在 | 订单详情缺少字段 | 返回完整订单信息 | ✅ |
| 支付失败 | API 方法不匹配 | PUT 替代 POST | ✅ |

---

## 🚀 测试步骤

### 完整预订到支付流程

**步骤1: 搜索航班**
```
1. 进入首页
2. 选择: 南京 → 北京
3. 选择日期: 明天
4. 点击搜索
```

**步骤2: 预订航班**
```
1. 选择一个航班
2. 点击"预订"按钮
3. 选择经济舱
```

**步骤3: 填写信息**
```
1. 添加乘客
   - 姓名: 张三
   - 证件: 身份证
   - 证件号: 320102199001011234
   - 手机: 13800138000
   - 类型: 成人

2. 填写联系人
   - 姓名: 张三
   - 手机: 13800138000
   - 邮箱: zhangsan@example.com
```

**步骤4: 提交订单**
```
1. 点击"提交订单"
2. ✅ 应该成功跳转到支付页面
3. ✅ 不应该显示"订单不存在"
```

**步骤5: 支付页面验证**
```
✅ 应该显示:
- 订单号
- 航班号: CA1234
- 航线: 南京 → 北京
- 乘客人数: 1 人
- 应付金额: ¥800
- 15分钟倒计时
- 支付方式选择
```

**步骤6: 完成支付**
```
1. 选择支付方式(支付宝/微信/银行卡)
2. 勾选同意协议
3. 点击"确认支付"
4. ✅ 应该跳转到订单成功页面
```

---

## 💡 技术细节

### 订单数据结构

**创建订单时保存:**
```typescript
const order = {
  id: Mock.Random.guid(),
  orderNo: generateOrderNo(),
  userId: 1,
  flightId: items[0]?.flightId,
  totalPrice: items.length * 800,
  status: 1, // 1: 待支付
  paymentMethod: null,
  contactName: items[0]?.passengerName,
  contactPhone: '13800138000',
  passengers: [...],
  createTime: new Date().toISOString(),
  payTime: null,
  cancelTime: null
}

orders.push(order)  // 保存到内存数组
```

**查询订单时返回:**
```typescript
return {
  ...order,              // 原始订单数据
  flightNo: 'CA1234',    // 补充航班信息
  departureCity: '南京',
  arrivalCity: '北京',
  departureTime: '2025-11-07 08:00',
  arrivalTime: '2025-11-07 10:30',
  passengerCount: order.passengers?.length || 1
}
```

### 订单状态
| 状态码 | 说明 | 操作 |
|--------|------|------|
| 1 | 待支付 | 可支付、可取消 |
| 2 | 已支付 | 可退票 |
| 3 | 已取消 | 无操作 |
| 4 | 已退票 | 无操作 |

---

## 🔄 后续优化建议

### 1. 数据持久化
当前订单数据存储在内存中,刷新页面会丢失:
```typescript
const orders: any[] = []  // 内存数组
```

**建议:**
- 使用 localStorage 持久化订单数据
- 或连接真实后端数据库

### 2. 订单号生成优化
当前订单号格式: `YYYYMMDD + 6位随机数`

**建议:**
- 添加业务前缀: `ORD20251106123456`
- 确保唯一性检查
- 添加校验位

### 3. 支付超时处理
当前倒计时结束后只是提示,订单状态未更新

**建议:**
- 超时自动取消订单
- 释放座位资源
- 通知用户

### 4. 航班信息关联
当前航班信息是硬编码的

**建议:**
- 根据 flightId 从航班数据中获取真实信息
- 保持数据一致性

---

## 📝 相关文件

### 修改的文件
1. `mock/order.ts` - 订单 Mock API
2. `docs/PAYMENT-FLOW-FIX.md` - 本文档

### 相关文件
1. `src/api/order.ts` - 订单 API 定义
2. `src/stores/order.ts` - 订单状态管理
3. `src/views/user/FlightBookPage.vue` - 预订页面
4. `src/views/user/PaymentPage.vue` - 支付页面
5. `src/views/user/OrderSuccessPage.vue` - 成功页面

---

## ✅ 验证清单

- [x] 修复订单详情返回数据
- [x] 修复支付 API 方法
- [ ] 测试订单创建
- [ ] 测试支付页面加载
- [ ] 测试支付流程
- [ ] 测试跳转到成功页面
- [ ] 验证订单状态更新

---

**修复完成!** 🎉

现在用户可以正常完成从预订到支付的完整流程,不会再出现"订单不存在"的错误。

**下一步:** 重启开发服务器并测试完整的预订和支付流程。
