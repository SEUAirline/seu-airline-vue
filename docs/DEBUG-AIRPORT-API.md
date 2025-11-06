# 机场 API 调试指南

**问题:** 下拉框没有机场数据  
**时间:** 2025-11-06 20:54

---

## 🔍 诊断步骤

### 步骤1: 确认服务器已重启

```bash
# 必须重启服务器！
Ctrl+C
npm run dev
```

**查看控制台应该有:**
```
[vite:mock] mock file change C:\...\mock\flight.ts
```

---

### 步骤2: 打开浏览器开发者工具

1. 按 F12 打开开发者工具
2. 切换到 **Console** 标签
3. 切换到 **Network** 标签

---

### 步骤3: 刷新页面并观察

**在 Console 中查找:**
```javascript
// 查找是否有错误
加载机场数据失败: ...
```

**在 Network 中查找:**
```
请求: /api/airport/list
状态: 应该是 200 OK
响应时间: < 10ms (Mock API)
```

---

### 步骤4: 手动测试 API

**在浏览器 Console 中执行:**

```javascript
// 测试 1: 直接调用 API
fetch('/api/airport/list')
  .then(r => r.json())
  .then(data => {
    console.log('机场数据:', data)
    console.log('数据数量:', data.data?.length)
  })
  .catch(err => console.error('错误:', err))

// 测试 2: 使用 store
const { useFlightStore } = await import('/src/stores/flight.ts')
const flightStore = useFlightStore()
await flightStore.loadAirports()
console.log('Store 中的机场:', flightStore.airports)
console.log('机场数量:', flightStore.airports.length)
```

---

## 📊 预期结果

### 正确的 API 响应

```json
{
  "code": 200,
  "message": "查询成功",
  "success": true,
  "data": [
    { "code": "PEK", "name": "首都国际机场", "city": "北京" },
    { "code": "PVG", "name": "浦东国际机场", "city": "上海" },
    { "code": "CAN", "name": "白云国际机场", "city": "广州" },
    { "code": "SZX", "name": "宝安国际机场", "city": "深圳" },
    { "code": "CTU", "name": "双流国际机场", "city": "成都" },
    { "code": "HGH", "name": "萧山国际机场", "city": "杭州" },
    { "code": "XIY", "name": "咸阳国际机场", "city": "西安" },
    { "code": "CKG", "name": "江北国际机场", "city": "重庆" },
    { "code": "XMN", "name": "高崎国际机场", "city": "厦门" },
    { "code": "NKG", "name": "禄口国际机场", "city": "南京" }
  ]
}
```

### Store 中应该有 10 个机场

```javascript
flightStore.airports.length === 10  // ✅
```

### cities 数组应该有 10 个城市

```javascript
cities.value = ['北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆', '厦门', '南京']
```

---

## 🐛 可能的问题

### 问题1: Mock API 未启用

**症状:**
- Network 中看到 `ECONNREFUSED` 错误
- 没有 `[vite:mock]` 日志

**解决:**
```bash
# 检查 .env.development
VITE_USE_MOCK=true

# 重启服务器
npm run dev
```

---

### 问题2: API 路径错误

**症状:**
- Network 中看到 `/api/api/airport/list`
- 404 错误

**解决:**
已修复，确认路径是 `/api/airport/list`

---

### 问题3: 响应格式错误

**症状:**
- API 返回 200
- 但 `response.success` 是 undefined
- Store 中 airports 为空

**检查:**
```javascript
// Mock API 必须返回 success 字段
{
  code: 200,
  message: '查询成功',
  data: [...],
  success: true  // ← 必须有这个
}
```

---

### 问题4: Store 逻辑错误

**症状:**
- API 返回正确
- 但 Store 中 airports 为空

**检查:**
```javascript
// src/stores/flight.ts
if (response.success && response.data) {  // ← 检查条件
  airports.value = response.data
}
```

---

## 🔧 快速修复

### 如果 API 返回正确但 Store 为空

检查 HomePage.vue 的逻辑:

```vue
<script setup lang="ts">
const cities = ref<string[]>([])

onMounted(async () => {
  await flightStore.loadAirports()
  console.log('加载的机场:', flightStore.airports)  // ← 添加日志
  cities.value = [...new Set(flightStore.airports.map(a => a.city))]
  console.log('提取的城市:', cities.value)  // ← 添加日志
})
</script>
```

---

## 📝 调试清单

- [ ] 服务器已重启
- [ ] 浏览器已刷新 (Ctrl+Shift+R)
- [ ] Console 中无错误
- [ ] Network 中看到 `/api/airport/list` 请求
- [ ] 请求返回 200 OK
- [ ] 响应包含 10 个机场
- [ ] 响应有 `success: true`
- [ ] Store 中 airports 有 10 个元素
- [ ] cities 数组有 10 个城市
- [ ] 下拉框显示城市列表

---

## 💡 临时解决方案

如果 API 正常但下拉框仍然为空，可以临时硬编码测试:

```vue
<script setup lang="ts">
const cities = ref<string[]>([
  '北京', '上海', '广州', '深圳', '成都', 
  '杭州', '西安', '重庆', '厦门', '南京'
])

onMounted(async () => {
  await flightStore.loadAirports()
  // 如果 API 正常，这行会覆盖硬编码的数据
  if (flightStore.airports.length > 0) {
    cities.value = [...new Set(flightStore.airports.map(a => a.city))]
  }
})
</script>
```

---

## 🎯 下一步

1. **重启服务器** (必须!)
2. **打开浏览器 Console**
3. **执行手动测试脚本**
4. **查看返回的数据**
5. **报告具体的错误信息**

---

**关键:** 请在浏览器 Console 中执行测试脚本，并告诉我返回的结果！
