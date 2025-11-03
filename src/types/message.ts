/**
 * 消息系统类型定义
 * @description 定义消息相关的TypeScript类型和接口
 */

/**
 * 消息类型枚举
 */
export enum MessageType {
  /** 订单相关消息 */
  ORDER = 'ORDER',
  /** 航班相关消息 */
  FLIGHT = 'FLIGHT',
  /** 系统消息 */
  SYSTEM = 'SYSTEM',
  /** 促销活动消息 */
  PROMOTION = 'PROMOTION'
}

/**
 * 消息优先级枚举
 */
export enum MessagePriority {
  /** 普通消息 */
  NORMAL = 1,
  /** 重要消息 */
  IMPORTANT = 2,
  /** 紧急消息 */
  URGENT = 3
}

/**
 * 消息接口
 */
export interface Message {
  /** 消息ID */
  id: number
  /** 接收用户ID */
  userId: number
  /** 消息标题 */
  title: string
  /** 消息内容 */
  content: string
  /** 消息类型 */
  type: MessageType
  /** 关联ID(订单ID/航班ID等) */
  relatedId?: number
  /** 是否已读 */
  isRead: boolean
  /** 优先级 */
  priority: MessagePriority
  /** 创建时间 */
  createTime: string
  /** 阅读时间 */
  readTime?: string
}

/**
 * 消息筛选条件
 */
export interface MessageFilter {
  /** 消息类型筛选 */
  type?: MessageType
  /** 已读/未读筛选 */
  isRead?: boolean
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 消息列表响应
 */
export interface MessageListResponse {
  /** 消息列表 */
  list: Message[]
  /** 总数 */
  total: number
  /** 当前页 */
  page: number
  /** 每页数量 */
  pageSize: number
}

/**
 * 创建消息请求
 */
export interface MessageCreateRequest {
  /** 接收用户ID */
  userId: number
  /** 消息标题 */
  title: string
  /** 消息内容 */
  content: string
  /** 消息类型 */
  type: MessageType
  /** 关联ID */
  relatedId?: number
  /** 优先级 */
  priority?: MessagePriority
}

/**
 * 系统公告类型枚举
 */
export enum AnnouncementType {
  /** 系统维护 */
  MAINTENANCE = 'MAINTENANCE',
  /** 促销活动 */
  PROMOTION = 'PROMOTION',
  /** 通知公告 */
  NOTICE = 'NOTICE'
}

/**
 * 系统公告接口
 */
export interface Announcement {
  /** 公告ID */
  id: number
  /** 公告标题 */
  title: string
  /** 公告内容 */
  content: string
  /** 公告类型 */
  type: AnnouncementType
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 状态: 1启用 0禁用 */
  status: number
  /** 创建时间 */
  createTime: string
}

/**
 * WebSocket 消息
 */
export interface WebSocketMessage {
  /** 消息类型 */
  type: 'NEW_MESSAGE' | 'UNREAD_COUNT' | 'HEARTBEAT'
  /** 消息数据 */
  data: Message | number | null
  /** 时间戳 */
  timestamp: number
}
