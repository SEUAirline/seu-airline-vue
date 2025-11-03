/**
 * 消息系统 Mock 数据
 * @description 提供消息相关的模拟数据和API
 */

import type { MockMethod } from 'vite-plugin-mock'
import { MessageType, MessagePriority } from '../src/types/message'
import type { Message } from '../src/types/message'

// 模拟消息数据
const mockMessages: Message[] = [
  {
    id: 1,
    userId: 1,
    title: '订单支付成功',
    content: '您的订单 #ORD202511030001 已支付成功,航班信息请查看订单详情。',
    type: MessageType.ORDER,
    relatedId: 1,
    isRead: false,
    priority: MessagePriority.IMPORTANT,
    createTime: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5分钟前
  },
  {
    id: 2,
    userId: 1,
    title: '航班延误通知',
    content: 'CA1234 航班因天气原因延误2小时,预计起飞时间为 14:30,请您合理安排时间。',
    type: MessageType.FLIGHT,
    relatedId: 101,
    isRead: false,
    priority: MessagePriority.URGENT,
    createTime: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30分钟前
  },
  {
    id: 3,
    userId: 1,
    title: '系统维护通知',
    content: '系统将于今晚 23:00-01:00 进行维护升级,期间可能无法正常使用,请您提前安排。',
    type: MessageType.SYSTEM,
    isRead: true,
    priority: MessagePriority.NORMAL,
    createTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
    readTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    userId: 1,
    title: '双十一特惠活动',
    content: '双十一大促来袭!全场机票最低5折起,更有超值优惠券等您领取,活动时间有限,快来抢购吧!',
    type: MessageType.PROMOTION,
    isRead: false,
    priority: MessagePriority.NORMAL,
    createTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5小时前
  },
  {
    id: 5,
    userId: 1,
    title: '订单创建成功',
    content: '您的订单 #ORD202511030002 已创建成功,请在30分钟内完成支付,否则订单将自动取消。',
    type: MessageType.ORDER,
    relatedId: 2,
    isRead: true,
    priority: MessagePriority.IMPORTANT,
    createTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
    readTime: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 6,
    userId: 1,
    title: '航班恢复正常',
    content: 'MU5678 航班已恢复正常,预计按原定时间 16:00 起飞,请您准时到达机场办理登机手续。',
    type: MessageType.FLIGHT,
    relatedId: 102,
    isRead: true,
    priority: MessagePriority.NORMAL,
    createTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
    readTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
  },
  {
    id: 7,
    userId: 1,
    title: '会员积分到账',
    content: '恭喜您!本次航班已完成,您获得了 500 积分奖励,当前积分余额: 2500 分。',
    type: MessageType.SYSTEM,
    isRead: true,
    priority: MessagePriority.NORMAL,
    createTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
    readTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 8,
    userId: 1,
    title: '新用户专享优惠',
    content: '欢迎加入 SEUAirline!新用户专享100元优惠券已发放到您的账户,快去使用吧!',
    type: MessageType.PROMOTION,
    isRead: true,
    priority: MessagePriority.NORMAL,
    createTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天前
    readTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString()
  }
]

// 用于生成新消息ID
let nextMessageId = mockMessages.length + 1

export default [
  // 获取消息列表
  {
    url: '/api/messages',
    method: 'get',
    response: (request: any) => {
      const { type, isRead, page = 1, pageSize = 20 } = request.query
      
      // 筛选消息
      let filteredMessages = [...mockMessages]
      
      if (type && type !== 'all') {
        filteredMessages = filteredMessages.filter(msg => msg.type === type)
      }
      
      if (isRead !== undefined && isRead !== 'all') {
        const isReadBool = isRead === 'true' || isRead === true
        filteredMessages = filteredMessages.filter(msg => msg.isRead === isReadBool)
      }
      
      // 按创建时间倒序排序
      filteredMessages.sort((a, b) => 
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      )
      
      // 分页
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const list = filteredMessages.slice(start, end)
      
      return {
        code: 200,
        message: 'success',
        data: {
          list,
          total: filteredMessages.length,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      }
    }
  },
  
  // 获取未读消息数
  {
    url: '/api/messages/unread-count',
    method: 'get',
    response: () => {
      const unreadCount = mockMessages.filter(msg => !msg.isRead).length
      
      return {
        code: 200,
        message: 'success',
        data: unreadCount
      }
    }
  },
  
  // 获取消息详情
  {
    url: '/api/messages/:id',
    method: 'get',
    response: (request: any) => {
      const id = parseInt(request.params.id)
      const message = mockMessages.find(msg => msg.id === id)
      
      if (!message) {
        return {
          code: 404,
          message: '消息不存在',
          data: null
        }
      }
      
      return {
        code: 200,
        message: 'success',
        data: message
      }
    }
  },
  
  // 标记消息为已读
  {
    url: '/api/messages/:id/read',
    method: 'put',
    response: (request: any) => {
      const id = parseInt(request.params.id)
      const message = mockMessages.find(msg => msg.id === id)
      
      if (!message) {
        return {
          code: 404,
          message: '消息不存在',
          data: null
        }
      }
      
      if (!message.isRead) {
        message.isRead = true
        message.readTime = new Date().toISOString()
      }
      
      return {
        code: 200,
        message: '标记成功',
        data: null
      }
    }
  },
  
  // 全部标记为已读
  {
    url: '/api/messages/read-all',
    method: 'put',
    response: () => {
      const now = new Date().toISOString()
      mockMessages.forEach(msg => {
        if (!msg.isRead) {
          msg.isRead = true
          msg.readTime = now
        }
      })
      
      return {
        code: 200,
        message: '全部标记成功',
        data: null
      }
    }
  },
  
  // 删除消息
  {
    url: '/api/messages/:id',
    method: 'delete',
    response: (request: any) => {
      const id = parseInt(request.params.id)
      const index = mockMessages.findIndex(msg => msg.id === id)
      
      if (index === -1) {
        return {
          code: 404,
          message: '消息不存在',
          data: null
        }
      }
      
      mockMessages.splice(index, 1)
      
      return {
        code: 200,
        message: '删除成功',
        data: null
      }
    }
  },
  
  // 批量删除消息
  {
    url: '/api/messages/batch',
    method: 'delete',
    response: (request: any) => {
      const { ids } = request.body
      
      if (!Array.isArray(ids)) {
        return {
          code: 400,
          message: '参数错误',
          data: null
        }
      }
      
      ids.forEach(id => {
        const index = mockMessages.findIndex(msg => msg.id === id)
        if (index !== -1) {
          mockMessages.splice(index, 1)
        }
      })
      
      return {
        code: 200,
        message: '批量删除成功',
        data: null
      }
    }
  },
  
  // 创建消息 (用于测试)
  {
    url: '/api/messages',
    method: 'post',
    response: (request: any) => {
      const { userId, title, content, type, relatedId, priority } = request.body
      
      const newMessage: Message = {
        id: nextMessageId++,
        userId,
        title,
        content,
        type,
        relatedId,
        isRead: false,
        priority: priority || MessagePriority.NORMAL,
        createTime: new Date().toISOString()
      }
      
      mockMessages.unshift(newMessage)
      
      return {
        code: 200,
        message: '创建成功',
        data: newMessage
      }
    }
  }
] as MockMethod[]
