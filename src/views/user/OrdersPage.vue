<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <AppHeader />
    
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <!-- 页面标题 -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">我的订单</h1>
          <p class="text-gray-600 mt-1">查看和管理您的所有订单</p>
        </div>

        <!-- 订单筛选标签 -->
        <div class="bg-white rounded-lg shadow-md mb-6">
          <div class="flex border-b border-gray-200">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="currentTab = tab.value"
              :class="[
                'flex-1 py-4 px-6 text-center font-medium transition-colors',
                currentTab === tab.value
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              {{ tab.label }}
              <span
                v-if="tab.count > 0"
                class="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- 订单列表 -->
        <div v-else-if="orders.length > 0" class="space-y-4">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <!-- 订单头部 -->
            <div class="bg-gray-50 px-6 py-3 flex items-center justify-between border-b border-gray-200">
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <span>订单号: <span class="font-medium text-gray-900">{{ order.orderNo }}</span></span>
                <span>下单时间: {{ order.createTime }}</span>
              </div>
              <span
                :class="[
                  'px-3 py-1 text-sm font-medium rounded-full',
                  order.status === 0 ? 'bg-orange-100 text-orange-700' :
                  order.status === 1 ? 'bg-green-100 text-green-700' :
                  order.status === 2 ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                ]"
              >
                {{ getOrderStatusText(order.status) }}
              </span>
            </div>

            <!-- 订单内容 -->
            <div class="p-6">
              <div class="flex items-center justify-between">
                <!-- 航班信息 -->
                <div class="flex-1">
                  <div class="flex items-center space-x-6 mb-4">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-gray-900">{{ order.departureTime?.split(' ')[1]?.substring(0, 5) || '--:--' }}</div>
                      <div class="text-sm text-gray-600 mt-1">{{ order.departureCity }}</div>
                    </div>
                    <div class="flex-1 flex flex-col items-center">
                      <div class="text-sm text-gray-500 mb-1">{{ order.flightNo }}</div>
                      <div class="w-full h-px bg-gray-300 relative">
                        <svg class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="text-xs text-gray-500 mt-1">约2小时</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-gray-900">{{ order.arrivalTime?.split(' ')[1]?.substring(0, 5) || '--:--' }}</div>
                      <div class="text-sm text-gray-600 mt-1">{{ order.arrivalCity }}</div>
                    </div>
                  </div>
                  <div class="text-sm text-gray-600">
                    <span>乘客: {{ order.passengerCount }}人</span>
                    <span class="mx-2">|</span>
                    <span>日期: {{ order.departureTime?.split(' ')[0] || '--' }}</span>
                  </div>
                </div>

                <!-- 价格和操作 -->
                <div class="ml-8 text-right">
                  <div class="text-2xl font-bold text-blue-600 mb-4">¥{{ order.totalPrice }}</div>
                  <div class="space-y-2">
                    <button
                      v-if="order.status === 0"
                      @click="handlePay(order)"
                      class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      立即支付
                    </button>
                    <button
                      @click="viewOrderDetail(order)"
                      class="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      查看详情
                    </button>
                    <button
                      v-if="order.status === 0"
                      @click="handleCancel(order)"
                      class="w-full px-6 py-2 text-red-600 hover:text-red-700 text-sm"
                    >
                      取消订单
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无订单</h3>
          <p class="text-gray-600 mb-6">您还没有任何订单记录</p>
          <button
            @click="router.push('/')"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            去预订航班
          </button>
        </div>

        <!-- 分页 -->
        <div v-if="total > pageSize" class="mt-6 flex items-center justify-center space-x-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span class="text-gray-600">
            第 {{ currentPage }} / {{ totalPages }} 页
          </span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '@/api/client'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()

// 状态
const loading = ref(true)
const currentTab = ref('all')
const orders = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 标签页配置
const tabs = ref([
  { label: '全部订单', value: 'all', count: 0 },
  { label: '待支付', value: '0', count: 0 },
  { label: '已支付', value: '1', count: 0 },
  { label: '已完成', value: '2', count: 0 },
  { label: '已取消', value: '3', count: 0 }
])

// 计算总页数
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 获取订单状态文本
const getOrderStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '待支付',
    1: '已支付',
    2: '已完成',
    3: '已取消'
  }
  return statusMap[status] || '未知'
}

// 加载订单列表
const loadOrders = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    
    if (currentTab.value !== 'all') {
      params.status = currentTab.value
    }

    const response = await request.get('/user/orders', { params })
    if (response.success) {
      orders.value = response.data.list || []
      total.value = response.data.total || 0
      
      // 更新标签计数
      updateTabCounts()
    }
  } catch (error) {
    console.error('加载订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 更新标签计数
const updateTabCounts = async () => {
  try {
    const response = await request.get('/user/orders', { params: { pageSize: 1000 } })
    if (response.success) {
      const allOrders = response.data.list || []
      tabs.value[0].count = allOrders.length
      tabs.value[1].count = allOrders.filter((o: any) => o.status === 0).length
      tabs.value[2].count = allOrders.filter((o: any) => o.status === 1).length
      tabs.value[3].count = allOrders.filter((o: any) => o.status === 2).length
      tabs.value[4].count = allOrders.filter((o: any) => o.status === 3).length
    }
  } catch (error) {
    console.error('更新标签计数失败:', error)
  }
}

// 切换页码
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadOrders()
}

// 查看订单详情
const viewOrderDetail = (order: any) => {
  router.push(`/orders/${order.id}`)
}

// 支付订单
const handlePay = (order: any) => {
  router.push({
    name: 'Payment',
    params: { orderId: order.id }
  })
}

// 取消订单
const handleCancel = async (order: any) => {
  if (!confirm('确定要取消这个订单吗？')) return

  try {
    const response = await request.put(`/orders/${order.id}/cancel`)
    if (response.success) {
      alert('订单已取消')
      loadOrders()
    } else {
      alert(response.message || '取消失败')
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    alert('取消失败，请稍后重试')
  }
}

// 监听标签切换
watch(currentTab, () => {
  currentPage.value = 1
  loadOrders()
})

// 初始化
onMounted(() => {
  loadOrders()
})
</script>
