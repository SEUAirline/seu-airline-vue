# 机场数据加载调试

**问题:** 下拉框没有机场数据  
**时间:** 2025-11-06 20:54  
**状态:** 已添加详细调试日志

---

## ✅ 已添加的调试日志

### 1. HomePage.vue
```javascript
onMounted(async () => {
  console.log('开始加载机场数据...')
  await flightStore.loadAirports()
  console.log('机场数据加载完成:', flightStore.airports)
  console.log('机场数量:', flightStore.airports.length)
  cities.value = [...new Set(flightStore.airports.map(a => a.city))]
  console.log('提取的城市列表:', cities.value)
  console.log('城市数量:', cities.value.length)
})
```

### 2. flight.ts Store
```javascript
async function loadAirports() {
  console.log('Flight Store: 调用 API 获取机场列表...')
  const response = await flightApi.getAirports()
  console.log('Flight Store: API 响应:', response)
  console.log('Flight Store: response.success =', response.success)
  console.log('Flight Store: response.data =', response.data)
  // ...
}
```

---

## 🚀 测试步骤

### 步骤1: 重启开发服务器 (必须!)

```bash
# 停止当前服务器
Ctrl+C

# 重新启动
npm run dev
```

**等待看到:**
```
VITE v5.4.20  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

### 步骤2: 打开浏览器并查看控制台

1. 打开 http://localhost:5173
2. 按 F12 打开开发者工具
3. 切换到 **Console** 标签
4. 刷新页面 (Ctrl+Shift+R)

---

### 步骤3: 查看控制台输出

**应该看到以下日志序列:**

```
✅ 正确的日志序列:

1. 开始加载机场数据...
2. Flight Store: 调用 API 获取机场列表...
3. Flight Store: API 响应: {code: 200, message: "查询成功", data: Array(10), success: true}
4. Flight Store: response.success = true
5. Flight Store: response.data = (10) [{code: "PEK", name: "首都国际机场", city: "北京"}, ...]
6. Flight Store: 机场数据已保存到 store: 10 个机场
7. 机场数据加载完成: (10) [{code: "PEK", ...}, ...]
8. 机场数量: 10
9. 提取的城市列表: (10) ["北京", "上海", "广州", ...]
10. 城市数量: 10
```

---

## 🐛 可能的错误情况

### 情况1: Mock API 未启用

**日志:**
```
❌ Flight Store: 调用 API 获取机场列表...
❌ 加载机场数据失败: Error: Network Error
```

**Network 标签:**
```
/api/airport/list - Failed - ECONNREFUSED
```

**解决:**
```bash
# 检查 .env.development
VITE_USE_MOCK=true

# 重启服务器
npm run dev
```

---

### 情况2: API 响应格式错误

**日志:**
```
✅ Flight Store: 调用 API 获取机场列表...
✅ Flight Store: API 响应: {code: 200, message: "查询成功", data: Array(10)}
❌ Flight Store: response.success = undefined  ← 缺少 success 字段
⚠️  Flight Store: API 响应不符合预期
```

**解决:**
Mock API 需要返回 `success: true` 字段（已修复）

---

### 情况3: 数据为空

**日志:**
```
✅ Flight Store: 调用 API 获取机场列表...
✅ Flight Store: API 响应: {code: 200, message: "查询成功", data: [], success: true}
❌ Flight Store: response.data = []  ← 数据为空
```

**解决:**
检查 Mock API 的数据生成逻辑

---

### 情况4: API 路径错误

**日志:**
```
✅ Flight Store: 调用 API 获取机场列表...
❌ 加载机场数据失败: Error: Request failed with status code 404
```

**Network 标签:**
```
/api/api/airport/list - 404 Not Found  ← 路径重复
```

**解决:**
已修复，确认路径是 `/api/airport/list`

---

## 📊 完整的数据流

```
1. HomePage.vue onMounted
   ↓
2. flightStore.loadAirports()
   ↓
3. flightApi.getAirports()
   ↓
4. request.get('/airport/list')
   ↓
5. axios 请求: GET /api/airport/list
   ↓
6. Mock 插件拦截
   ↓
7. mock/flight.ts 返回数据
   ↓
8. axios 拦截器返回 response.data
   ↓
9. Store 保存到 airports.value
   ↓
10. HomePage 提取城市列表
   ↓
11. 下拉框显示城市
```

---

## 🔍 手动测试

**在浏览器 Console 中执行:**

```javascript
// 测试 1: 直接请求 API
fetch('/api/airport/list')
  .then(r => r.json())
  .then(data => {
    console.log('=== API 测试结果 ===')
    console.log('响应:', data)
    console.log('成功:', data.success)
    console.log('数据:', data.data)
    console.log('数量:', data.data?.length)
  })

// 测试 2: 检查 Store
const flightStore = window.$pinia?.state.value.flight
if (flightStore) {
  console.log('=== Store 状态 ===')
  console.log('机场数据:', flightStore.airports)
  console.log('机场数量:', flightStore.airports?.length)
} else {
  console.log('Store 未初始化')
}
```

---

## ✅ 验证清单

**在执行测试前，确认:**

- [ ] 已停止旧的开发服务器 (Ctrl+C)
- [ ] 已重新启动服务器 (npm run dev)
- [ ] 浏览器已完全刷新 (Ctrl+Shift+R)
- [ ] 开发者工具已打开 (F12)
- [ ] Console 标签已选中
- [ ] Network 标签可见

**测试后，确认:**

- [ ] Console 中有 "开始加载机场数据..." 日志
- [ ] Console 中有 "Flight Store: 调用 API..." 日志
- [ ] Console 中有 API 响应日志
- [ ] response.success = true
- [ ] response.data 有 10 个元素
- [ ] 机场数量: 10
- [ ] 城市数量: 10
- [ ] Network 中 /api/airport/list 返回 200
- [ ] 下拉框显示城市列表

---

## 💡 预期的完整控制台输出

```
开始加载机场数据...
Flight Store: 调用 API 获取机场列表...
Flight Store: API 响应: 
  {
    code: 200,
    message: "查询成功",
    success: true,
    data: [
      {code: "PEK", name: "首都国际机场", city: "北京"},
      {code: "PVG", name: "浦东国际机场", city: "上海"},
      {code: "CAN", name: "白云国际机场", city: "广州"},
      {code: "SZX", name: "宝安国际机场", city: "深圳"},
      {code: "CTU", name: "双流国际机场", city: "成都"},
      {code: "HGH", name: "萧山国际机场", city: "杭州"},
      {code: "XIY", name: "咸阳国际机场", city: "西安"},
      {code: "CKG", name: "江北国际机场", city: "重庆"},
      {code: "XMN", name: "高崎国际机场", city: "厦门"},
      {code: "NKG", name: "禄口国际机场", city: "南京"}
    ]
  }
Flight Store: response.success = true
Flight Store: response.data = (10) [{...}, {...}, ...]
Flight Store: 机场数据已保存到 store: 10 个机场
机场数据加载完成: (10) [{...}, {...}, ...]
机场数量: 10
提取的城市列表: (10) ["北京", "上海", "广州", "深圳", "成都", "杭州", "西安", "重庆", "厦门", "南京"]
城市数量: 10
```

---

## 🎯 下一步

1. **立即重启开发服务器**
2. **打开浏览器控制台**
3. **刷新页面**
4. **复制完整的控制台输出**
5. **告诉我看到了什么**

---

**关键:** 现在有了详细的调试日志，我们可以准确定位问题所在！请重启服务器后，将控制台的输出发给我。
