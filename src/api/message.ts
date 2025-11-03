/**
 * 消息系统 API 接口
 * @description 提供消息相关的HTTP请求方法
 */

import client from './client'
import type {
  Message,
  MessageFilter,
  MessageListResponse,
  MessageCreateRequest,
  Announcement
} from '@/types/message'
import type { ApiResponse } from '@/types/api'

/**
 * 消息 API
 */
export const messageApi = {
  /**
   * 获取消息列表
   * @param params 筛选条件
   * @returns 消息列表
   */
  getMessages: (params?: MessageFilter) => {
    return client.get<ApiResponse<MessageListResponse>>('/api/messages', { params })
  },

  /**
   * 获取未读消息数
   * @returns 未读消息数量
   */
  getUnreadCount: () => {
    return client.get<ApiResponse<number>>('/api/messages/unread-count')
  },

  /**
   * 获取消息详情
   * @param id 消息ID
   * @returns 消息详情
   */
  getMessageDetail: (id: number) => {
    return client.get<ApiResponse<Message>>(`/api/messages/${id}`)
  },

  /**
   * 标记消息为已读
   * @param id 消息ID
   */
  markAsRead: (id: number) => {
    return client.put<ApiResponse<void>>(`/api/messages/${id}/read`)
  },

  /**
   * 标记所有消息为已读
   */
  markAllAsRead: () => {
    return client.put<ApiResponse<void>>('/api/messages/read-all')
  },

  /**
   * 删除消息
   * @param id 消息ID
   */
  deleteMessage: (id: number) => {
    return client.delete<ApiResponse<void>>(`/api/messages/${id}`)
  },

  /**
   * 批量删除消息
   * @param ids 消息ID数组
   */
  batchDeleteMessages: (ids: number[]) => {
    return client.delete<ApiResponse<void>>('/api/messages/batch', { data: { ids } })
  },

  /**
   * 创建消息 (管理员功能)
   * @param data 消息数据
   */
  createMessage: (data: MessageCreateRequest) => {
    return client.post<ApiResponse<Message>>('/api/messages', data)
  }
}

/**
 * 系统公告 API
 */
export const announcementApi = {
  /**
   * 获取有效的系统公告列表
   * @returns 公告列表
   */
  getActiveAnnouncements: () => {
    return client.get<ApiResponse<Announcement[]>>('/api/announcements/active')
  },

  /**
   * 获取公告详情
   * @param id 公告ID
   * @returns 公告详情
   */
  getAnnouncementDetail: (id: number) => {
    return client.get<ApiResponse<Announcement>>(`/api/announcements/${id}`)
  }
}

export default messageApi
