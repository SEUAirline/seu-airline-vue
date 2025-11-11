<template>
  <div class="relative">
    <!-- 消息图标按钮 -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
      :class="{ 'text-blue-600 bg-blue-50': isOpen }"
      aria-label="消息通知"
    >
      <!-- 铃铛图标 -->
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      <!-- 未读数红点 -->
      <span
        v-if="messageStore.hasUnread"
        class="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full"
      >
        {{ displayUnreadCount }}
      </span>
    </button>

    <!-- 下拉消息列表 -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      >
        <!-- 头部 -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">消息通知</h3>
          <button
            v-if="messageStore.hasUnread"
            @click="handleMarkAllRead"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            全部已读
          </button>
        </div>

        <!-- 消息列表 -->
        <div class="max-h-96 overflow-y-auto">
          <!-- 加载状态 -->
          <div v-if="messageStore.loading" class="py-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-sm text-gray-500">加载中...</p>
          </div>

          <!-- 消息列表 -->
          <div v-else-if="recentMessages.length > 0" class="divide-y divide-gray-100">
            <div
              v-for="message in recentMessages"
              :key="message.id"
              @click="handleMessageClick(message)"
              class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'bg-blue-50': !message.isRead }"
            >
              <div class="flex items-start space-x-3">
                <!-- 消息类型图标 -->
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  :class="getMessageTypeClass(message.type)"
                >
                  <component :is="getMessageIcon(message.type)" class="w-5 h-5" />
                </div>

                <!-- 消息内容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ message.title }}
                    </p>
                    <span
                      v-if="!message.isRead"
                      class="ml-2 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"
                    ></span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                    {{ message.content }}
                  </p>
                  <p class="mt-1 text-xs text-gray-400">
                    {{ formatTime(message.createTime) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="py-12 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-500">暂无消息</p>
          </div>
        </div>

        <!-- 底部 -->
        <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <router-link
            to="/user/messages"
            @click="closeDropdown"
            class="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            查看全部消息
          </router-link>
        </div>
      </div>
    </transition>

    <!-- 遮罩层 -->
    <div
      v-if="isOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import { MessageType } from '@/types/message'
import type { Message } from '@/types/message'

// ========== 状态 ==========

const messageStore = useMessageStore()
const router = useRouter()

/** 下拉框是否打开 */
const isOpen = ref(false)

/** 轮询定时器 */
let pollingTimer: number | null = null

// ========== 计算属性 ==========

/** 显示的未读数(最多99+) */
const displayUnreadCount = computed(() => {
  const count = messageStore.unreadCount
  return count > 99 ? '99+' : count.toString()
})

/** 最近的消息(最多5条) */
const recentMessages = computed(() => {
  return messageStore.messages.slice(0, 5)
})

// ========== 方法 ==========

/**
 * 切换下拉框
 */
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  
  if (isOpen.value && messageStore.messages.length === 0) {
    // 打开时加载消息
    messageStore.fetchMessages({ pageSize: 5 })
  }
}

/**
 * 关闭下拉框
 */
const closeDropdown = () => {
  isOpen.value = false
}

/**
 * 处理消息点击
 */
const handleMessageClick = async (message: Message) => {
  // 标记为已读
  if (!message.isRead) {
    try {
      await messageStore.markAsRead(message.id)
    } catch (error) {
      console.error('标记已读失败:', error)
    }
  }
  
  // 关闭下拉框
  closeDropdown()
  
  // 根据消息类型跳转
  if (message.type === MessageType.ORDER && message.relatedId) {
    router.push(`/user/orders/${message.relatedId}`)
  } else if (message.type === MessageType.FLIGHT && message.relatedId) {
    router.push(`/user/flights/${message.relatedId}`)
  } else {
    router.push('/user/messages')
  }
}

/**
 * 全部标记为已读
 */
const handleMarkAllRead = async () => {
  try {
    await messageStore.markAllAsRead()
  } catch (error) {
    console.error('全部标记已读失败:', error)
  }
}

/**
 * 获取消息类型样式类
 */
const getMessageTypeClass = (type: MessageType): string => {
  const classes: Record<MessageType, string> = {
    [MessageType.ORDER]: 'bg-blue-100 text-blue-600',
    [MessageType.FLIGHT]: 'bg-orange-100 text-orange-600',
    [MessageType.SYSTEM]: 'bg-gray-100 text-gray-600',
    [MessageType.PROMOTION]: 'bg-green-100 text-green-600'
  }
  return classes[type] || classes[MessageType.SYSTEM]
}

/**
 * 获取消息类型图标
 */
const getMessageIcon = (type: MessageType) => {
  const icons: Record<MessageType, any> = {
    [MessageType.ORDER]: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
      })
    ]),
    [MessageType.FLIGHT]: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
      })
    ]),
    [MessageType.SYSTEM]: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]),
    [MessageType.PROMOTION]: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
      })
    ])
  }
  return icons[type] || icons[MessageType.SYSTEM]
}

/**
 * 格式化时间
 */
const formatTime = (timeStr: string): string => {
  const time = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return time.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit'
    })
  }
}

/**
 * 启动轮询
 */
const startPolling = () => {
  // 检查用户是否已登录
  const token = localStorage.getItem('token')
  if (!token) {
    return // 未登录时不启动轮询
  }
  
  // 立即获取一次未读数
  messageStore.fetchUnreadCount()
  
  // 每30秒轮询一次
  pollingTimer = window.setInterval(() => {
    messageStore.fetchUnreadCount()
  }, 30000)
}

/**
 * 停止轮询
 */
const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

// ========== 生命周期 ==========

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
