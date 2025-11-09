<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="container mx-auto px-4 py-6">
      <!-- 页面标题 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">我的订单</h1>
        <p class="text-sm text-gray-600 mt-1">查看和管理您的所有订单</p>
      </div>

      <!-- 订单状态筛选 -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-6 overflow-x-auto">
        <div class="flex space-x-1 md:space-x-0 md:justify-around min-w-max md:min-w-0">
          <button
            v-for="status in orderStatuses"
            :key="status.value"
            @click="handleStatusChange(status.value)"
            :class="[
              'px-4 py-2 whitespace-nowrap transition-all',
              currentStatus === status.value
                ? 'text-blue-600 font-medium border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            ]"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <div class="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <!-- 搜索框 -->
          <div class="flex-1 relative">
            <input
              v-model="searchKeyword"
              type="text"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="搜索订单号/航班号/乘客姓名"
              @keyup.enter="handleSearch"
            />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <!-- 时间筛选 -->
          <div class="flex space-x-3">
            <div class="relative">
              <select
                v-model="timeRange"
                @change="handleSearch"
                class="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
              >
                <option value="all">全部时间</option>
                <option value="week">近一周</option>
                <option value="month">近一月</option>
                <option value="quarter">近三月</option>
              </select>
              <i class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
            <button
              @click="handleSearch"
              class="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-all"
            >
              <i class="fas fa-filter mr-1"></i> 筛选
            </button>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- 订单列表 -->
      <div v-else-if="filteredOrders.length > 0" class="space-y-4">
        <OrderCard
          v-for="order in paginatedOrders"
          :key="order.id"
          :order="order"
          @view-detail="handleViewDetail"
          @pay="handlePay"
          @cancel="handleCancelOrder"
          @check-in="handleCheckIn"
          @rebook="handleRebook"
        />

        <!-- 分页 -->
        <Pagination
          v-if="filteredOrders.length > pageSize"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="filteredOrders.length"
          @page-change="handlePageChange"
        />
      </div>

      <!-- 空状态 -->
      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <svg
          class="w-24 h-24 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无订单</h3>
        <p class="text-gray-600 mb-6">{{ getEmptyStateMessage() }}</p>
        <button
          @click="$router.push('/')"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          去预订航班
        </button>
      </div>
    </main>

    <!-- 订单详情弹窗 -->
    <OrderDetailModal
      v-model:visible="showDetailModal"
      :order-id="selectedOrderId"
      @pay="handlePay"
      @cancel="handleCancelOrder"
    />

    <!-- 取消订单确认弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showCancelModal"
          class="fixed inset-0 z-50 overflow-y-auto"
          @click.self="showCancelModal = false"
        >
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
          <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
              <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">确认取消订单</h3>
                <p class="text-sm text-gray-600 mb-6">
                  取消订单后将无法恢复，确定要取消此订单吗？
                </p>
                <div class="flex space-x-3">
                  <button
                    @click="showCancelModal = false"
                    class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
                  >
                    我再想想
                  </button>
                  <button
                    @click="confirmCancelOrder"
                    :disabled="cancelling"
                    class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    {{ cancelling ? '取消中...' : '确认取消' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import OrderCard from '@/components/OrderCard.vue'
import OrderDetailModal from '@/components/OrderDetailModal.vue'
import Pagination from '@/components/Pagination.vue'
import type { Order } from '@/types/order'
import { orderApi } from '@/api/order'

const router = useRouter()

// 订单状态选项
const orderStatuses = [
  { label: '全部订单', value: 'all' },
  { label: '待支付', value: 'pending' },
  { label: '已支付', value: 'paid' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

// 状态管理
const loading = ref(false)
const orders = ref<Order[]>([])
const currentStatus = ref<string>('all')
const searchKeyword = ref('')
const timeRange = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

// 弹窗状态
const showDetailModal = ref(false)
const selectedOrderId = ref<string | null>(null)
const showCancelModal = ref(false)
const orderToCancel = ref<string | null>(null)
const cancelling = ref(false)

// 计算属性：筛选后的订单
const filteredOrders = computed(() => {
  let result = orders.value

  // 按状态筛选
  if (currentStatus.value !== 'all') {
    result = result.filter(order => order.status === currentStatus.value)
  }

  // 按关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(order => {
      return (
        order.id.toLowerCase().includes(keyword) ||
        order.flightNo.toLowerCase().includes(keyword) ||
        order.passengers.some(p => p.name.toLowerCase().includes(keyword))
      )
    })
  }

  // 按时间范围筛选
  if (timeRange.value !== 'all') {
    const now = Date.now()
    const ranges: Record<string, number> = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      quarter: 90 * 24 * 60 * 60 * 1000
    }
    const range = ranges[timeRange.value]
    if (range) {
      result = result.filter(order => {
        const orderTime = new Date(order.createTime).getTime()
        return now - orderTime <= range
      })
    }
  }

  // 按创建时间倒序排序
  return result.sort((a, b) => {
    return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
  })
})

// 计算属性：分页后的订单
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})

// 加载订单列表
async function loadOrders() {
  loading.value = true
  try {
    const response = await orderApi.getUserOrders()
    if (response.success && response.data) {
      orders.value = response.data
    }
  } catch (error) {
    console.error('加载订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理状态切换
function handleStatusChange(status: string) {
  currentStatus.value = status
  currentPage.value = 1 // 重置到第一页
}

// 处理搜索
function handleSearch() {
  currentPage.value = 1 // 重置到第一页
}

// 处理分页变化
function handlePageChange(page: number) {
  currentPage.value = page
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 查看订单详情
function handleViewDetail(orderId: string) {
  selectedOrderId.value = orderId
  showDetailModal.value = true
}

// 支付订单
function handlePay(orderId: string) {
  // 跳转到支付页面
  router.push({
    name: 'Payment',
    params: { orderId }
  })
}

// 取消订单
function handleCancelOrder(orderId: string) {
  orderToCancel.value = orderId
  showCancelModal.value = true
}

// 确认取消订单
async function confirmCancelOrder() {
  if (!orderToCancel.value) return

  cancelling.value = true
  try {
    const response = await orderApi.cancelOrder(orderToCancel.value)
    if (response.success) {
      // 更新本地订单状态
      const order = orders.value.find(o => o.id === orderToCancel.value)
      if (order) {
        order.status = 'cancelled'
      }
      showCancelModal.value = false
      alert('订单已取消')
    } else {
      alert(response.message || '取消订单失败')
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    alert('取消订单失败，请稍后重试')
  } finally {
    cancelling.value = false
    orderToCancel.value = null
  }
}

// 在线值机
function handleCheckIn(orderId: string) {
  // TODO: 实现在线值机功能
  alert('在线值机功能开发中...')
}

// 再次预订
function handleRebook(order: Order) {
  // 跳转到航班搜索页面，带上航班信息
  router.push({
    name: 'FlightSearch',
    query: {
      from: order.departureCity,
      to: order.arrivalCity,
      date: order.date
    }
  })
}

// 获取空状态提示文本
function getEmptyStateMessage(): string {
  if (currentStatus.value !== 'all') {
    const statusText = orderStatuses.find(s => s.value === currentStatus.value)?.label || '该状态'
    return `暂无${statusText}的订单`
  }
  if (searchKeyword.value.trim()) {
    return '没有找到匹配的订单'
  }
  return '您还没有任何订单,快去预订航班吧!'
}

// 组件挂载时加载订单
onMounted(() => {
  loadOrders()
})
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
</style>
