# Mock 数据配置指南

**配置时间:** 2025-10-23  
**插件:** vite-plugin-mock + mockjs

---

## 📦 已安装的依赖

```bash
npm install -D vite-plugin-mock mockjs
```

- **vite-plugin-mock:** Vite 的 Mock 数据插件
- **mockjs:** 生成随机数据的工具库

---

## ⚙️ 配置说明

### 1. Vite 配置

**文件:** `vite.config.ts`

```typescript
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock',  // Mock 文件目录
      enable: true,      // 启用 Mock
    })
  ],
  // ...
})
```

### 2. Mock 文件结构

```
mock/
├── flight.ts    # 航班相关 Mock 数据
├── user.ts      # 用户相关 Mock 数据
└── order.ts     # 订单相关 Mock 数据
```

---

## 🛫 航班 Mock API

**文件:** `mock/flight.ts`

### 可用接口

#### 1. 搜索航班
```
GET /api/v1/flight/search
参数: departureCity, arrivalCity, departureDate
```

**功能:**
- 自动生成 15-30 个随机航班
- 包含多个航空公司
- 随机价格、时间、座位数
- 支持不同的航班状态

#### 2. 获取航班详情
```
GET /api/v1/flight/:id
```

**功能:**
- 根据 ID 返回单个航班详情

#### 3. 获取机场列表
```
GET /api/v1/airport/list
```

**功能:**
- 返回 10 个城市的机场信息
- 包含机场代码、名称、城市

#### 4. 获取热门航线
```
GET /api/v1/flight/popular
```

**功能:**
- 返回 5 条热门航线

### Mock 数据特点

**航空公司:**
- 中国国际航空 (CA)
- 中国东方航空 (MU)
- 中国南方航空 (CZ)
- 海南航空 (HU)
- 厦门航空 (MF)
- 四川航空 (SC)
- 深圳航空 (ZH)

**支持的城市:**
- 北京、上海、广州、深圳、成都
- 杭州、西安、重庆、厦门、南京

**航班数据包含:**
- 航班号（自动生成）
- 起飞/到达时间（随机生成）
- 飞行时长（1-4小时）
- 价格（400-2000元）
- 座位数（经济舱、商务舱、头等舱）
- 航班状态（准点/延误）
- 机型（A320、B737等）

---

## 👤 用户 Mock API

**文件:** `mock/user.ts`

### 可用接口

#### 1. 用户注册
```
POST /api/v1/auth/register
Body: { username, password, email, phone }
```

#### 2. 用户登录
```
POST /api/v1/auth/login
Body: { username, password }
```

**测试账号:**
- 用户名: `user001`
- 密码: `123456`

#### 3. 获取用户信息
```
GET /api/v1/user/profile
Headers: Authorization: Bearer {token}
```

#### 4. 更新用户信息
```
PUT /api/v1/user/profile
Body: { email, phone, realName }
```

#### 5. 修改密码
```
PUT /api/v1/user/password
Body: { oldPassword, newPassword }
```

---

## 📋 订单 Mock API

**文件:** `mock/order.ts`

### 可用接口

#### 1. 创建订单
```
POST /api/v1/order
Body: { flightId, passengers, contactName, contactPhone, totalPrice }
```

**功能:**
- 自动生成订单号
- 订单状态默认为"待支付"

#### 2. 获取订单列表
```
GET /api/v1/order/list
参数: status, page, pageSize
```

**订单状态:**
- 1: 待支付
- 2: 已支付
- 3: 已取消
- 4: 已退款

#### 3. 获取订单详情
```
GET /api/v1/order/:id
```

#### 4. 取消订单
```
PUT /api/v1/order/:id/cancel
```

#### 5. 支付订单
```
POST /api/v1/order/:id/pay
Body: { paymentMethod }
```

#### 6. 申请退票
```
POST /api/v1/order/:id/refund
Body: { reason }
```

---

## 🧪 测试步骤

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 测试航班搜索

1. 打开首页 `http://localhost:5173`
2. 填写搜索表单:
   - 出发地: 北京
   - 目的地: 上海
   - 出发日期: 选择今天或未来日期
3. 点击"搜索航班"
4. **预期结果:** 显示 15-30 个随机生成的航班

### 3. 查看网络请求

打开浏览器开发者工具（F12）:
1. 切换到 **Network** 标签
2. 搜索航班
3. 查找请求: `search?departureCity=北京&arrivalCity=上海...`
4. **预期结果:** 状态码 200，返回航班数据

### 4. 测试用户登录

1. 访问登录页面 `/login`
2. 输入测试账号:
   - 用户名: `user001`
   - 密码: `123456`
3. 点击登录
4. **预期结果:** 登录成功，获得 Token

---

## 🔍 调试技巧

### 查看 Mock 日志

Mock 插件会在控制台输出拦截的请求:

```
[vite:mock-server] request invoke: /api/v1/flight/search
```

### 检查 Mock 是否生效

1. 打开浏览器控制台
2. 查看 Network 标签
3. 请求应该被 Mock 拦截，返回模拟数据
4. 响应头会包含 `X-Powered-By: vite-plugin-mock`

### 常见问题

#### Q1: Mock 不生效
**解决方案:**
- 检查 `vite.config.ts` 配置是否正确
- 确认 `enable: true`
- 重启开发服务器

#### Q2: 请求 404
**解决方案:**
- 检查 API 路径是否正确（应该是 `/api/v1/...`）
- 检查 Mock 文件中的 URL 配置

#### Q3: 数据格式错误
**解决方案:**
- 检查 Mock 返回的数据格式
- 确保与 TypeScript 类型定义匹配

---

## 📝 Mock 数据示例

### 航班搜索响应

```json
{
  "code": 200,
  "message": "查询成功",
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "flightNo": "CA1234",
      "airline": "中国国际航空",
      "departureAirport": "PEK",
      "arrivalAirport": "PVG",
      "departureCity": "北京",
      "arrivalCity": "上海",
      "departureTime": "2025-10-24T08:30:00.000Z",
      "arrivalTime": "2025-10-24T10:45:00.000Z",
      "date": "2025-10-24",
      "duration": "2小时15分钟",
      "price": 850,
      "economySeats": 120,
      "businessSeats": 20,
      "firstClassSeats": 8,
      "status": "scheduled",
      "aircraft": "A320"
    }
  ]
}
```

### 用户登录响应

```json
{
  "code": 200,
  "message": "登录成功",
  "success": true,
  "data": {
    "token": "550e8400-e29b-41d4-a716-446655440000",
    "user": {
      "id": 1,
      "username": "user001",
      "email": "user001@example.com",
      "phone": "13800138000",
      "realName": "张三",
      "memberLevel": 2,
      "points": 1500
    }
  }
}
```

---

## 🎯 下一步

Mock 数据配置完成后，你可以:

1. ✅ **测试航班搜索功能** - 完整的搜索、筛选、排序流程
2. ✅ **测试用户登录** - 注册、登录、获取信息
3. ⏳ **开发航班预订功能** - 使用订单 Mock API
4. ⏳ **开发支付功能** - 使用订单支付 Mock API
5. ⏳ **开发订单管理** - 使用订单列表 Mock API

---

## 💡 提示

### Mock 数据的优势

1. **独立开发** - 前端不依赖后端进度
2. **快速测试** - 无需等待真实 API
3. **可控数据** - 可以模拟各种场景
4. **离线开发** - 无需网络连接

### 注意事项

1. Mock 数据仅在开发环境有效
2. 生产环境需要切换到真实 API
3. Mock 数据不会持久化（刷新页面会重置）
4. 订单数据存储在内存中

---

## 🔄 切换到真实 API

当后端 API 开发完成后，只需:

1. 修改 `vite.config.ts`:
```typescript
viteMockServe({
  mockPath: 'mock',
  enable: false,  // 关闭 Mock
})
```

2. 或者使用环境变量:
```typescript
viteMockServe({
  mockPath: 'mock',
  enable: import.meta.env.MODE === 'development',
})
```

---

**配置完成！** 🎉

现在你可以开始测试航班搜索功能了。祝开发顺利！
