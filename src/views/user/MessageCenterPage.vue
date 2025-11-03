<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">消息中心</h1>
        <p class="mt-2 text-sm text-gray-600">查看和管理您的所有消息通知</p>
      </div>

      <div class="lg:grid lg:grid-cols-4 lg:gap-6">
        <!-- 左侧筛选栏 -->
        <div class="lg:col-span-1 mb-6 lg:mb-0">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">筛选条件</h2>

            <!-- 消息类型筛选 -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-3">消息类型</h3>
              <div class="space-y-2">
                <label
                  v-for="option in typeOptions"
                  :key="option.value"
                  class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="radio"
                    :value="option.value"
                    v-model="selectedType"
                    @change="handleFilterChange"
                    class="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-3 text-sm text-gray-700">{{ option.label }}</span>
                </label>
              </div>
            </div>

            <!-- 已读/未读筛选 -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-3">阅读状态</h3>
              <div class="space-y-2">
                <label
                  v-for="option in readOptions"
                  :key="option.value"
                  class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="radio"
                    :value="option.value"
                    v-model="selectedReadStatus"
                    @change="handleFilterChange"
                    class="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-3 text-sm text-gray-700">{{ option.label }}</span>
                </label>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="space-y-2">
              <button
                v-if="messageStore.hasUnread"
                @click="handleMarkAllRead"
                class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                全部标记已读
              </button>
              <button
                @click="handleResetFilter"
                class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                重置筛选
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧消息列表 -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <!-- 列表头部 -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div class="flex items-center space-x-4">
                <h2 class="text-lg font-semibold text-gray-900">
                  消息列表
                </h2>
                <span class="text-sm text-gray-500">
                  共 {{ messageStore.total }} 条消息
                </span>
              </div>
              
              <!-- 批量操作 -->
              <div v-if="selectedMessages.length > 0" class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">
                  已选择 {{ selectedMessages.length }} 条
                </span>
                <button
                  @click="handleBatchDelete"
                  class="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  批量删除
                </button>
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="messageStore.loading" class="py-16 text-center">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p class="mt-4 text-sm text-gray-500">加载中...</p>
            </div>

            <!-- 消息列表 -->
            <div v-else-if="messageStore.messages.length > 0" class="divide-y divide-gray-100">
              <div
                v-for="message in messageStore.messages"
                :key="message.id"
                class="px-6 py-4 hover:bg-gray-50 transition-colors"
                :class="{ 'bg-blue-50': !message.isRead }"
              >
                <div class="flex items-start space-x-4">
                  <!-- 复选框 -->
                  <input
                    type="checkbox"
                    :value="message.id"
                    v-model="selectedMessages"
                    class="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />

                  <!-- 消息类型图标 -->
                  <div
                    class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                    :class="getMessageTypeClass(message.type)"
                  >
                    <component :is="getMessageIcon(message.type)" class="w-6 h-6" />
                  </div>

                  <!-- 消息内容 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center space-x-2">
                        <h3 class="text-base font-semibold text-gray-900">
                          {{ message.title }}
                        </h3>
                        <span
                          v-if="!message.isRead"
                          class="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-100 rounded"
                        >
                          未读
                        </span>
                        <span
                          v-if="message.priority > 1"
                          class="px-2 py-0.5 text-xs font-medium text-red-600 bg-red-100 rounded"
                        >
                          {{ message.priority === 3 ? '紧急' : '重要' }}
                        </span>
                      </div>
                      <span class="text-sm text-gray-500">
                        {{ formatTime(message.createTime) }}
                      </span>
                    </div>
                    
                    <p class="text-sm text-gray-600 mb-3">
                      {{ message.content }}
                    </p>

                    <!-- 操作按钮 -->
                    <div class="flex items-center space-x-4">
                      <button
                        v-if="!message.isRead"
                        @click="handleMarkRead(message.id)"
                        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        标记已读
                      </button>
                      <button
                        v-if="message.relatedId"
                        @click="handleViewDetail(message)"
                        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        查看详情
                      </button>
                      <button
                        @click="handleDelete(message.id)"
                        class="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="py-16 text-center">
              <svg
                class="mx-auto h-16 w-16 text-gray-400"
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
              <p class="mt-4 text-sm text-gray-500">暂无消息</p>
              <p class="mt-1 text-xs text-gray-400">您的消息通知将显示在这里</p>
            </div>

            <!-- 分页 -->
            <div
              v-if="messageStore.totalPages > 1"
              class="px-6 py-4 border-t border-gray-200"
            >
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-700">
                  显示第 {{ (messageStore.currentPage - 1) * messageStore.pageSize + 1 }} 
                  到 {{ Math.min(messageStore.currentPage * messageStore.pageSize, messageStore.total) }} 条，
                  共 {{ messageStore.total }} 条
                </div>
                
                <div class="flex items-center space-x-2">
                  <button
                    @click="handlePrevPage"
                    :disabled="messageStore.currentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    上一页
                  </button>
                  
                  <div class="flex items-center space-x-1">
                    <button
                      v-for="page in displayPages"
                      :key="page"
                      @click="handlePageChange(page)"
                      class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                      :class="page === messageStore.currentPage
                        ? 'text-white bg-blue-600'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'"
                    >
                      {{ page }}
                    </button>
                  </div>
                  
                  <button
                    @click="handleNextPage"
                    :disabled="messageStore.currentPage === messageStore.totalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    下一页
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import { MessageType } from '@/types/message'
import type { Message } from '@/types/message'

// ========== 状态 ==========

const messageStore = useMessageStore()
const router = useRouter()

/** 选中的消息类型 */
const selectedType = ref<string>('all')

/** 选中的阅读状态 */
const selectedReadStatus = ref<string>('all')

/** 选中的消息ID列表 */
const selectedMessages = ref<number[]>([])

// ========== 筛选选项 ==========

const typeOptions = [
  { label: '全部消息', value: 'all' },
  { label: '订单消息', value: MessageType.ORDER },
  { label: '航班消息', value: MessageType.FLIGHT },
  { label: '系统消息', value: MessageType.SYSTEM },
  { label: '促销消息', value: MessageType.PROMOTION }
]

const readOptions = [
  { label: '全部', value: 'all' },
  { label: '未读', value: 'unread' },
  { label: '已读', value: 'read' }
]

// ========== 计算属性 ==========

/** 显示的页码列表 */
const displayPages = computed(() => {
  const current = messageStore.currentPage
  const total = messageStore.totalPages
  const pages: number[] = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push(total)
    }
  }
  
  return pages
})

// ========== 方法 ==========

/**
 * 处理筛选条件变更
 */
const handleFilterChange = () => {
  selectedMessages.value = []
  
  const filter: any = {}
  
  if (selectedType.value !== 'all') {
    filter.type = selectedType.value
  }
  
  if (selectedReadStatus.value === 'unread') {
    filter.isRead = false
  } else if (selectedReadStatus.value === 'read') {
    filter.isRead = true
  }
  
  messageStore.filterMessages(filter)
}

/**
 * 重置筛选条件
 */
const handleResetFilter = () => {
  selectedType.value = 'all'
  selectedReadStatus.value = 'all'
  selectedMessages.value = []
  messageStore.filterMessages({})
}

/**
 * 标记消息为已读
 */
const handleMarkRead = async (id: number) => {
  try {
    await messageStore.markAsRead(id)
  } catch (error) {
    console.error('标记已读失败:', error)
    alert('标记已读失败,请稍后重试')
  }
}

/**
 * 全部标记为已读
 */
const handleMarkAllRead = async () => {
  if (!confirm('确定要将所有消息标记为已读吗?')) {
    return
  }
  
  try {
    await messageStore.markAllAsRead()
  } catch (error) {
    console.error('全部标记已读失败:', error)
    alert('操作失败,请稍后重试')
  }
}

/**
 * 删除消息
 */
const handleDelete = async (id: number) => {
  if (!confirm('确定要删除这条消息吗?')) {
    return
  }
  
  try {
    await messageStore.deleteMessage(id)
    selectedMessages.value = selectedMessages.value.filter(msgId => msgId !== id)
  } catch (error) {
    console.error('删除消息失败:', error)
    alert('删除失败,请稍后重试')
  }
}

/**
 * 批量删除消息
 */
const handleBatchDelete = async () => {
  if (!confirm(`确定要删除选中的 ${selectedMessages.value.length} 条消息吗?`)) {
    return
  }
  
  try {
    await messageStore.batchDeleteMessages(selectedMessages.value)
    selectedMessages.value = []
  } catch (error) {
    console.error('批量删除失败:', error)
    alert('删除失败,请稍后重试')
  }
}

/**
 * 查看详情
 */
const handleViewDetail = (message: Message) => {
  if (message.type === MessageType.ORDER && message.relatedId) {
    router.push(`/user/orders/${message.relatedId}`)
  } else if (message.type === MessageType.FLIGHT && message.relatedId) {
    router.push(`/user/flights/${message.relatedId}`)
  }
}

/**
 * 上一页
 */
const handlePrevPage = () => {
  if (messageStore.currentPage > 1) {
    messageStore.changePage(messageStore.currentPage - 1)
    selectedMessages.value = []
  }
}

/**
 * 下一页
 */
const handleNextPage = () => {
  if (messageStore.currentPage < messageStore.totalPages) {
    messageStore.changePage(messageStore.currentPage + 1)
    selectedMessages.value = []
  }
}

/**
 * 切换页码
 */
const handlePageChange = (page: number) => {
  messageStore.changePage(page)
  selectedMessages.value = []
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
  return time.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ========== 生命周期 ==========

onMounted(() => {
  // 加载消息列表
  messageStore.fetchMessages()
  // 获取未读数
  messageStore.fetchUnreadCount()
})
</script>
