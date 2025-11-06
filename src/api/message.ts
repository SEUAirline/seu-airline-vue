/**
 * 消息系统 API 接口
 * @description 提供消息相关的HTTP请求方法
 */

import { request } from './client'
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
  getMessages: (params?: MessageFilter): Promise<ApiResponse<MessageListResponse>> => {
    return request.get('/messages', { params })
  },

  /**
   * 获取未读消息数
   * @returns 未读消息数量
   */
  getUnreadCount: (): Promise<ApiResponse<number>> => {
    return request.get('/messages/unread-count')
  },

  /**
   * 获取消息详情
   * @param id 消息ID
   * @returns 消息详情
   */
  getMessageDetail: (id: number): Promise<ApiResponse<Message>> => {
    return request.get(`/messages/${id}`)
  },

  /**
   * 标记消息为已读
   * @param id 消息ID
   */
  markAsRead: (id: number): Promise<ApiResponse<void>> => {
    return request.put(`/messages/${id}/read`)
  },

  /**
   * 标记所有消息为已读
   */
  markAllAsRead: (): Promise<ApiResponse<void>> => {
    return request.put('/messages/read-all')
  },

  /**
   * 删除消息
   * @param id 消息ID
   */
  deleteMessage: (id: number): Promise<ApiResponse<void>> => {
    return request.delete(`/messages/${id}`)
  },

  /**
   * 批量删除消息
   * @param ids 消息ID数组
   */
  batchDeleteMessages: (ids: number[]): Promise<ApiResponse<void>> => {
    return request.delete('/messages/batch', { data: { ids } })
  },

  /**
   * 创建消息 (管理员功能)
   * @param data 消息数据
   */
  createMessage: (data: MessageCreateRequest): Promise<ApiResponse<Message>> => {
    return request.post('/messages', data)
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
  getActiveAnnouncements: (): Promise<ApiResponse<Announcement[]>> => {
    return request.get('/announcements/active')
  },

  /**
   * 获取公告详情
   * @param id 公告ID
   * @returns 公告详情
   */
  getAnnouncementDetail: (id: number): Promise<ApiResponse<Announcement>> => {
    return request.get(`/announcements/${id}`)
  }
}

export default messageApi
