<template>
  <AdminLayout>
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">订单管理</h1>
      <p class="text-gray-500 mt-1">查看和管理所有客户订单，包括订单状态跟踪、出票和退票操作</p>
    </div>

    <!-- 搜索栏 -->
    <div class="card mb-6">
      <div class="card-body">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">订单号</label>
              <input 
                v-model="searchForm.orderNo" 
                type="text" 
                class="input-field" 
                placeholder="输入订单号"
                @keyup.enter="handleSearch"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">客户姓名</label>
              <input 
                v-model="searchForm.customerName" 
                type="text" 
                class="input-field" 
                placeholder="输入客户姓名"
                @keyup.enter="handleSearch"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">航班号</label>
              <input 
                v-model="searchForm.flightNo" 
                type="text" 
                class="input-field" 
                placeholder="输入航班号"
                @keyup.enter="handleSearch"
              >
            </div>
          </div>
          <div class="flex items-end space-x-3">
            <button @click="handleSearch" class="btn-primary">
              <i class="fas fa-search mr-1"></i> 搜索
            </button>
            <button @click="handleResetSearch" class="btn-outline">
              <i class="fas fa-sync mr-1"></i> 重置
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="card">
      <div class="card-header">
        <div class="flex justify-between items-center w-full">
          <h3 class="font-medium text-gray-800">订单列表</h3>
          <div class="flex items-center space-x-3">
            <div class="relative">
              <select 
                v-model="statusFilter" 
                @change="handleSearch"
                class="pl-3 pr-10 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900"
              >
                <option value="">全部状态</option>
                <option value="pending">待支付</option>
                <option value="paid">已支付</option>
                <option value="completed">已出票</option>
                <option value="cancelled">已取消</option>
                <option value="refunded">已退款</option>
              </select>
              <i class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none"></i>
            </div>
            <div class="text-sm text-gray-500">
              共 <span class="font-medium text-blue-900">{{ filteredOrders.length }}</span> 个订单
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单号</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客户信息</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">航班信息</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出发日期</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单金额</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单状态</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">下单时间</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in paginatedOrders" :key="order.id">
              <td class="px-5 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                {{ order.orderNo }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-800">{{ order.contactName || '-' }}</div>
                <div class="text-xs text-gray-500">{{ formatPhone(order.contactPhone) }}</div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-800">{{ order.flightNo }}</div>
                <div class="text-xs text-gray-500">{{ order.departureCity }} → {{ order.arrivalCity }}</div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ order.date }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                ¥{{ order.totalAmount.toLocaleString() }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <span :class="getStatusClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(order.createTime) }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm">
                <div class="flex space-x-2">
                  <button 
                    @click="handleViewOrder(order)" 
                    class="text-blue-900 hover:text-blue-700 transition-colors" 
                    title="查看详情"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    v-if="order.status === 'completed'"
                    @click="handleViewTicket(order)" 
                    class="text-green-600 hover:text-green-800 transition-colors" 
                    title="查看客票"
                  >
                    <i class="fas fa-ticket-alt"></i>
                  </button>
                  <button 
                    v-if="order.status === 'pending'"
                    @click="handleRemindPayment(order)" 
                    class="text-yellow-600 hover:text-yellow-800 transition-colors" 
                    title="提醒支付"
                  >
                    <i class="fas fa-bell"></i>
                  </button>
                  <button 
                    v-if="['pending', 'paid'].includes(order.status)"
                    @click="handleCancelOrder(order)" 
                    class="text-red-600 hover:text-red-800 transition-colors" 
                    title="取消订单"
                  >
                    <i class="fas fa-times-circle"></i>
                  </button>
                  <button 
                    @click="handleContactCustomer(order)" 
                    class="text-gray-600 hover:text-gray-800 transition-colors" 
                    title="联系客户"
                  >
                    <i class="fas fa-phone"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="8" class="px-5 py-8 text-center text-gray-500">
                暂无订单数据
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="filteredOrders.length > 0" class="px-5 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
        <div class="text-sm text-gray-700 mb-4 sm:mb-0">
          显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredOrders.length) }} 条，共 {{ filteredOrders.length }} 条
        </div>
        <nav class="inline-flex rounded-md shadow">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 border-t border-b border-gray-300 text-sm font-medium',
              currentPage === page 
                ? 'bg-blue-900 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
    </div>

    <!-- 订单详情对话框 -->
    <OrderDetailDialog 
      v-model="showDetailDialog" 
      :order="selectedOrder"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import OrderDetailDialog from '@/components/admin/OrderDetailDialog.vue'
import type { Order } from '@/types/order'
import { adminApi } from '@/api/admin'

// 搜索表单
const searchForm = ref({
  orderNo: '',
  customerName: '',
  flightNo: ''
})

// 状态筛选
const statusFilter = ref('')

// 订单列表
const orders = ref<Order[]>([])

// 对话框相关
const showDetailDialog = ref(false)
const selectedOrder = ref<Order | null>(null)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选后的订单列表
const filteredOrders = computed(() => {
  let result = orders.value

  // 订单号筛选
  if (searchForm.value.orderNo) {
    result = result.filter(o => 
      o.orderNo.toLowerCase().includes(searchForm.value.orderNo.toLowerCase())
    )
  }

  // 客户姓名筛选
  if (searchForm.value.customerName) {
    result = result.filter(o => 
      o.contactName?.toLowerCase().includes(searchForm.value.customerName.toLowerCase())
    )
  }

  // 航班号筛选
  if (searchForm.value.flightNo) {
    result = result.filter(o => 
      o.flightNo.toLowerCase().includes(searchForm.value.flightNo.toLowerCase())
    )
  }

  // 状态筛选
  if (statusFilter.value) {
    result = result.filter(o => o.status === statusFilter.value)
  }

  return result
})

// 分页后的订单列表
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / pageSize.value)
})

// 可见页码
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 加载订单数据
async function loadOrders() {
  try {
    const response = await adminApi.getAllOrders()
    if (response.success && response.data) {
      orders.value = response.data
    }
  } catch (error) {
    console.error('加载订单数据失败:', error)
  }
}

// 搜索订单
function handleSearch() {
  currentPage.value = 1
}

// 重置搜索
function handleResetSearch() {
  searchForm.value = {
    orderNo: '',
    customerName: '',
    flightNo: ''
  }
  statusFilter.value = ''
  currentPage.value = 1
}

// 查看订单详情
function handleViewOrder(order: Order) {
  selectedOrder.value = order
  showDetailDialog.value = true
}

// 查看客票
function handleViewTicket(order: Order) {
  console.log(`查看客票：${order.orderNo} - 功能待实现`)
}

// 提醒支付
function handleRemindPayment(order: Order) {
  console.log(`支付提醒已发送给客户 ${order.contactName}`)
}

// 取消订单
function handleCancelOrder(order: Order) {
  order.status = 'cancelled'
}

// 联系客户
function handleContactCustomer(order: Order) {
  console.log(`联系客户：${order.contactName}`, { phone: order.contactPhone, email: order.contactEmail })
}

// 格式化电话号码
function formatPhone(phone?: string): string {
  if (!phone) return '-'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 格式化日期时间
function formatDateTime(datetime: string): string {
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

// 页面加载时
onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden;
}

.card-header {
  @apply px-5 py-4 border-b border-gray-100 flex justify-between items-center;
}

.card-body {
  @apply px-5 py-4;
}

.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-900 transition-all;
}

.btn-primary {
  @apply bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-all duration-300;
}

.btn-outline {
  @apply bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-all duration-300;
}
</style>
