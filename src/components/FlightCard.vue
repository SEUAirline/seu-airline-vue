<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 mb-4">
    <div class="flex items-center justify-between">
      <!-- 航班基本信息 -->
      <div class="flex-1">
        <div class="flex items-center gap-4 mb-4">
          <!-- 航空公司 Logo -->
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 font-bold text-sm">{{
              flight.airline.substring(0, 2)
            }}</span>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ flight.airline }}</h3>
            <p class="text-sm text-gray-500">{{ flight.flightNo }}</p>
          </div>
        </div>

        <!-- 航班时间和路线 -->
        <div class="flex items-center gap-8">
          <!-- 出发信息 -->
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ formatTime(flight.departureTime) }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ flight.departureCity }}</p>
            <p class="text-xs text-gray-400">{{ flight.departureAirport }}</p>
          </div>

          <!-- 飞行时长 -->
          <div class="flex-1 flex flex-col items-center">
            <p class="text-xs text-gray-500 mb-1">{{ flight.duration }}</p>
            <div class="w-full h-px bg-gray-300 relative">
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">直飞</p>
          </div>

          <!-- 到达信息 -->
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ formatTime(flight.arrivalTime) }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ flight.arrivalCity }}</p>
            <p class="text-xs text-gray-400">{{ flight.arrivalAirport }}</p>
          </div>
        </div>

        <!-- 其他信息 -->
        <div class="flex items-center gap-4 mt-4 text-sm text-gray-600">
          <span v-if="flight.aircraft" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ flight.aircraft }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            余票: {{ availableSeats }}
          </span>
        </div>
      </div>

      <!-- 价格和预订按钮 -->
      <div class="ml-8 text-right">
        <div class="mb-4">
          <p class="text-sm text-gray-500 mb-1">起</p>
          <p class="text-3xl font-bold text-orange-600">¥{{ flight.price }}</p>
          <p class="text-xs text-gray-400 mt-1">经济舱</p>
        </div>

        <!-- 状态标签 -->
        <div v-if="flight.status !== 'scheduled'" class="mb-2">
          <span
            :class="[
              'inline-block px-3 py-1 rounded-full text-xs font-medium',
              flight.status === 'delayed'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            ]"
          >
            {{ getStatusText(flight.status) }}
          </span>
        </div>

        <button
          @click="handleBook"
          :disabled="flight.status !== 'scheduled' || availableSeats === 0"
          :class="[
            'w-full px-6 py-2 rounded-lg font-medium transition-colors',
            flight.status === 'scheduled' && availableSeats > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          {{ getButtonText() }}
        </button>

        <!-- 查看详情链接 -->
        <button
          @click="handleViewDetail"
          class="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
        >
          查看详情
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Flight } from '@/types/flight'

interface Props {
  flight: Flight
}

const props = defineProps<Props>()
const emit = defineEmits<{
  book: [flight: Flight]
  viewDetail: [flight: Flight]
}>()

// 计算可用座位数
const availableSeats = computed(() => {
  return props.flight.economySeats + props.flight.businessSeats + props.flight.firstClassSeats
})

// 格式化时间（HH:mm）
function formatTime(datetime: string): string {
  const date = new Date(datetime)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 获取状态文本
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    scheduled: '准点',
    delayed: '延误',
    cancelled: '已取消',
    completed: '已完成'
  }
  return statusMap[status] || status
}

// 获取按钮文本
function getButtonText(): string {
  if (props.flight.status !== 'scheduled') {
    return '不可预订'
  }
  if (availableSeats.value === 0) {
    return '已售罄'
  }
  return '立即预订'
}

// 处理预订
function handleBook() {
  if (props.flight.status === 'scheduled' && availableSeats.value > 0) {
    emit('book', props.flight)
  }
}

// 查看详情
function handleViewDetail() {
  emit('viewDetail', props.flight)
}
</script>
