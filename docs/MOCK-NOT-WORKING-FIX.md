# Mock API 未启用问题修复

**问题:** API 返回 HTML 而不是 JSON，Mock 插件未工作  
**时间:** 2025-11-06 21:00

---

## 🔍 问题诊断

### 错误现象

```
Flight Store: API 响应: <!DOCTYPE html>...
Flight Store: response.success = undefined
Flight Store: response.data = undefined
```

**根本原因:** Mock 插件没有拦截请求，请求被当作静态文件返回了 `index.html`

---

## ✅ 已完成的修复

### 1. 更新 Vite 配置

**修改文件:** `vite.config.ts`

```typescript
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const useMock = env.VITE_USE_MOCK === 'true'
  
  // 添加调试日志
  console.log('=== Vite 配置 ===')
  console.log('模式:', mode)
  console.log('命令:', command)
  console.log('VITE_USE_MOCK:', env.VITE_USE_MOCK)
  console.log('useMock:', useMock)

  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        enable: command === 'serve' && useMock,  // ✅ 修复
        logger: true
      })
    ],
    // ...
  }
})
```

**关键修复:**
- `enable: command === 'serve' && useMock` - 确保只在开发服务器模式下启用

---

## 🚀 立即执行

### 步骤1: 完全停止服务器

```bash
# 在终端按 Ctrl+C
# 确保进程完全停止
```

### 步骤2: 清除缓存并重启

```bash
# 删除 node_modules/.vite 缓存
rmdir /s /q node_modules\.vite

# 重新启动
npm run dev
```

### 步骤3: 查看启动日志

**应该看到:**
```
=== Vite 配置 ===
模式: development
命令: serve
VITE_USE_MOCK: true
useMock: true

VITE v5.4.20  ready in XXX ms

[vite:mock] mock file change C:\...\mock\flight.ts
[vite:mock] mock file change C:\...\mock\message.ts
[vite:mock] mock file change C:\...\mock\order.ts
[vite:mock] mock file change C:\...\mock\user.ts
```

---

## 🔍 验证 Mock 是否启用

### 方法1: 查看终端日志

**✅ Mock 已启用:**
```
=== Vite 配置 ===
模式: development
命令: serve
VITE_USE_MOCK: true
useMock: true

[vite:mock] mock file change ...
```

**❌ Mock 未启用:**
```
=== Vite 配置 ===
模式: development
命令: serve
VITE_USE_MOCK: undefined  ← 环境变量未加载
useMock: false

(没有 [vite:mock] 日志)
```

---

### 方法2: 测试 API 请求

**在浏览器 Console 中:**

```javascript
fetch('/api/airport/list')
  .then(r => r.text())
  .then(text => {
    if (text.startsWith('<!DOCTYPE')) {
      console.error('❌ Mock 未启用 - 返回了 HTML')
    } else {
      const data = JSON.parse(text)
      console.log('✅ Mock 已启用 - 返回了 JSON:', data)
    }
  })
```

---

## 🐛 如果还是不工作

### 检查1: 环境变量文件

**确认 `.env.development` 存在且内容正确:**

```env
VITE_APP_TITLE=SEUAirline航空预订系统
VITE_APP_BASE_API=/api
VITE_APP_MODE=development
VITE_USE_MOCK=true
```

**注意:**
- 文件名必须是 `.env.development`
- 不能有空格
- `VITE_USE_MOCK=true` 必须存在

---

### 检查2: Mock 文件路径

**确认 Mock 文件存在:**
```
seu-airline-vue/
  ├── mock/
  │   ├── flight.ts    ✅
  │   ├── message.ts   ✅
  │   ├── order.ts     ✅
  │   └── user.ts      ✅
  ├── src/
  ├── vite.config.ts
  └── .env.development
```

---

### 检查3: vite-plugin-mock 版本

**检查 package.json:**

```json
{
  "devDependencies": {
    "vite-plugin-mock": "^3.0.0"  // 确保版本正确
  }
}
```

**如果版本不对，重新安装:**

```bash
npm install -D vite-plugin-mock@^3.0.0
npm run dev
```

---

## 💡 临时解决方案

如果 Mock 插件仍然不工作，可以使用 MSW (Mock Service Worker) 作为替代：

### 安装 MSW

```bash
npm install -D msw
```

### 配置 MSW

创建 `src/mocks/browser.ts`:

```typescript
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

创建 `src/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/airport/list', () => {
    return HttpResponse.json({
      code: 200,
      message: '查询成功',
      success: true,
      data: [
        { code: 'PEK', name: '首都国际机场', city: '北京' },
        // ... 其他机场
      ]
    })
  })
]
```

在 `src/main.ts` 中启用:

```typescript
if (import.meta.env.VITE_USE_MOCK === 'true') {
  const { worker } = await import('./mocks/browser')
  await worker.start()
}
```

---

## 📊 完整的诊断流程

```
1. 检查 .env.development
   ↓
2. 重启服务器
   ↓
3. 查看终端日志
   ├─ 有 "=== Vite 配置 ===" → 配置已加载 ✅
   ├─ useMock: true → 环境变量正确 ✅
   └─ 有 [vite:mock] 日志 → Mock 已启用 ✅
   ↓
4. 打开浏览器
   ↓
5. 查看 Network
   ├─ /api/airport/list → 200 OK
   ├─ Response 是 JSON → Mock 工作 ✅
   └─ Response 是 HTML → Mock 未工作 ❌
```

---

## ✅ 验证清单

**服务器启动时:**
- [ ] 终端显示 "=== Vite 配置 ==="
- [ ] 显示 "VITE_USE_MOCK: true"
- [ ] 显示 "useMock: true"
- [ ] 显示 "[vite:mock] mock file change ..."

**浏览器测试时:**
- [ ] Network 中 /api/airport/list 返回 200
- [ ] Response 是 JSON 格式
- [ ] Response 包含 success: true
- [ ] Response.data 是数组
- [ ] Console 显示 "机场数量: 10"
- [ ] 下拉框显示城市列表

---

## 🎯 下一步

1. **完全停止服务器** (Ctrl+C)
2. **删除缓存** `rmdir /s /q node_modules\.vite`
3. **重新启动** `npm run dev`
4. **查看终端日志** - 确认有 "=== Vite 配置 ===" 和 "[vite:mock]"
5. **刷新浏览器** (Ctrl+Shift+R)
6. **查看 Console** - 应该看到 JSON 响应而不是 HTML

---

**关键:** 如果终端启动时没有显示 "=== Vite 配置 ===" 日志，说明配置文件有问题！
