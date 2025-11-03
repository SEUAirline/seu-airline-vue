# SEUAirline 航班预订消息系统开发计划

**日期:** 2025-11-03  
**开发阶段:** 第三阶段 - 消息通知系统  
**预计完成时间:** 2025-11-18 (约2-2.5周)

---

## 📊 当前项目状态总结

### ✅ 已完成功能
1. **基础架构** (100%)
   - Vue3 + TypeScript + Vite 项目
   - Pinia 状态管理
   - Vue Router 路由系统
   - Mock 数据系统

2. **用户端核心功能** (约60%)
   - 首页 ✅
   - 登录/注册 ✅
   - 航班搜索与筛选 ✅
   - 航班详情模态框 ✅
   - 热门航线推荐 ✅

3. **后端API** (已完成)
   - Spring Boot 后端
   - MySQL + Redis
   - JWT 认证
   - 完整的航班、订单、用户 API

### ⚠️ 待完成功能
- 航班预订页面 (部分完成)
- 支付流程
- 订单管理
- **消息通知系统** ⭐ (本次重点)

---

## 🎯 消息系统开发目标

### 核心功能
1. **站内消息通知**
   - 订单状态变更通知
   - 航班动态通知(延误、取消、登机口变更)
   - 系统公告
   - 促销活动通知

2. **实时消息推送**
   - WebSocket 实时通信
   - 消息未读数提醒
   - 消息列表展示
   - 消息详情查看

3. **消息管理**
   - 标记已读/未读
   - 删除消息
   - 消息分类筛选
   - 消息搜索

---

## 📋 详细开发计划

### 第一阶段: 后端消息系统 (预计 3-4 天)

#### 任务 1.1: 数据库设计
**文件:** `seu-airline-backend/src/main/resources/db/migration/V3__create_message_tables.sql`

**数据表设计:**

```sql
-- 消息表
CREATE TABLE `message` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '接收用户ID',
  `title` VARCHAR(100) NOT NULL COMMENT '消息标题',
  `content` TEXT NOT NULL COMMENT '消息内容',
  `type` VARCHAR(20) NOT NULL COMMENT '消息类型: ORDER/FLIGHT/SYSTEM/PROMOTION',
  `related_id` BIGINT COMMENT '关联ID(订单ID/航班ID等)',
  `is_read` TINYINT DEFAULT 0 COMMENT '是否已读: 0未读 1已读',
  `priority` TINYINT DEFAULT 1 COMMENT '优先级: 1普通 2重要 3紧急',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `read_time` DATETIME COMMENT '阅读时间',
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_create_time (create_time),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

-- 系统公告表
CREATE TABLE `announcement` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `content` TEXT NOT NULL,
  `type` VARCHAR(20) NOT NULL COMMENT 'MAINTENANCE/PROMOTION/NOTICE',
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `status` TINYINT DEFAULT 1 COMMENT '1启用 0禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_time (start_time, end_time)
);
```

**预计时间:** 0.5天

#### 任务 1.2: 后端实体类和 DTO
**文件:** 
- `model/Message.java`
- `model/Announcement.java`
- `dto/MessageDTO.java`
- `dto/MessageCreateRequest.java`

**核心字段:**
```java
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private String title;
    private String content;
    
    @Enumerated(EnumType.STRING)
    private MessageType type; // ORDER, FLIGHT, SYSTEM, PROMOTION
    
    private Long relatedId;
    private Boolean isRead = false;
    private Integer priority = 1;
    
    private LocalDateTime createTime;
    private LocalDateTime readTime;
}
```

**预计时间:** 0.5天

#### 任务 1.3: Repository 层
**文件:** 
- `repository/MessageRepository.java`
- `repository/AnnouncementRepository.java`

**核心方法:**
```java
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByUserIdOrderByCreateTimeDesc(Long userId);
    Long countByUserIdAndIsRead(Long userId, Boolean isRead);
    List<Message> findByUserIdAndType(Long userId, MessageType type);
    void deleteByUserIdAndId(Long userId, Long id);
}
```

**预计时间:** 0.5天

#### 任务 1.4: Service 层
**文件:** `service/MessageService.java`

**核心功能:**
```java
public interface MessageService {
    // 创建消息
    Message createMessage(Long userId, String title, String content, MessageType type, Long relatedId);
    
    // 获取用户消息列表
    List<MessageDTO> getUserMessages(Long userId, MessageType type, Boolean isRead);
    
    // 获取未读消息数
    Long getUnreadCount(Long userId);
    
    // 标记已读
    void markAsRead(Long userId, Long messageId);
    void markAllAsRead(Long userId);
    
    // 删除消息
    void deleteMessage(Long userId, Long messageId);
    
    // 系统消息推送
    void sendOrderStatusMessage(Long userId, Long orderId, String status);
    void sendFlightUpdateMessage(Long userId, Long flightId, String updateType);
}
```

**预计时间:** 1天

#### 任务 1.5: Controller 层
**文件:** `controller/MessageController.java`

**API 接口设计:**
```java
@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    // 获取消息列表
    @GetMapping
    public ApiResponse<List<MessageDTO>> getMessages(
        @RequestParam(required = false) String type,
        @RequestParam(required = false) Boolean isRead
    );
    
    // 获取未读数
    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount();
    
    // 获取消息详情
    @GetMapping("/{id}")
    public ApiResponse<MessageDTO> getMessageDetail(@PathVariable Long id);
    
    // 标记已读
    @PutMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(@PathVariable Long id);
    
    // 全部标记已读
    @PutMapping("/read-all")
    public ApiResponse<Void> markAllAsRead();
    
    // 删除消息
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteMessage(@PathVariable Long id);
}
```

**预计时间:** 1天

#### 任务 1.6: WebSocket 实时推送
**文件:** 
- `config/WebSocketConfig.java`
- `controller/MessageWebSocketController.java`

**功能:**
- 建立 WebSocket 连接
- 实时推送新消息
- 心跳保活机制

**预计时间:** 1天

---

### 第二阶段: 前端消息系统 (预计 3-4 天)

#### 任务 2.1: TypeScript 类型定义
**文件:** `src/types/message.ts`

```typescript
export interface Message {
  id: number
  userId: number
  title: string
  content: string
  type: MessageType
  relatedId?: number
  isRead: boolean
  priority: number
  createTime: string
  readTime?: string
}

export enum MessageType {
  ORDER = 'ORDER',
  FLIGHT = 'FLIGHT',
  SYSTEM = 'SYSTEM',
  PROMOTION = 'PROMOTION'
}

export interface MessageFilter {
  type?: MessageType
  isRead?: boolean
}
```

**预计时间:** 0.5天

#### 任务 2.2: API 接口层
**文件:** `src/api/message.ts`

```typescript
export const messageApi = {
  // 获取消息列表
  getMessages: (params?: MessageFilter) => 
    client.get<Message[]>('/api/messages', { params }),
  
  // 获取未读数
  getUnreadCount: () => 
    client.get<number>('/api/messages/unread-count'),
  
  // 获取消息详情
  getMessageDetail: (id: number) => 
    client.get<Message>(`/api/messages/${id}`),
  
  // 标记已读
  markAsRead: (id: number) => 
    client.put(`/api/messages/${id}/read`),
  
  // 全部标记已读
  markAllAsRead: () => 
    client.put('/api/messages/read-all'),
  
  // 删除消息
  deleteMessage: (id: number) => 
    client.delete(`/api/messages/${id}`)
}
```

**预计时间:** 0.5天

#### 任务 2.3: Pinia Store
**文件:** `src/stores/message.ts`

```typescript
export const useMessageStore = defineStore('message', () => {
  const messages = ref<Message[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)
  
  // 获取消息列表
  const fetchMessages = async (filter?: MessageFilter) => {
    loading.value = true
    try {
      const res = await messageApi.getMessages(filter)
      messages.value = res.data
    } finally {
      loading.value = false
    }
  }
  
  // 获取未读数
  const fetchUnreadCount = async () => {
    const res = await messageApi.getUnreadCount()
    unreadCount.value = res.data
  }
  
  // 标记已读
  const markAsRead = async (id: number) => {
    await messageApi.markAsRead(id)
    const msg = messages.value.find(m => m.id === id)
    if (msg) msg.isRead = true
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }
  
  // WebSocket 连接
  const connectWebSocket = () => {
    // WebSocket 实现
  }
  
  return {
    messages,
    unreadCount,
    loading,
    fetchMessages,
    fetchUnreadCount,
    markAsRead,
    connectWebSocket
  }
})
```

**预计时间:** 1天

#### 任务 2.4: 消息中心页面
**文件:** `src/views/user/MessageCenterPage.vue`

**功能需求:**
- 消息列表展示
- 消息类型筛选(全部/订单/航班/系统/促销)
- 已读/未读筛选
- 消息详情查看
- 标记已读/全部已读
- 删除消息
- 空状态提示
- 分页加载

**UI 设计:**
- 左侧筛选栏
- 右侧消息列表
- 消息卡片(标题、内容摘要、时间、未读标记)
- 响应式布局

**预计时间:** 1.5天

#### 任务 2.5: 消息通知组件
**文件:** `src/components/MessageNotification.vue`

**功能需求:**
- 顶部导航栏消息图标
- 未读数红点提示
- 点击显示消息下拉框
- 显示最近5条消息
- 快速标记已读
- 跳转到消息中心

**预计时间:** 1天

#### 任务 2.6: 消息详情模态框
**文件:** `src/components/MessageDetailModal.vue`

**功能需求:**
- 完整消息内容展示
- 消息类型图标
- 时间显示
- 相关链接(订单详情/航班详情)
- 标记已读
- 删除按钮

**预计时间:** 0.5天

---

### 第三阶段: 消息触发集成 (预计 2 天)

#### 任务 3.1: 订单状态变更消息
**修改文件:** `seu-airline-backend/service/OrderService.java`

**触发场景:**
- 订单创建成功
- 支付成功
- 订单取消
- 退款成功

```java
@Transactional
public Order createOrder(OrderCreateRequest request) {
    Order order = // ... 创建订单逻辑
    
    // 发送消息通知
    messageService.sendOrderStatusMessage(
        order.getUserId(),
        order.getId(),
        "ORDER_CREATED"
    );
    
    return order;
}
```

**预计时间:** 0.5天

#### 任务 3.2: 航班动态消息
**修改文件:** `seu-airline-backend/service/FlightService.java`

**触发场景:**
- 航班延误
- 航班取消
- 登机口变更
- 航班恢复正常

**预计时间:** 0.5天

#### 任务 3.3: 前端消息轮询/WebSocket
**修改文件:** `src/App.vue`

**功能:**
- 用户登录后启动消息轮询(每30秒)或建立WebSocket连接
- 收到新消息时更新未读数
- 显示Toast提示
- 播放提示音(可选)

**预计时间:** 1天

---

### 第四阶段: 测试与优化 (预计 1-2 天)

#### 任务 4.1: 功能测试
- [ ] 消息创建和推送
- [ ] 消息列表展示
- [ ] 筛选和搜索
- [ ] 标记已读/未读
- [ ] 删除消息
- [ ] 未读数更新
- [ ] WebSocket 实时推送

#### 任务 4.2: 性能优化
- [ ] 消息列表虚拟滚动
- [ ] 消息缓存策略
- [ ] WebSocket 断线重连
- [ ] 消息去重

#### 任务 4.3: UI/UX 优化
- [ ] 加载动画
- [ ] 骨架屏
- [ ] 错误提示
- [ ] 响应式适配

**预计时间:** 1-2天

---

## 📊 开发时间表

| 阶段 | 任务 | 预计时间 | 累计时间 |
|------|------|----------|----------|
| 阶段一 | 后端消息系统 | 3-4天 | 3-4天 |
| 阶段二 | 前端消息系统 | 3-4天 | 6-8天 |
| 阶段三 | 消息触发集成 | 2天 | 8-10天 |
| 阶段四 | 测试与优化 | 1-2天 | 9-12天 |

**总计:** 约 **9-12 个工作日** (2-2.5周)

---

## 🎯 里程碑

### 里程碑 1: 后端基础完成 (第4天)
- ✅ 数据库表创建
- ✅ 基础 CRUD API 完成
- ✅ 可通过 Postman 测试

### 里程碑 2: 前端基础完成 (第8天)
- ✅ 消息中心页面完成
- ✅ 消息通知组件完成
- ✅ 可手动创建和查看消息

### 里程碑 3: 系统集成完成 (第10天)
- ✅ 订单/航班消息自动触发
- ✅ 实时推送功能正常
- ✅ 完整流程可演示

### 里程碑 4: 测试优化完成 (第12天)
- ✅ 所有功能测试通过
- ✅ 性能优化完成
- ✅ 可上线部署

---

## 🔧 技术选型

### 后端技术
- **Spring Boot** - 主框架
- **Spring WebSocket** - 实时推送
- **MySQL** - 消息存储
- **Redis** - 消息缓存和未读数计数

### 前端技术
- **Vue 3** - 前端框架
- **Pinia** - 状态管理
- **WebSocket API** - 实时通信
- **Tailwind CSS** - UI 样式

---

## 📝 开发建议

### 开发顺序
1. **先后端后前端** - 确保 API 稳定
2. **先核心后扩展** - 优先实现基础消息功能
3. **先功能后优化** - 功能完成后再优化性能

### 代码规范
- 遵循现有项目的代码风格
- 添加完整的注释和文档
- 编写单元测试(可选但推荐)

### 测试策略
- 使用 Mock 数据进行前端开发
- 后端完成后进行联调
- 编写自动化测试用例

---

## 🚀 后续扩展功能

### 短期扩展 (1-2周)
- [ ] 消息模板管理
- [ ] 批量消息推送
- [ ] 消息统计报表
- [ ] 邮件/短信通知

### 中期扩展 (1-2月)
- [ ] 个性化推送策略
- [ ] 消息推送规则引擎
- [ ] A/B 测试功能
- [ ] 用户偏好设置

### 长期扩展 (3月+)
- [ ] AI 智能推荐
- [ ] 多语言支持
- [ ] 富文本消息
- [ ] 消息归档和导出

---

## 📞 技术支持

如遇到问题,可以参考:
1. Spring WebSocket 官方文档
2. Vue 3 Composition API 文档
3. WebSocket MDN 文档
4. 项目现有的 API 设计规范

---

**文档创建时间:** 2025-11-03  
**预计开始时间:** 2025-11-04  
**预计完成时间:** 2025-11-18

---

## 📋 开发进度追踪

### 第一阶段: 后端消息系统
- [ ] 任务 1.1: 数据库设计
- [ ] 任务 1.2: 后端实体类和 DTO
- [ ] 任务 1.3: Repository 层
- [ ] 任务 1.4: Service 层
- [ ] 任务 1.5: Controller 层
- [ ] 任务 1.6: WebSocket 实时推送

### 第二阶段: 前端消息系统
- [x] 任务 2.1: TypeScript 类型定义 ✅
- [x] 任务 2.2: API 接口层 ✅
- [x] 任务 2.3: Pinia Store ✅
- [x] 任务 2.4: 消息中心页面 ✅
- [x] 任务 2.5: 消息通知组件 ✅
- [ ] 任务 2.6: 消息详情模态框 (可选)

### 第三阶段: 消息触发集成
- [ ] 任务 3.1: 订单状态变更消息
- [ ] 任务 3.2: 航班动态消息
- [ ] 任务 3.3: 前端消息轮询/WebSocket

### 第四阶段: 测试与优化
- [ ] 任务 4.1: 功能测试
- [ ] 任务 4.2: 性能优化
- [ ] 任务 4.3: UI/UX 优化
