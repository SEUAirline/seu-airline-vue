<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen && flight"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click.self="handleClose"
      >
        <div
          class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
          @click.stop
        >
          <!-- 关闭按钮 -->
          <button
            @click="handleClose"
            class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="关闭"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- 头部 -->
          <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ flight.flightNo }}</h2>
                <p class="mt-1 text-sm text-gray-600">{{ flight.airline }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span :class="['px-4 py-2 rounded-full text-sm font-medium', statusClass]">
                  {{ statusText }}
                </span>
              </div>
            </div>
          </div>

          <!-- 航班信息主体 -->
          <div class="p-6 space-y-6">
            <!-- 航线时间信息 -->
            <div class="bg-gray-50 rounded-xl p-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="text-3xl font-bold text-gray-900">
                    {{ formatTime(flight.departureTime) }}
                  </div>
                  <div class="mt-2 text-sm text-gray-600">
                    {{ flight.departureCity }}
                  </div>
                  <div class="mt-1 text-lg font-semibold text-gray-800">
                    {{ flight.departureAirport }}
                  </div>
                </div>

                <div class="flex-1 px-8">
                  <div class="flex items-center justify-center">
                    <div class="flex-1 h-0.5 bg-gray-300"></div>
                    <div class="px-4 text-center">
                      <svg
                        class="w-6 h-6 mx-auto text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div class="mt-2 text-sm font-medium text-gray-600">
                        {{ flight.duration }}
                      </div>
                      <div class="text-xs text-gray-500">直飞</div>
                    </div>
                    <div class="flex-1 h-0.5 bg-gray-300"></div>
                  </div>
                </div>

                <div class="flex-1 text-right">
                  <div class="text-3xl font-bold text-gray-900">
                    {{ formatTime(flight.arrivalTime) }}
                  </div>
                  <div class="mt-2 text-sm text-gray-600">
                    {{ flight.arrivalCity }}
                  </div>
                  <div class="mt-1 text-lg font-semibold text-gray-800">
                    {{ flight.arrivalAirport }}
                  </div>
                </div>
              </div>

              <div class="mt-6 flex items-center justify-between text-sm text-gray-600">
                <div>
                  <span class="font-medium">日期：</span>
                  {{ formatDate(flight.date) }}
                </div>
                <div v-if="flight.aircraft">
                  <span class="font-medium">机型：</span>
                  {{ flight.aircraft }}
                </div>
              </div>
            </div>

            <!-- 舱位和价格信息 -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">舱位信息</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- 经济舱 -->
                <div
                  class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-gray-900">经济舱</h4>
                    <span
                      :class="[
                        'text-sm px-2 py-1 rounded',
                        flight.economySeats > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      ]"
                    >
                      {{ flight.economySeats > 0 ? `剩余 ${flight.economySeats} 座` : '已售罄' }}
                    </span>
                  </div>
                  <div class="text-2xl font-bold text-blue-600">¥{{ flight.price }}</div>
                  <ul class="mt-3 space-y-1 text-sm text-gray-600">
                    <li>✓ 免费行李额 20kg</li>
                    <li>✓ 免费餐食</li>
                    <li>✓ 免费选座</li>
                  </ul>
                </div>

                <!-- 商务舱 -->
                <div
                  class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-gray-900">商务舱</h4>
                    <span
                      :class="[
                        'text-sm px-2 py-1 rounded',
                        flight.businessSeats > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      ]"
                    >
                      {{ flight.businessSeats > 0 ? `剩余 ${flight.businessSeats} 座` : '已售罄' }}
                    </span>
                  </div>
                  <div class="text-2xl font-bold text-blue-600">
                    ¥{{ Math.round(flight.price * 2.5) }}
                  </div>
                  <ul class="mt-3 space-y-1 text-sm text-gray-600">
                    <li>✓ 免费行李额 40kg</li>
                    <li>✓ 高级餐食</li>
                    <li>✓ 优先登机</li>
                    <li>✓ 贵宾休息室</li>
                  </ul>
                </div>

                <!-- 头等舱 -->
                <div
                  class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-gray-900">头等舱</h4>
                    <span
                      :class="[
                        'text-sm px-2 py-1 rounded',
                        flight.firstClassSeats > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      ]"
                    >
                      {{
                        flight.firstClassSeats > 0 ? `剩余 ${flight.firstClassSeats} 座` : '已售罄'
                      }}
                    </span>
                  </div>
                  <div class="text-2xl font-bold text-blue-600">
                    ¥{{ Math.round(flight.price * 4) }}
                  </div>
                  <ul class="mt-3 space-y-1 text-sm text-gray-600">
                    <li>✓ 免费行李额 60kg</li>
                    <li>✓ 顶级餐食</li>
                    <li>✓ 优先登机</li>
                    <li>✓ 头等舱休息室</li>
                    <li>✓ 专车接送</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 退改签政策 -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">退改签政策</h3>
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div class="font-medium text-gray-900 mb-2">退票</div>
                    <div class="text-gray-600">
                      <p>起飞前24小时：收取10%手续费</p>
                      <p>起飞前2-24小时：收取30%手续费</p>
                      <p>起飞前2小时内：不可退票</p>
                    </div>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 mb-2">改签</div>
                    <div class="text-gray-600">
                      <p>起飞前24小时：免费改签</p>
                      <p>起飞前2-24小时：收取5%手续费</p>
                      <p>起飞前2小时内：不可改签</p>
                    </div>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 mb-2">其他说明</div>
                    <div class="text-gray-600">
                      <p>商务舱和头等舱享受更优惠的退改政策</p>
                      <p>特价机票退改规则可能有所不同</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 温馨提示 -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">温馨提示</h3>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ul class="space-y-2 text-sm text-gray-700">
                  <li>• 请至少提前90分钟到达机场办理值机手续</li>
                  <li>• 国内航班建议提前2小时到达机场</li>
                  <li>• 请携带有效身份证件原件办理登机</li>
                  <li>• 液体物品需按规定托运或随身携带</li>
                  <li>• 具体登机口信息请以机场实时信息为准</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 底部操作栏 -->
          <div class="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm text-gray-600">最低价格</div>
                <div class="text-3xl font-bold text-blue-600">
                  ¥{{ flight.price }}
                  <span class="text-sm text-gray-500 font-normal">起</span>
                </div>
              </div>
              <div class="flex gap-3">
                <button
                  @click="handleClose"
                  class="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  @click="handleBook"
                  :disabled="!hasAvailableSeats"
                  :class="[
                    'px-8 py-3 rounded-lg font-medium transition-colors',
                    hasAvailableSeats
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]"
                >
                  {{ hasAvailableSeats ? '立即预订' : '暂无座位' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Flight } from '@/types/flight'

// Props
interface Props {
  flight: Flight | null
  isOpen: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  book: [flightId: string]
}>()

// 计算属性
const statusClass = computed(() => {
  switch (props.flight?.status) {
    case 'scheduled':
      return 'bg-green-100 text-green-700'
    case 'delayed':
      return 'bg-yellow-100 text-yellow-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})

const statusText = computed(() => {
  switch (props.flight?.status) {
    case 'scheduled':
      return '准点'
    case 'delayed':
      return '延误'
    case 'cancelled':
      return '已取消'
    case 'completed':
      return '已完成'
    default:
      return '未知'
  }
})

const hasAvailableSeats = computed(() => {
  if (!props.flight) return false
  return (
    props.flight.economySeats > 0 ||
    props.flight.businessSeats > 0 ||
    props.flight.firstClassSeats > 0
  )
})

// 方法
const formatTime = (time: string) => {
  return time.substring(0, 5) // "HH:mm"
}

const formatDate = (date: string) => {
  const d = new Date(date)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${date} ${weekdays[d.getDay()]}`
}

const handleClose = () => {
  emit('close')
}

const handleBook = () => {
  if (props.flight && hasAvailableSeats.value) {
    emit('book', props.flight.id)
  }
}

// ESC键关闭
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

// 监听打开状态，添加/移除键盘事件
watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeydown)
      // 防止背景滚动
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = ''
    }
  }
)
</script>

<style scoped>
/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
