<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="container mx-auto px-4 py-6">
      <!-- 页面标题 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">个人中心</h1>
        <p class="text-sm text-gray-600 mt-1">欢迎回来,{{ userInfo?.name || '用户' }}</p>
      </div>

      <!-- 个人信息卡片 -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-6 mb-6 text-white">
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <!-- 头像 -->
          <div class="relative">
            <img
              :src="userInfo?.avatar || 'https://ui-avatars.com/api/?name=' + (userInfo?.name || 'User')"
              alt="用户头像"
              class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div class="absolute bottom-0 right-0 bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center shadow-md">
              <i class="fas fa-crown text-sm"></i>
            </div>
          </div>

          <!-- 用户信息 -->
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl font-bold mb-2">{{ userInfo?.name || '用户' }}</h2>
            <div class="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
              <div class="flex items-center">
                <i class="fas fa-id-card mr-2"></i>
                <span>{{ userInfo?.idCard ? maskIdCard(userInfo.idCard) : '未认证' }}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-phone mr-2"></i>
                <span>{{ userInfo?.phone ? maskPhone(userInfo.phone) : '未绑定' }}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-envelope mr-2"></i>
                <span>{{ userInfo?.email || '未绑定' }}</span>
              </div>
            </div>
            <div class="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
              <span class="px-3 py-1 bg-white/20 rounded-full text-xs">
                <i class="fas fa-star mr-1"></i>普通会员
              </span>
              <span class="px-3 py-1 bg-white/20 rounded-full text-xs">
                <i class="fas fa-shield-alt mr-1"></i>已实名
              </span>
            </div>
          </div>

          <!-- 快捷操作 -->
          <div class="flex flex-col space-y-2">
            <button
              @click="$router.push('/user/profile')"
              class="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              <i class="fas fa-edit mr-1"></i>编辑资料
            </button>
            <button
              @click="$router.push('/user/settings')"
              class="px-4 py-2 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
            >
              <i class="fas fa-cog mr-1"></i>账号设置
            </button>
          </div>
        </div>
      </div>

      <!-- 订单统计卡片 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div
          v-for="stat in orderStats"
          :key="stat.key"
          @click="handleStatClick(stat.key)"
          class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center justify-between mb-3">
            <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', stat.bgColor]">
              <i :class="['text-xl', stat.icon, stat.iconColor]"></i>
            </div>
            <span
              v-if="stat.count > 0"
              :class="['text-2xl font-bold', stat.textColor]"
            >
              {{ stat.count }}
            </span>
            <span v-else class="text-2xl font-bold text-gray-300">0</span>
          </div>
          <h3 class="text-sm text-gray-600">{{ stat.label }}</h3>
        </div>
      </div>

      <!-- 功能导航 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-th-large mr-2 text-blue-600"></i>快捷功能
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="menu in quickMenus"
            :key="menu.path"
            @click="$router.push(menu.path)"
            class="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
          >
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
              <i :class="['text-xl text-blue-600', menu.icon]"></i>
            </div>
            <span class="text-sm text-gray-700 text-center">{{ menu.label }}</span>
          </div>
        </div>
      </div>

      <!-- 最近订单 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-clock mr-2 text-blue-600"></i>最近订单
          </h2>
          <button
            @click="$router.push('/user/orders')"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            查看全部 <i class="fas fa-arrow-right ml-1"></i>
          </button>
        </div>

        <!-- 加载状态 -->
        <div v-if="loadingOrders" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- 订单列表 -->
        <div v-else-if="recentOrders.length > 0" class="space-y-4">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            @click="$router.push('/user/orders')"
            class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <span class="text-sm text-gray-500">订单号: {{ order.id }}</span>
                <span
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    getOrderStatusClass(order.status)
                  ]"
                >
                  {{ getOrderStatusText(order.status) }}
                </span>
              </div>
              <span class="text-sm text-gray-500">{{ formatDate(order.createTime) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="text-center">
                  <div class="text-lg font-bold text-gray-900">{{ order.departureCity }}</div>
                  <div class="text-xs text-gray-500">{{ order.departureTime || '--:--' }}</div>
                </div>
                <div class="flex flex-col items-center">
                  <i class="fas fa-plane text-blue-600 text-sm"></i>
                  <div class="text-xs text-gray-500 mt-1">{{ order.flightNo }}</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-gray-900">{{ order.arrivalCity }}</div>
                  <div class="text-xs text-gray-500">{{ order.arrivalTime || '--:--' }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-blue-600">¥{{ order.totalAmount }}</div>
                <div class="text-xs text-gray-500">{{ order.passengers?.length || 1 }}位乘客</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-12">
          <i class="fas fa-inbox text-gray-300 text-5xl mb-4"></i>
          <p class="text-gray-500 mb-4">暂无订单记录</p>
          <button
            @click="$router.push('/')"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            立即预订
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import type { Order } from '@/types/order'
import { orderApi } from '@/api/order'

const router = useRouter()

// 用户信息
const userInfo = ref<any>(null)
const loadingOrders = ref(false)
const recentOrders = ref<Order[]>([])

// 订单统计
const orderStats = computed(() => [
  {
    key: 'pending',
    label: '待支付',
    icon: 'fas fa-clock',
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    count: recentOrders.value.filter(o => o.status === 'pending').length
  },
  {
    key: 'paid',
    label: '待出行',
    icon: 'fas fa-plane-departure',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    count: recentOrders.value.filter(o => o.status === 'paid').length
  },
  {
    key: 'completed',
    label: '已完成',
    icon: 'fas fa-check-circle',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    count: recentOrders.value.filter(o => o.status === 'completed').length
  },
  {
    key: 'cancelled',
    label: '已取消',
    icon: 'fas fa-times-circle',
    iconColor: 'text-gray-600',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    count: recentOrders.value.filter(o => o.status === 'cancelled').length
  }
])

// 快捷菜单
const quickMenus = [
  { label: '我的订单', icon: 'fas fa-list-alt', path: '/user/orders' },
  { label: '常用旅客', icon: 'fas fa-users', path: '/user/passengers' },
  { label: '个人资料', icon: 'fas fa-user-circle', path: '/user/profile' },
  { label: '账号设置', icon: 'fas fa-cog', path: '/user/settings' },
  { label: '消息中心', icon: 'fas fa-bell', path: '/user/messages' },
  { label: '帮助中心', icon: 'fas fa-question-circle', path: '/help' }
]

// 加载用户信息
function loadUserInfo() {
  // 从localStorage获取用户信息
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      userInfo.value = JSON.parse(userStr)
    } catch (error) {
      console.error('解析用户信息失败:', error)
    }
  }
}

// 加载最近订单
async function loadRecentOrders() {
  loadingOrders.value = true
  try {
    const response = await orderApi.getUserOrders()
    if (response.success && response.data) {
      // 只显示最近3个订单
      recentOrders.value = response.data.slice(0, 3)
    }
  } catch (error) {
    console.error('加载订单失败:', error)
  } finally {
    loadingOrders.value = false
  }
}

// 处理统计卡片点击
function handleStatClick(status: string) {
  router.push({
    path: '/user/orders',
    query: { status }
  })
}

// 获取订单状态文本
function getOrderStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待支付',
    paid: '已支付',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return statusMap[status] || '未知'
}

// 获取订单状态样式
function getOrderStatusClass(status: string): string {
  const classMap: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-700',
    paid: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-700',
    refunded: 'bg-purple-100 text-purple-700'
  }
  return classMap[status] || 'bg-gray-100 text-gray-700'
}

// 格式化日期
function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

// 脱敏身份证号
function maskIdCard(idCard: string): string {
  if (!idCard || idCard.length < 18) return idCard
  return idCard.substring(0, 3) + '************' + idCard.substring(idCard.length - 1)
}

// 脱敏手机号
function maskPhone(phone: string): string {
  if (!phone || phone.length < 11) return phone
  return phone.substring(0, 3) + '****' + phone.substring(7)
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserInfo()
  loadRecentOrders()
})
</script>

<style scoped>
/* 渐变背景动画 */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
