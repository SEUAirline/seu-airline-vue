<template>
  <!-- 遮罩层 -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 overflow-y-auto"
      >
        <!-- 背景遮罩 - 点击关闭 -->
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="handleClose"
        ></div>

        <!-- 弹窗内容 -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            @click.stop
          >
            <!-- 加载状态 -->
            <div v-if="loading" class="flex items-center justify-center py-20">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <!-- 订单详情内容 -->
            <div v-else-if="order" class="flex flex-col min-h-0 flex-1">
              <!-- 头部 - 固定不滚动 -->
              <div class="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">订单详情</h2>
                  <p class="text-sm text-gray-500 mt-1">订单号：{{ order.id }}</p>
                </div>
                <button
                  @click="handleClose"
                  class="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  title="关闭 (ESC)"
                >
                  <i class="fas fa-times text-2xl"></i>
                </button>
              </div>

              <!-- 内容区域 - 可滚动 -->
              <div class="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                <!-- 订单状态 -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm text-gray-600 mb-1">订单状态</div>
                      <div :class="getStatusBadgeClass(order.status)" class="inline-block">
                        <i :class="getStatusIcon(order.status)" class="mr-1"></i>
                        {{ getStatusText(order.status) }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm text-gray-600 mb-1">订单金额</div>
                      <div class="text-2xl font-bold text-blue-600">¥{{ order.totalAmount.toFixed(2) }}</div>
                    </div>
                  </div>
                </div>

                <!-- 航班信息 -->
                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <i class="fas fa-plane-departure text-blue-600 mr-2"></i>
                    航班信息
                  </h3>
                  <div class="space-y-4">
                    <!-- 航班路线 -->
                    <div class="flex items-center justify-between">
                      <div class="text-center">
                        <div class="text-2xl font-bold text-gray-900">{{ formatTime(order.departureTime) }}</div>
                        <div class="text-sm text-gray-600 mt-1">{{ order.departureCity }}</div>
                        <div class="text-xs text-gray-500 mt-1">{{ formatDate(order.departureTime) }}</div>
                      </div>

                      <div class="flex-1 px-8">
                        <div class="flex items-center justify-center">
                          <div class="flex-1 h-0.5 bg-gray-300"></div>
                          <div class="px-4 text-center">
                            <div class="text-sm font-medium text-gray-600">
                              {{ calculateDuration(order.departureTime, order.arrivalTime) }}
                            </div>
                            <i class="fas fa-plane text-blue-600 transform rotate-45 my-2"></i>
                            <div class="text-xs text-gray-500">直飞</div>
                          </div>
                          <div class="flex-1 h-0.5 bg-gray-300"></div>
                        </div>
                      </div>

                      <div class="text-center">
                        <div class="text-2xl font-bold text-gray-900">{{ formatTime(order.arrivalTime) }}</div>
                        <div class="text-sm text-gray-600 mt-1">{{ order.arrivalCity }}</div>
                        <div class="text-xs text-gray-500 mt-1">{{ formatDate(order.arrivalTime) }}</div>
                      </div>
                    </div>

                    <!-- 航班详情 -->
                    <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <span class="text-sm text-gray-600">航班号：</span>
                        <span class="text-sm font-medium text-gray-900">{{ order.flightNo }}</span>
                      </div>
                      <div>
                        <span class="text-sm text-gray-600">舱位等级：</span>
                        <span class="text-sm font-medium text-gray-900">{{ getCabinClassName(order.cabinClass) }}</span>
                      </div>
                      <div>
                        <span class="text-sm text-gray-600">出发日期：</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatDate(order.date) }}</span>
                      </div>
                      <div>
                        <span class="text-sm text-gray-600">飞行时长：</span>
                        <span class="text-sm font-medium text-gray-900">
                          {{ calculateDuration(order.departureTime, order.arrivalTime) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 乘客信息 -->
                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <i class="fas fa-users text-blue-600 mr-2"></i>
                    乘客信息
                  </h3>
                  <div class="space-y-3">
                    <div
                      v-for="(passenger, index) in order.passengers"
                      :key="index"
                      class="bg-gray-50 rounded-lg p-4"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div class="font-medium text-gray-900">
                          乘客 {{ index + 1 }}
                          <span class="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                            {{ getPassengerTypeText(passenger.passengerType) }}
                          </span>
                        </div>
                      </div>
                      <div class="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span class="text-gray-600">姓名：</span>
                          <span class="text-gray-900">{{ passenger.name }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">身份证号：</span>
                          <span class="text-gray-900">{{ maskIdCard(passenger.idCard) }}</span>
                        </div>
                        <div class="col-span-2">
                          <span class="text-gray-600">联系电话：</span>
                          <span class="text-gray-900">{{ passenger.phone }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 联系人信息 -->
                <div v-if="order.contactName" class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <i class="fas fa-address-book text-blue-600 mr-2"></i>
                    联系人信息
                  </h3>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-600">姓名：</span>
                      <span class="text-gray-900">{{ order.contactName }}</span>
                    </div>
                    <div>
                      <span class="text-gray-600">电话：</span>
                      <span class="text-gray-900">{{ order.contactPhone }}</span>
                    </div>
                    <div class="col-span-2">
                      <span class="text-gray-600">邮箱：</span>
                      <span class="text-gray-900">{{ order.contactEmail }}</span>
                    </div>
                  </div>
                </div>

                <!-- 订单时间线 -->
                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <i class="fas fa-history text-blue-600 mr-2"></i>
                    订单时间线
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-start">
                      <div class="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div class="ml-4 flex-1">
                        <div class="text-sm font-medium text-gray-900">订单创建</div>
                        <div class="text-xs text-gray-500 mt-1">{{ formatDateTime(order.createTime) }}</div>
                      </div>
                    </div>
                    <div v-if="order.payTime" class="flex items-start">
                      <div class="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div class="ml-4 flex-1">
                        <div class="text-sm font-medium text-gray-900">支付完成</div>
                        <div class="text-xs text-gray-500 mt-1">{{ formatDateTime(order.payTime) }}</div>
                        <div v-if="order.paymentMethod" class="text-xs text-gray-500">
                          支付方式：{{ getPaymentMethodText(order.paymentMethod) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 价格明细 -->
                <div class="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <i class="fas fa-receipt text-blue-600 mr-2"></i>
                    价格明细
                  </h3>
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">票价 × {{ order.passengers.length }}</span>
                      <span class="text-gray-900">¥{{ (order.price * order.passengers.length).toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">机建燃油费</span>
                      <span class="text-gray-900">¥0.00</span>
                    </div>
                    <div class="border-t border-gray-200 pt-2 mt-2">
                      <div class="flex justify-between">
                        <span class="font-semibold text-gray-900">总计</span>
                        <span class="text-xl font-bold text-blue-600">¥{{ order.totalAmount.toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 底部操作按钮 - 固定不滚动 -->
              <div class="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
                <div class="flex justify-end space-x-3">
                  <button
                    v-if="order.status === 'paid' || order.status === 'completed'"
                    @click="handleDownloadTicket"
                    class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-all"
                  >
                    <i class="fas fa-download mr-2"></i>下载电子票
                  </button>
                  <button
                    v-if="order.status === 'pending'"
                    @click="handlePay"
                    class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                  >
                    立即支付
                  </button>
                  <button
                    v-if="order.status === 'pending' || order.status === 'paid'"
                    @click="handleCancel"
                    class="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-all"
                  >
                    取消订单
                  </button>
                  <button
                    @click="handleClose"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>

            <!-- 错误状态 -->
            <div v-else class="p-12 text-center">
              <i class="fas fa-exclamation-circle text-4xl text-gray-400 mb-4"></i>
              <p class="text-gray-600">加载订单详情失败</p>
              <button
                @click="handleClose"
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { Order } from '@/types/order'
import { orderApi } from '@/api/order'

interface Props {
  visible: boolean
  orderId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'pay': [orderId: string]
  'cancel': [orderId: string]
}>()

const loading = ref(false)
const order = ref<Order | null>(null)

// 监听弹窗显示状态
watch(() => props.visible, async (newVal) => {
  if (newVal && props.orderId) {
    await loadOrderDetail()
  }
})

// ESC键关闭弹窗
function handleEscKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.visible) {
    handleClose()
  }
}

// 组件挂载时添加键盘事件监听
onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

// 组件卸载时移除键盘事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

// 加载订单详情
async function loadOrderDetail() {
  if (!props.orderId) return

  loading.value = true
  try {
    const response = await orderApi.getOrderById(props.orderId)
    console.log('📋 订单详情响应:', response)
    if (response.success && response.data) {
      order.value = response.data
      console.log('✅ 订单详情已加载:', order.value)
      console.log('👥 乘客数据:', order.value.passengers)
    }
  } catch (error) {
    console.error('❌ 加载订单详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
function handleClose() {
  emit('update:visible', false)
  // 延迟清空数据,等待动画完成
  setTimeout(() => {
    order.value = null
  }, 300)
}

// 支付订单
function handlePay() {
  if (order.value) {
    emit('pay', order.value.id)
    handleClose()
  }
}

// 取消订单
function handleCancel() {
  if (order.value) {
    emit('cancel', order.value.id)
  }
}

// 下载电子票
function handleDownloadTicket() {
  // TODO: 实现电子票下载功能
  console.log('电子票下载功能开发中')
}

// 工具函数
function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function calculateDuration(departure: string, arrival: string): string {
  const dep = new Date(departure).getTime()
  const arr = new Date(arrival).getTime()
  const diff = arr - dep
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}小时${minutes}分钟`
}

function getCabinClassName(cabinClass: string): string {
  const classMap: Record<string, string> = {
    economy: '经济舱',
    business: '商务舱',
    first: '头等舱'
  }
  return classMap[cabinClass] || '经济舱'
}

function getPassengerTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    adult: '成人',
    child: '儿童',
    infant: '婴儿'
  }
  return typeMap[type] || '成人'
}

function maskIdCard(idCard: string | undefined): string {
  if (!idCard) return '未提供'
  if (idCard.length <= 8) return idCard
  return idCard.substring(0, 6) + '********' + idCard.substring(idCard.length - 4)
}

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

function getStatusBadgeClass(status: string): string {
  const baseClass = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium'
  const statusClass: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
    refunded: 'bg-purple-100 text-purple-800'
  }
  return `${baseClass} ${statusClass[status] || 'bg-gray-100 text-gray-800'}`
}

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

function getPaymentMethodText(method: string): string {
  const methodMap: Record<string, string> = {
    alipay: '支付宝',
    wechat: '微信支付',
    bank: '银行卡'
  }
  return methodMap[method] || method
}
</script>

<style scoped>
/* 弹窗动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
