# Token 过期自动处理功能说明

## 功能概述

当用户的登录 Token 过期时，系统会自动：
1. 检测到 Token 过期（后端返回 401 状态码）
2. 弹出友好的提示弹窗："登录已过期"
3. 自动清除本地存储的登录信息
4. **不会自动跳转到登录页**（用户可以继续浏览无需登录的页面）

## 实现细节

### 后端修改

#### 1. 新增 `AuthEntryPointJwt.java`
- 位置: `seu-airline-backend/src/main/java/com/seu/airline/security/AuthEntryPointJwt.java`
- 功能: 统一处理 401 认证失败响应
- 返回格式:
```json
{
  "success": false,
  "code": 401,
  "message": "登录已过期，请重新登录",
  "data": null,
  "tokenExpired": true
}
```

#### 2. 更新 `AuthTokenFilter.java`
- 改进 Token 验证失败的处理
- 在 request 中添加 `tokenExpired` 属性标记

#### 3. 更新 `WebSecurityConfig.java`
- 注入 `AuthEntryPointJwt`
- 配置异常处理入口点: `.exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))`

### 前端修改

#### 1. 更新 `client.ts` (axios 拦截器)
- 响应拦截器增强 401 错误处理
- 检测 `tokenExpired` 标识
- 发送自定义事件 `token-expired`
- 清除所有认证信息（包括普通用户和管理员）

```typescript
case 401:
  const tokenExpired = data?.tokenExpired || false
  
  // 清除所有认证信息
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('adminToken')
  localStorage.removeItem('currentAdmin')
  
  if (tokenExpired) {
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('token-expired', {
      detail: { message: '登录已过期，请重新登录' }
    }))
  }
```

#### 2. 更新 `App.vue`
- 添加全局事件监听器监听 `token-expired` 事件
- 显示美观的弹窗提示
- 调用用户 store 的 logout 方法清除状态
- 弹窗样式：带图标、圆角、阴影的模态框

## 用户体验流程

1. **正常使用中 Token 过期**
   ```
   用户操作 → API 请求 → Token 验证失败 
   → 后端返回 401 with tokenExpired=true
   → 前端拦截器捕获
   → 清除本地数据
   → 触发 token-expired 事件
   → 显示弹窗："登录已过期，请重新登录"
   → 用户点击"我知道了"
   → 弹窗关闭
   → 用户继续浏览公开页面或选择重新登录
   ```

2. **页面刷新时检测 Token 过期**
   - 如果刷新时 Token 已过期，首次需要认证的 API 调用会触发过期流程
   - 弹窗会立即显示

3. **无需登录的页面**
   - 用户可以继续访问公开页面（机场列表、航班搜索等）
   - 不会被强制跳转到登录页

## 测试方法

### 方法 1: 修改 Token 过期时间（推荐）
1. 修改 `application.yml` 中的 `jwt.expiration` 为较短时间（如 30000 = 30秒）
2. 重启后端服务
3. 登录系统
4. 等待 30 秒后执行任何需要认证的操作
5. 观察弹窗是否正常显示

### 方法 2: 手动清除 Redis 中的 Token
1. 登录系统
2. 在 Redis 中找到对应的 token key: `jwt:token:{username}`
3. 删除该 key
4. 在前端执行需要认证的操作
5. 观察弹窗是否正常显示

### 方法 3: 修改本地存储的 Token
1. 登录系统
2. 打开浏览器开发者工具
3. 在 Application → Local Storage 中修改 `token` 的值为无效值
4. 刷新页面或执行需要认证的操作
5. 观察弹窗是否正常显示

## 注意事项

1. **Token 验证优先级**
   - 后端会先验证 JWT 签名
   - 再检查 Redis 黑名单
   - 最后验证 Redis 中是否存在有效 token

2. **清除范围**
   - 同时清除普通用户 token (`token`, `user`)
   - 同时清除管理员 token (`adminToken`, `currentAdmin`)

3. **不影响公开接口**
   - 机场查询 (`/airport/**`)
   - 航班查询 (`/flight/**`)
   - 认证接口 (`/auth/**`)
   - 这些接口不需要 token，不会触发过期检测

4. **跨页面通知**
   - 使用 window 自定义事件实现跨组件通信
   - 避免组件间的紧耦合

## 相关文件

### 后端
- `AuthEntryPointJwt.java` - 新增
- `AuthTokenFilter.java` - 已修改
- `WebSecurityConfig.java` - 已修改
- `JwtUtils.java` - 无需修改（已有完善的验证逻辑）

### 前端
- `src/api/client.ts` - 已修改（axios 拦截器）
- `src/App.vue` - 已修改（全局弹窗）
- `src/stores/user.ts` - 无需修改（已有 logout 方法）
- `src/stores/admin.ts` - 无需修改（已有 logout 方法）

## 扩展功能建议

1. **自动刷新 Token**
   - 在 Token 快要过期前自动刷新
   - 可在响应拦截器中检查过期时间

2. **过期倒计时提醒**
   - Token 即将过期时显示倒计时
   - 用户可选择续期

3. **记住登录状态**
   - 过期后自动跳转到登录页
   - 登录成功后返回之前页面

4. **多 Tab 同步**
   - 使用 localStorage 事件监听
   - 一个 Tab 过期，其他 Tab 同步退出
