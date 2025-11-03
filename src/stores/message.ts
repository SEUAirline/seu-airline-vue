/**
 * 消息系统 Store
 * @description 管理消息状态和WebSocket连接
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { messageApi } from '@/api/message'
import type {
  Message,
  MessageFilter,
  WebSocketMessage
} from '@/types/message'

export const useMessageStore = defineStore('message', () => {
  // ========== 状态 ==========
  
  /** 消息列表 */
  const messages = ref<Message[]>([])
  
  /** 未读消息数 */
  const unreadCount = ref(0)
  
  /** 加载状态 */
  const loading = ref(false)
  
  /** 当前筛选条件 */
  const currentFilter = ref<MessageFilter>({})
  
  /** 总消息数 */
  const total = ref(0)
  
  /** 当前页码 */
  const currentPage = ref(1)
  
  /** 每页数量 */
  const pageSize = ref(20)
  
  /** WebSocket 连接 */
  let ws: WebSocket | null = null
  
  /** WebSocket 连接状态 */
  const wsConnected = ref(false)
  
  /** 心跳定时器 */
  let heartbeatTimer: number | null = null
  
  /** 重连定时器 */
  let reconnectTimer: number | null = null
  
  /** 重连次数 */
  let reconnectAttempts = 0
  
  /** 最大重连次数 */
  const MAX_RECONNECT_ATTEMPTS = 5

  // ========== 计算属性 ==========
  
  /** 未读消息列表 */
  const unreadMessages = computed(() => 
    messages.value.filter(msg => !msg.isRead)
  )
  
  /** 已读消息列表 */
  const readMessages = computed(() => 
    messages.value.filter(msg => msg.isRead)
  )
  
  /** 是否有未读消息 */
  const hasUnread = computed(() => unreadCount.value > 0)
  
  /** 总页数 */
  const totalPages = computed(() => 
    Math.ceil(total.value / pageSize.value)
  )

  // ========== 方法 ==========
  
  /**
   * 获取消息列表
   * @param filter 筛选条件
   */
  const fetchMessages = async (filter?: MessageFilter) => {
    loading.value = true
    try {
      const params = {
        ...currentFilter.value,
        ...filter,
        page: currentPage.value,
        pageSize: pageSize.value
      }
      
      const response = await messageApi.getMessages(params)
      
      if (response.data.code === 200 && response.data.data) {
        messages.value = response.data.data.list
        total.value = response.data.data.total
        currentFilter.value = params
      }
    } catch (error) {
      console.error('获取消息列表失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 获取未读消息数
   */
  const fetchUnreadCount = async () => {
    try {
      const response = await messageApi.getUnreadCount()
      if (response.data.code === 200 && response.data.data !== undefined) {
        unreadCount.value = response.data.data
      }
    } catch (error) {
      console.error('获取未读消息数失败:', error)
    }
  }
  
  /**
   * 标记消息为已读
   * @param id 消息ID
   */
  const markAsRead = async (id: number) => {
    try {
      await messageApi.markAsRead(id)
      
      // 更新本地状态
      const message = messages.value.find(msg => msg.id === id)
      if (message && !message.isRead) {
        message.isRead = true
        message.readTime = new Date().toISOString()
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (error) {
      console.error('标记已读失败:', error)
      throw error
    }
  }
  
  /**
   * 标记所有消息为已读
   */
  const markAllAsRead = async () => {
    try {
      await messageApi.markAllAsRead()
      
      // 更新本地状态
      messages.value.forEach(msg => {
        if (!msg.isRead) {
          msg.isRead = true
          msg.readTime = new Date().toISOString()
        }
      })
      unreadCount.value = 0
    } catch (error) {
      console.error('全部标记已读失败:', error)
      throw error
    }
  }
  
  /**
   * 删除消息
   * @param id 消息ID
   */
  const deleteMessage = async (id: number) => {
    try {
      await messageApi.deleteMessage(id)
      
      // 从列表中移除
      const index = messages.value.findIndex(msg => msg.id === id)
      if (index !== -1) {
        const message = messages.value[index]
        if (!message.isRead) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
        messages.value.splice(index, 1)
        total.value--
      }
    } catch (error) {
      console.error('删除消息失败:', error)
      throw error
    }
  }
  
  /**
   * 批量删除消息
   * @param ids 消息ID数组
   */
  const batchDeleteMessages = async (ids: number[]) => {
    try {
      await messageApi.batchDeleteMessages(ids)
      
      // 从列表中移除
      ids.forEach(id => {
        const index = messages.value.findIndex(msg => msg.id === id)
        if (index !== -1) {
          const message = messages.value[index]
          if (!message.isRead) {
            unreadCount.value = Math.max(0, unreadCount.value - 1)
          }
          messages.value.splice(index, 1)
          total.value--
        }
      })
    } catch (error) {
      console.error('批量删除消息失败:', error)
      throw error
    }
  }
  
  /**
   * 切换页码
   * @param page 页码
   */
  const changePage = (page: number) => {
    currentPage.value = page
    fetchMessages()
  }
  
  /**
   * 筛选消息
   * @param filter 筛选条件
   */
  const filterMessages = (filter: MessageFilter) => {
    currentPage.value = 1
    fetchMessages(filter)
  }
  
  /**
   * 添加新消息到列表
   * @param message 新消息
   */
  const addMessage = (message: Message) => {
    // 添加到列表开头
    messages.value.unshift(message)
    total.value++
    
    // 如果是未读消息,增加未读数
    if (!message.isRead) {
      unreadCount.value++
    }
  }
  
  /**
   * 连接 WebSocket
   * @param token JWT Token
   */
  const connectWebSocket = (token: string) => {
    if (ws && wsConnected.value) {
      console.log('WebSocket 已连接')
      return
    }
    
    try {
      // 构建 WebSocket URL
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'
      ws = new WebSocket(`${wsUrl}/ws/messages?token=${token}`)
      
      // 连接成功
      ws.onopen = () => {
        console.log('WebSocket 连接成功')
        wsConnected.value = true
        reconnectAttempts = 0
        
        // 启动心跳
        startHeartbeat()
      }
      
      // 接收消息
      ws.onmessage = (event) => {
        try {
          const wsMessage: WebSocketMessage = JSON.parse(event.data)
          handleWebSocketMessage(wsMessage)
        } catch (error) {
          console.error('解析 WebSocket 消息失败:', error)
        }
      }
      
      // 连接错误
      ws.onerror = (error) => {
        console.error('WebSocket 错误:', error)
      }
      
      // 连接关闭
      ws.onclose = () => {
        console.log('WebSocket 连接关闭')
        wsConnected.value = false
        stopHeartbeat()
        
        // 尝试重连
        attemptReconnect(token)
      }
    } catch (error) {
      console.error('WebSocket 连接失败:', error)
    }
  }
  
  /**
   * 断开 WebSocket
   */
  const disconnectWebSocket = () => {
    if (ws) {
      ws.close()
      ws = null
      wsConnected.value = false
      stopHeartbeat()
      
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }
    }
  }
  
  /**
   * 处理 WebSocket 消息
   * @param wsMessage WebSocket 消息
   */
  const handleWebSocketMessage = (wsMessage: WebSocketMessage) => {
    switch (wsMessage.type) {
      case 'NEW_MESSAGE':
        // 新消息通知
        if (wsMessage.data) {
          addMessage(wsMessage.data as Message)
          
          // 可以在这里触发浏览器通知或提示音
          showBrowserNotification(wsMessage.data as Message)
        }
        break
        
      case 'UNREAD_COUNT':
        // 未读数更新
        if (typeof wsMessage.data === 'number') {
          unreadCount.value = wsMessage.data
        }
        break
        
      case 'HEARTBEAT':
        // 心跳响应
        console.log('收到心跳响应')
        break
    }
  }
  
  /**
   * 启动心跳
   */
  const startHeartbeat = () => {
    stopHeartbeat()
    
    heartbeatTimer = window.setInterval(() => {
      if (ws && wsConnected.value) {
        ws.send(JSON.stringify({ type: 'HEARTBEAT' }))
      }
    }, 30000) // 每30秒发送一次心跳
  }
  
  /**
   * 停止心跳
   */
  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }
  
  /**
   * 尝试重连
   * @param token JWT Token
   */
  const attemptReconnect = (token: string) => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log('达到最大重连次数,停止重连')
      return
    }
    
    reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000) // 指数退避,最多30秒
    
    console.log(`${delay}ms 后尝试第 ${reconnectAttempts} 次重连...`)
    
    reconnectTimer = window.setTimeout(() => {
      connectWebSocket(token)
    }, delay)
  }
  
  /**
   * 显示浏览器通知
   * @param message 消息
   */
  const showBrowserNotification = (message: Message) => {
    // 检查浏览器是否支持通知
    if (!('Notification' in window)) {
      return
    }
    
    // 检查通知权限
    if (Notification.permission === 'granted') {
      new Notification(message.title, {
        body: message.content,
        icon: '/favicon.ico',
        tag: `message-${message.id}`
      })
    } else if (Notification.permission !== 'denied') {
      // 请求通知权限
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(message.title, {
            body: message.content,
            icon: '/favicon.ico',
            tag: `message-${message.id}`
          })
        }
      })
    }
  }
  
  /**
   * 重置状态
   */
  const reset = () => {
    messages.value = []
    unreadCount.value = 0
    loading.value = false
    currentFilter.value = {}
    total.value = 0
    currentPage.value = 1
    disconnectWebSocket()
  }

  return {
    // 状态
    messages,
    unreadCount,
    loading,
    currentFilter,
    total,
    currentPage,
    pageSize,
    wsConnected,
    
    // 计算属性
    unreadMessages,
    readMessages,
    hasUnread,
    totalPages,
    
    // 方法
    fetchMessages,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteMessage,
    batchDeleteMessages,
    changePage,
    filterMessages,
    addMessage,
    connectWebSocket,
    disconnectWebSocket,
    reset
  }
})
