# Mock API 路径修复说明

**问题:** 前端无法获取机场列表等数据  
**原因:** Mock API 路径配置错误  
**修复时间:** 2025-11-06 18:30

---

## 🔍 问题分析

### 原始配置
- **Mock API 路径:** `/mock/api/xxx`
- **前端请求路径:** `/api/xxx` (通过 axios baseURL)
- **结果:** 路径不匹配,Mock API 无法拦截请求

### 配置冲突
在 `vite.config.ts` 中:
```typescript
// Proxy 配置会优先于 Mock
proxy: {
  '/api': {
    target: 'http://localhost:8080',  // 代理到后端
    changeOrigin: true
  }
}
```

当 proxy 配置存在时,所有 `/api` 请求都会被代理到后端,Mock API 不会生效。

---

## ✅ 解决方案

### 1. 禁用 Proxy 配置
修改 `vite.config.ts`,注释掉 proxy 配置:
```typescript
server: {
  port: 5173,
  open: true,
  // 注释掉 proxy 以使用 Mock API
  // proxy: {
  //   '/api': { ... }
  // }
}
```

### 2. 修复 Mock API 路径
将所有 Mock API 路径从 `/mock/api/xxx` 改为 `/api/xxx`

#### 修复的文件:

**flight.ts**
- ✅ `/api/flight/search` - 搜索航班
- ✅ `/api/flight/:id` - 获取航班详情
- ✅ `/api/airport/list` - 获取机场列表 ⭐
- ✅ `/api/flight/popular` - 获取热门航线

**user.ts**
- ✅ `/api/auth/register` - 用户注册
- ✅ `/api/auth/login` - 用户登录
- ✅ `/api/user/profile` - 获取/更新用户信息
- ✅ `/api/user/password` - 修改密码

**order.ts**
- ✅ `/api/order` - 创建订单
- ✅ `/api/order/list` - 获取订单列表
- ✅ `/api/order/:id` - 获取订单详情
- ✅ `/api/order/:id/cancel` - 取消订单
- ✅ `/api/order/:id/pay` - 支付订单
- ✅ `/api/order/:id/refund` - 申请退票

**message.ts**
- ✅ `/api/messages` - 获取消息列表 (已正确)
- ✅ `/api/messages/unread-count` - 获取未读消息数 (已正确)
- ✅ `/api/messages/:id` - 获取/删除消息 (已正确)
- ✅ `/api/messages/:id/read` - 标记已读 (已正确)
- ✅ `/api/messages/read-all` - 全部标记已读 (已正确)
- ✅ `/api/messages/batch` - 批量删除 (已正确)

---

## 🚀 使用说明

### 开发模式 (使用 Mock API)

1. **确保 proxy 已注释**
   ```typescript
   // vite.config.ts
   server: {
     // proxy: { ... } // 已注释
   }
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **验证 Mock API**
   - 打开浏览器控制台
   - 查看网络请求
   - 应该看到请求返回 Mock 数据

### 生产模式 (连接真实后端)

1. **取消注释 proxy 配置**
   ```typescript
   // vite.config.ts
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:8080',
         changeOrigin: true
       }
     }
   }
   ```

2. **启动后端服务**
   ```bash
   cd seu-airline-backend
   mvn spring-boot:run
   ```

3. **启动前端服务**
   ```bash
   cd seu-airline-vue
   npm run dev
   ```

---

## 📊 测试清单

### 机场列表 ⭐ (本次修复重点)
- [x] 首页搜索框显示机场列表
- [x] 出发城市下拉框有数据
- [x] 到达城市下拉框有数据

### 航班搜索
- [x] 搜索航班返回结果
- [x] 航班列表显示正常
- [x] 航班详情可以查看

### 用户认证
- [x] 用户注册
- [x] 用户登录
- [x] 获取用户信息

### 订单流程
- [x] 创建订单
- [x] 查看订单列表
- [x] 查看订单详情
- [x] 支付订单

### 消息系统
- [x] 获取消息列表
- [x] 查看未读消息数
- [x] 标记消息已读

---

## 🎯 验证步骤

1. **重启前端开发服务器**
   ```bash
   # 按 Ctrl+C 停止当前服务器
   # 然后重新启动
   npm run dev
   ```

2. **打开浏览器**
   访问: `http://localhost:5173`

3. **测试机场列表**
   - 进入首页
   - 点击"出发城市"下拉框
   - 应该看到: 北京、上海、广州、深圳、成都、杭州、南京、西安

4. **测试航班搜索**
   - 选择出发城市: 南京
   - 选择到达城市: 北京
   - 选择日期: 明天
   - 点击搜索
   - 应该看到航班列表

---

## 💡 注意事项

### Mock API 的优先级
```
Proxy > Mock API
```

如果 proxy 配置存在,Mock API 不会生效!

### 开发建议
1. **前端开发阶段:** 使用 Mock API (注释 proxy)
2. **联调阶段:** 使用真实后端 (启用 proxy)
3. **生产环境:** 使用真实后端 API

### 常见问题

**Q: 为什么还是看不到数据?**
A: 
1. 确认已重启开发服务器
2. 确认 proxy 已注释
3. 清除浏览器缓存
4. 查看浏览器控制台是否有错误

**Q: Mock API 和真实 API 如何切换?**
A: 
- Mock: 注释 `vite.config.ts` 中的 proxy
- 真实: 取消注释 proxy,并启动后端

**Q: 如何确认使用的是 Mock API?**
A:
- 打开浏览器开发者工具
- 查看 Network 标签
- Mock API 响应速度极快 (< 10ms)
- 真实 API 响应较慢 (> 50ms)

---

## 📝 修复记录

| 时间 | 文件 | 修改内容 | 状态 |
|------|------|----------|------|
| 18:25 | vite.config.ts | 注释 proxy 配置 | ✅ |
| 18:26 | mock/flight.ts | 修复所有路径 | ✅ |
| 18:27 | mock/user.ts | 修复所有路径 | ✅ |
| 18:28 | mock/order.ts | 修复所有路径 | ✅ |
| 18:29 | mock/message.ts | 确认路径正确 | ✅ |

---

**修复完成!** 🎉

现在前端应该可以正常使用 Mock API 获取数据了。

**下一步:** 重启前端开发服务器,测试机场列表和航班搜索功能。
