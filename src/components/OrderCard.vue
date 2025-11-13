<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
    <div class="p-4">
      <!-- 订单头部信息 -->
      <div class="flex justify-between items-center mb-3">
        <div class="flex items-center text-sm text-gray-500">
          <span>订单号：{{ order.id }}</span>
          <span class="mx-2 text-gray-300">|</span>
          <span>{{ formatDateTime(order.createTime) }}</span>
        </div>
        <span :class="getStatusBadgeClass(order.status)">
          <i :class="getStatusIcon(order.status)" class="mr-1"></i>
          {{ getStatusText(order.status) }}
        </span>
      </div>

      <!-- 航班信息 -->
      <div class="border-t border-b border-gray-100 py-3 my-3">
        <div class="flex flex-wrap justify-between items-center">
          <!-- 起飞信息 -->
          <div class="flex items-center mb-2 md:mb-0">
            <div class="text-center mr-4">
              <div class="text-lg font-bold text-gray-800">
                {{ formatTime(order.departureTime) }}
              </div>
              <div class="text-xs text-gray-500 mt-1">{{ order.departureCity }}</div>
            </div>

            <!-- 飞行时长 -->
            <div class="flex flex-col items-center mr-4">
              <div class="text-xs text-gray-500">{{ calculateDuration(order.departureTime, order.arrivalTime) }}</div>
              <div class="relative w-24 h-0.5 my-1">
                <div class="absolute left-0 right-0 top-0 flex justify-between items-center">
                  <div class="w-1.5 h-1.5 bg-blue-600 rounded-full -mt-0.5"></div>
                  <div class="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
                    <i class="fas fa-plane text-blue-600 transform rotate-45"></i>
                  </div>
                  <div class="w-1.5 h-1.5 bg-blue-600 rounded-full -mt-0.5"></div>
                </div>
              </div>
              <div class="text-xs text-gray-500">直飞</div>
            </div>

            <!-- 到达信息 -->
            <div class="text-center">
              <div class="text-lg font-bold text-gray-800">
                {{ formatTime(order.arrivalTime) }}
              </div>
              <div class="text-xs text-gray-500 mt-1">{{ order.arrivalCity }}</div>
            </div>
          </div>

          <!-- 航班详情 -->
          <div class="text-right">
            <div class="text-sm font-medium">{{ order.flightNo }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ formatDate(order.date) }}</div>
            <div class="text-xs text-gray-500">{{ getCabinClassName(order.cabinClass) }}</div>
          </div>
        </div>

        <!-- 乘客信息 -->
        <div class="mt-3 text-sm">
          <span class="text-gray-500">乘客：</span>
          <span class="text-gray-800">{{ getPassengerNames() }}</span>
        </div>
      </div>

      <!-- 订单底部操作 -->
      <div class="flex justify-between items-center">
        <div class="text-sm">
          <span class="text-gray-500">共{{ order.passengers.length }}人</span>
          <span class="mx-2 text-gray-300">|</span>
          <span class="font-medium text-lg text-blue-600">¥{{ order.totalAmount.toFixed(2) }}</span>
          <!-- 待支付倒计时 -->
          <span v-if="order.status === 'pending' && remainingTime" class="ml-2 text-xs text-yellow-600">
            <i class="fas fa-exclamation-circle mr-1"></i>剩余{{ remainingTime }}支付
          </span>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex space-x-2">
          <button
            @click="$emit('view-detail', order.id)"
            class="px-3 py-1 text-sm bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-all"
          >
            查看详情
          </button>
          
          <!-- 根据订单状态显示不同按钮 -->
          <button
            v-if="order.status === 'pending'"
            @click="$emit('pay', order.id)"
            class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            立即支付
          </button>
          
          <button
            v-else-if="order.status === 'paid'"
            @click="$emit('check-in', order.id)"
            class="px-3 py-1 text-sm bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-all"
          >
            <i class="far fa-check-square mr-1"></i>在线值机
          </button>
          
          <button
            v-else-if="order.status === 'completed'"
            @click="$emit('rebook', order)"
            class="px-3 py-1 text-sm bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-all"
          >
            <i class="fas fa-ticket-alt mr-1"></i>再次预订
          </button>
          
          <!-- 只有待支付状态才能取消订单 -->
          <button
            v-if="order.status === 'pending'"
            @click="$emit('cancel', order.id)"
            class="px-3 py-1 text-sm bg-white text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-all"
          >
            取消订单
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Order } from '@/types/order'

interface Props {
  order: Order
}

const props = defineProps<Props>()

defineEmits<{
  'view-detail': [orderId: string]
  'pay': [orderId: string]
  'cancel': [orderId: string]
  'check-in': [orderId: string]
  'rebook': [order: Order]
}>()

// 倒计时相关
const remainingTime = ref<string>('')
let timer: number | null = null

// 格式化日期时间
function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 格式化时间
function formatTime(timeStr: string): string {
  // 如果已经是 HH:mm 格式，直接返回
  if (timeStr && /^\d{2}:\d{2}$/.test(timeStr)) {
    return timeStr
  }
  // 否则尝试解析为日期
  const date = new Date(timeStr)
  if (isNaN(date.getTime())) {
    return '--:--'
  }
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 计算飞行时长
function calculateDuration(departure: string, arrival: string): string {
  // 如果是 HH:mm 格式，需要结合日期
  if (/^\d{2}:\d{2}$/.test(departure) && /^\d{2}:\d{2}$/.test(arrival)) {
    const [depHour, depMin] = departure.split(':').map(Number)
    const [arrHour, arrMin] = arrival.split(':').map(Number)
    
    // 转换为分钟
    let depMinutes = depHour * 60 + depMin
    let arrMinutes = arrHour * 60 + arrMin
    
    // 如果到达时间小于出发时间，说明跨天了
    if (arrMinutes < depMinutes) {
      arrMinutes += 24 * 60
    }
    
    const diff = arrMinutes - depMinutes
    const hours = Math.floor(diff / 60)
    const minutes = diff % 60
    return `${hours}h${minutes}m`
  }
  
  // 否则尝试解析为完整日期时间
  const dep = new Date(departure).getTime()
  const arr = new Date(arrival).getTime()
  
  if (isNaN(dep) || isNaN(arr)) {
    return '--h--m'
  }
  
  const diff = arr - dep
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h${minutes}m`
}

// 获取舱位名称
function getCabinClassName(cabinClass: string): string {
  const classMap: Record<string, string> = {
    economy: '经济舱',
    business: '商务舱',
    first: '头等舱'
  }
  return classMap[cabinClass] || '经济舱'
}

// 获取乘客姓名列表
function getPassengerNames(): string {
  return props.order.passengers.map(p => p.name).join(', ')
}

// 获取订单状态文本
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待支付',
    paid: '已出票',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return statusMap[status] || status
}

// 获取状态徽章样式
function getStatusBadgeClass(status: string): string {
  const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  const statusClass: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
    refunded: 'bg-purple-100 text-purple-800'
  }
  return `${baseClass} ${statusClass[status] || 'bg-gray-100 text-gray-800'}`
}

// 获取状态图标
function getStatusIcon(status: string): string {
  const iconMap: Record<string, string> = {
    pending: 'fas fa-clock',
    paid: 'fas fa-check-circle',
    completed: 'fas fa-check-circle',
    cancelled: 'fas fa-times-circle',
    refunded: 'fas fa-undo'
  }
  return iconMap[status] || 'fas fa-info-circle'
}

// 计算剩余支付时间
function updateRemainingTime() {
  if (props.order.status !== 'pending') {
    remainingTime.value = ''
    return
  }

  const createTime = new Date(props.order.createTime).getTime()
  const now = Date.now()
  const timeLimit = 15 * 60 * 1000 // 15分钟
  const remaining = timeLimit - (now - createTime)

  if (remaining <= 0) {
    remainingTime.value = '已超时'
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    return
  }

  const minutes = Math.floor(remaining / (1000 * 60))
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
  remainingTime.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// 组件挂载时启动倒计时
onMounted(() => {
  if (props.order.status === 'pending') {
    updateRemainingTime()
    timer = window.setInterval(updateRemainingTime, 1000)
  }
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>
