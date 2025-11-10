<template>
  <div 
    v-if="modelValue" 
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <!-- 对话框头部 -->
      <div class="p-5 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">
            订单详情
          </h3>
          <button 
            @click="handleClose" 
            class="text-gray-400 hover:text-gray-500"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- 对话框内容 -->
      <div v-if="order" class="p-5">
        <!-- 订单基本信息 -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-gray-800 mb-3">订单信息</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <div class="text-sm text-gray-500">订单号</div>
              <div class="text-sm font-medium text-gray-800">{{ order.orderNo }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">订单状态</div>
              <div>
                <span :class="getStatusClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500">下单时间</div>
              <div class="text-sm font-medium text-gray-800">{{ formatDateTime(order.createTime) }}</div>
            </div>
            <div v-if="order.payTime">
              <div class="text-sm text-gray-500">支付时间</div>
              <div class="text-sm font-medium text-gray-800">{{ formatDateTime(order.payTime) }}</div>
            </div>
            <div v-if="order.paymentMethod">
              <div class="text-sm text-gray-500">支付方式</div>
              <div class="text-sm font-medium text-gray-800">{{ getPaymentMethodText(order.paymentMethod) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">订单金额</div>
              <div class="text-lg font-bold text-blue-900">¥{{ order.totalAmount.toLocaleString() }}</div>
            </div>
          </div>
        </div>

        <!-- 航班信息 -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-gray-800 mb-3">航班信息</h4>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-800">{{ order.departureCity }}</div>
                <div class="text-sm text-gray-500">{{ order.departureTime }}</div>
              </div>
              <div class="flex-1 mx-4">
                <div class="text-center text-sm text-gray-500 mb-1">{{ order.flightNo }}</div>
                <div class="relative">
                  <div class="border-t-2 border-gray-300"></div>
                  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2">
                    <i class="fas fa-plane text-blue-900"></i>
                  </div>
                </div>
                <div class="text-center text-xs text-gray-500 mt-1">{{ order.cabinClass === 'economy' ? '经济舱' : order.cabinClass === 'business' ? '商务舱' : '头等舱' }}</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-800">{{ order.arrivalCity }}</div>
                <div class="text-sm text-gray-500">{{ order.arrivalTime }}</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <div class="text-sm text-gray-500">出发日期</div>
                <div class="text-sm font-medium text-gray-800">{{ order.date }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">单价</div>
                <div class="text-sm font-medium text-gray-800">¥{{ order.price.toLocaleString() }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 乘客信息 -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-gray-800 mb-3">乘客信息 ({{ order.passengers.length }}人)</h4>
          <div class="space-y-3">
            <div 
              v-for="(passenger, index) in order.passengers" 
              :key="index"
              class="bg-gray-50 p-4 rounded-lg"
            >
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div class="text-sm text-gray-500">姓名</div>
                  <div class="text-sm font-medium text-gray-800">{{ passenger.name }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">身份证号</div>
                  <div class="text-sm font-medium text-gray-800">{{ passenger.idCard }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">乘客类型</div>
                  <div class="text-sm font-medium text-gray-800">{{ getPassengerTypeText(passenger.passengerType) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 联系人信息 -->
        <div class="mb-6">
          <h4 class="text-md font-medium text-gray-800 mb-3">联系人信息</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <div class="text-sm text-gray-500">联系人姓名</div>
              <div class="text-sm font-medium text-gray-800">{{ order.contactName || '-' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">联系电话</div>
              <div class="text-sm font-medium text-gray-800">{{ order.contactPhone || '-' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">联系邮箱</div>
              <div class="text-sm font-medium text-gray-800">{{ order.contactEmail || '-' }}</div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button 
            v-if="order.status === 'pending'"
            @click="handleRemindPayment" 
            class="btn-warning"
          >
            <i class="fas fa-bell mr-1"></i> 提醒支付
          </button>
          <button 
            v-if="order.status === 'completed'"
            @click="handleViewTicket" 
            class="btn-success"
          >
            <i class="fas fa-ticket-alt mr-1"></i> 查看客票
          </button>
          <button 
            v-if="['pending', 'paid'].includes(order.status)"
            @click="handleCancelOrder" 
            class="btn-danger"
          >
            <i class="fas fa-times-circle mr-1"></i> 取消订单
          </button>
          <button 
            @click="handleClose" 
            class="btn-outline"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '@/types/order'

const props = defineProps<{
  modelValue: boolean
  order: Order | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 关闭对话框
function handleClose() {
  emit('update:modelValue', false)
}

// 提醒支付
function handleRemindPayment() {
  if (props.order && confirm(`确定要提醒客户 ${props.order.contactName} 支付订单吗？`)) {
    alert('支付提醒已发送！')
  }
}

// 查看客票
function handleViewTicket() {
  if (props.order) {
    alert(`查看客票：${props.order.orderNo}\n此功能待实现`)
  }
}

// 取消订单
function handleCancelOrder() {
  if (props.order && confirm(`确定要取消订单 ${props.order.orderNo} 吗？\n此操作不可撤销！`)) {
    if (props.order) {
      props.order.status = 'cancelled'
    }
    alert('订单已取消')
    handleClose()
  }
}

// 格式化日期时间
function formatDateTime(datetime?: string): string {
  if (!datetime) return '-'
  return datetime.replace('T', ' ').substring(0, 19)
}

// 获取状态样式
function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    'pending': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    'paid': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    'completed': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    'cancelled': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800',
    'refunded': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
  }
  return classes[status] || classes['pending']
}

// 获取状态文本
function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    'pending': '待支付',
    'paid': '已支付',
    'completed': '已出票',
    'cancelled': '已取消',
    'refunded': '已退款'
  }
  return texts[status] || status
}

// 获取支付方式文本
function getPaymentMethodText(method: string): string {
  const texts: Record<string, string> = {
    'alipay': '支付宝',
    'wechat': '微信支付',
    'bank': '银行卡'
  }
  return texts[method] || method
}

// 获取乘客类型文本
function getPassengerTypeText(type: string): string {
  const texts: Record<string, string> = {
    'adult': '成人',
    'child': '儿童',
    'infant': '婴儿'
  }
  return texts[type] || type
}
</script>

<style scoped>
.btn-warning {
  @apply bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-all duration-300;
}

.btn-success {
  @apply bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-300;
}

.btn-danger {
  @apply bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-300;
}

.btn-outline {
  @apply bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-all duration-300;
}
</style>
