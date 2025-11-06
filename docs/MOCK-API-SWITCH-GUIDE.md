# Mock API 环境切换指南

**功能:** 通过环境变量控制 Mock API 开关，避免前后端接入时的路径混淆  
**创建时间:** 2025-11-06 20:32

---

## 🎯 设计目标

1. **前端独立开发** - 使用 Mock API，无需后端
2. **前后端联调** - 一键切换到真实后端
3. **避免路径混淆** - 统一使用 `/api` 路径
4. **环境隔离** - 开发/生产环境自动切换

---

## 📁 配置文件

### 1. 开发环境配置 (`.env.development`)

```env
# 开发环境配置
VITE_APP_TITLE=SEUAirline航空预订系统
VITE_APP_BASE_API=/api
VITE_APP_MODE=development

# Mock API 开关
# true: 使用 Mock API (前端独立开发)
# false: 连接真实后端 (需要启动后端服务)
VITE_USE_MOCK=true
```

### 2. 生产环境配置 (`.env.production`)

```env
# 生产环境配置
VITE_APP_TITLE=SEUAirline航空预订系统
VITE_APP_BASE_API=/api
VITE_APP_MODE=production

# Mock API 开关 (生产环境必须关闭)
VITE_USE_MOCK=false
```

---

## 🔧 Vite 配置

### `vite.config.ts`

```typescript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  const useMock = env.VITE_USE_MOCK === 'true'

  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        enable: useMock, // 根据环境变量控制是否启用 Mock
        logger: true // 显示 Mock 日志
      })
    ],
    server: {
      port: 5173,
      open: true,
      // 根据 Mock 开关决定是否启用 proxy
      // 当 VITE_USE_MOCK=false 时，需要启用 proxy 连接后端
      proxy: useMock ? undefined : {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    }
  }
})
```

---

## 🚀 使用方法

### 方式1: 修改环境变量文件 (推荐)

#### 使用 Mock API (前端独立开发)

**修改 `.env.development`:**
```env
VITE_USE_MOCK=true
```

**启动:**
```bash
npm run dev
```

**效果:**
- ✅ Mock API 启用
- ✅ 所有 `/api` 请求被 Mock 拦截
- ✅ 无需启动后端
- ✅ 控制台显示 Mock 日志

---

#### 连接真实后端 (前后端联调)

**修改 `.env.development`:**
```env
VITE_USE_MOCK=false
```

**启动后端:**
```bash
cd seu-airline-backend
mvn spring-boot:run
```

**启动前端:**
```bash
npm run dev
```

**效果:**
- ✅ Mock API 禁用
- ✅ Proxy 启用，请求转发到 `http://localhost:8080`
- ✅ 连接真实后端 API
- ✅ 可以测试真实数据

---

### 方式2: 命令行参数 (临时切换)

#### 使用 Mock API
```bash
npm run dev
```

#### 连接真实后端
```bash
# 创建临时环境变量
set VITE_USE_MOCK=false && npm run dev

# 或使用 cross-env (需要安装)
npx cross-env VITE_USE_MOCK=false npm run dev
```

---

## 📊 工作原理

### Mock API 启用时 (VITE_USE_MOCK=true)

```
前端请求 → /api/xxx
    ↓
Mock 插件拦截
    ↓
返回 Mock 数据
```

**特点:**
- Mock 插件启用
- Proxy 禁用
- 请求不会发送到后端
- 数据来自 `mock/` 目录

---

### Mock API 禁用时 (VITE_USE_MOCK=false)

```
前端请求 → /api/xxx
    ↓
Proxy 转发
    ↓
http://localhost:8080/api/xxx
    ↓
后端处理
    ↓
返回真实数据
```

**特点:**
- Mock 插件禁用
- Proxy 启用
- 请求转发到后端
- 数据来自真实后端

---

## 🎯 使用场景

### 场景1: 前端独立开发 ✅

**配置:**
```env
VITE_USE_MOCK=true
```

**适用于:**
- 后端接口未完成
- 前端独立开发和调试
- UI/UX 开发和测试
- 演示和原型展示

**优点:**
- 无需启动后端
- 开发速度快
- 数据可控
- 不受后端影响

---

### 场景2: 前后端联调 ✅

**配置:**
```env
VITE_USE_MOCK=false
```

**适用于:**
- 后端接口已完成
- 联调测试
- 集成测试
- 真实数据验证

**优点:**
- 测试真实接口
- 验证数据格式
- 发现集成问题
- 完整流程测试

---

### 场景3: 生产部署 ✅

**配置:**
```env
VITE_USE_MOCK=false
```

**要求:**
- 必须连接真实后端
- Mock 必须禁用
- 数据必须真实

---

## 🔍 验证方法

### 如何确认当前使用的是 Mock API？

#### 方法1: 查看控制台日志

**Mock API 启用时:**
```
[vite:mock] mock file change C:\...\mock\flight.ts
```

**Mock API 禁用时:**
```
(无 Mock 相关日志)
```

---

#### 方法2: 查看网络请求

**打开浏览器开发者工具 → Network:**

**Mock API:**
- 响应速度极快 (< 10ms)
- 没有实际网络请求
- 数据固定

**真实 API:**
- 响应速度较慢 (> 50ms)
- 有实际网络请求
- 数据动态

---

#### 方法3: 查看响应数据

**Mock API 返回的数据:**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "flightNo": "CA1234",  // 固定数据
    "airline": "中国国际航空"
  },
  "success": true
}
```

**真实 API 返回的数据:**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "flightNo": "MU5678",  // 真实数据
    "airline": "中国东方航空"
  },
  "success": true
}
```

---

## 💡 最佳实践

### 1. 开发阶段

```env
# .env.development
VITE_USE_MOCK=true
```

**建议:**
- 使用 Mock API 进行快速开发
- 专注于前端逻辑和 UI
- 不依赖后端进度

---

### 2. 联调阶段

```env
# .env.development
VITE_USE_MOCK=false
```

**建议:**
- 切换到真实后端
- 验证接口对接
- 测试完整流程
- 发现和修复问题

---

### 3. 提交代码前

**检查清单:**
- [ ] `.env.development` 中 `VITE_USE_MOCK=true` (默认使用 Mock)
- [ ] `.env.production` 中 `VITE_USE_MOCK=false` (生产必须禁用)
- [ ] 代码中没有硬编码的 Mock 开关
- [ ] 文档已更新

---

### 4. 生产部署

```env
# .env.production
VITE_USE_MOCK=false
```

**要求:**
- 必须禁用 Mock
- 必须连接真实后端
- 必须通过完整测试

---

## 🚨 注意事项

### 1. 路径统一

**✅ 正确:**
```typescript
// Mock API 和真实 API 使用相同路径
Mock: /api/flight/search
Real: /api/flight/search
```

**❌ 错误:**
```typescript
// 不要使用不同的路径
Mock: /mock/api/flight/search
Real: /api/flight/search
```

---

### 2. 环境变量优先级

```
命令行参数 > .env.local > .env.[mode] > .env
```

**建议:**
- 使用 `.env.development` 和 `.env.production`
- 不要在代码中硬编码
- 不要提交 `.env.local` 到版本控制

---

### 3. Mock 数据维护

**建议:**
- 保持 Mock 数据与真实 API 格式一致
- 定期更新 Mock 数据
- 添加各种边界情况的 Mock
- 文档化 Mock API

---

### 4. 团队协作

**建议:**
- 团队统一使用 Mock 进行开发
- 联调时统一切换到真实后端
- 在文档中说明切换方法
- 代码审查时检查环境配置

---

## 📝 常见问题

### Q1: 如何快速切换 Mock 开关？

**A:** 修改 `.env.development` 文件中的 `VITE_USE_MOCK` 值，然后重启开发服务器。

```env
# 使用 Mock
VITE_USE_MOCK=true

# 使用真实后端
VITE_USE_MOCK=false
```

---

### Q2: 为什么修改了环境变量但没有生效？

**A:** 需要重启开发服务器。环境变量在服务器启动时加载。

```bash
# 停止服务器 (Ctrl+C)
# 重新启动
npm run dev
```

---

### Q3: 如何确认当前使用的是哪种模式？

**A:** 查看控制台日志或网络请求。Mock API 响应极快且有 Mock 日志。

---

### Q4: 生产环境能使用 Mock API 吗？

**A:** 不能！生产环境必须禁用 Mock，连接真实后端。

```env
# .env.production
VITE_USE_MOCK=false  # 必须是 false
```

---

### Q5: Mock API 和真实 API 路径不一致怎么办？

**A:** 不应该出现这种情况。我们的设计就是让两者使用相同的路径 `/api/xxx`，通过环境变量控制使用哪个。

---

## 🎉 优势总结

### 相比修改路径的方案

| 特性 | 环境变量方案 ✅ | 修改路径方案 ❌ |
|------|----------------|----------------|
| 路径统一 | `/api/xxx` | `/mock/api/xxx` vs `/api/xxx` |
| 切换方式 | 修改环境变量 | 修改代码 |
| 代码改动 | 无需改动 | 需要改动所有 API 调用 |
| 维护成本 | 低 | 高 |
| 出错风险 | 低 | 高 (容易遗漏) |
| 团队协作 | 简单 | 复杂 |

---

## 📚 相关文档

1. `TESTING-GUIDE.md` - 测试指南
2. `MOCK-API-FIX.md` - Mock API 路径修复
3. `API-CLIENT-FIX.md` - API 客户端修复

---

**配置完成!** 🎉

现在您可以通过简单修改环境变量来切换 Mock API 和真实后端，无需担心路径混淆问题。

**推荐工作流程:**
1. 开发阶段: `VITE_USE_MOCK=true` (使用 Mock)
2. 联调阶段: `VITE_USE_MOCK=false` (连接后端)
3. 提交代码: 确保 `.env.development` 中 `VITE_USE_MOCK=true`
4. 生产部署: 确保 `.env.production` 中 `VITE_USE_MOCK=false`
