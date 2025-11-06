<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <AppHeader />
    
    <div class="container mx-auto px-4 py-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else class="max-w-6xl mx-auto">
        <!-- 用户信息卡片 -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-6 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-6">
              <!-- 头像 -->
              <div class="relative">
                <img
                  :src="userInfo.avatar"
                  alt="头像"
                  class="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <div
                  class="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white"
                  :title="`${userInfo.level === 'gold' ? '金卡' : userInfo.level === 'silver' ? '银卡' : '普通'}会员`"
                >
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>

              <!-- 用户信息 -->
              <div>
                <h2 class="text-2xl font-bold mb-2">{{ userInfo.nickname }}</h2>
                <p class="text-blue-100 mb-1">用户名: {{ userInfo.username }}</p>
                <p class="text-blue-100">注册时间: {{ userInfo.createTime }}</p>
              </div>
            </div>

            <!-- 积分信息 -->
            <div class="text-right">
              <div class="text-3xl font-bold mb-1">{{ userInfo.points }}</div>
              <div class="text-blue-100">积分余额</div>
            </div>
          </div>
        </div>

        <!-- 快捷入口 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <router-link
            to="/user/orders"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span v-if="orderStats.total > 0" class="text-2xl font-bold text-gray-900">{{ orderStats.total }}</span>
            </div>
            <div class="text-gray-600 font-medium">我的订单</div>
          </router-link>

          <router-link
            to="/user/passengers"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="text-gray-600 font-medium">常用旅客</div>
          </router-link>

          <router-link
            to="/user/messages"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <span v-if="unreadCount > 0" class="text-2xl font-bold text-gray-900">{{ unreadCount }}</span>
            </div>
            <div class="text-gray-600 font-medium">消息中心</div>
          </router-link>

          <router-link
            to="/user/settings"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div class="text-gray-600 font-medium">账号设置</div>
          </router-link>
        </div>

        <!-- 订单统计 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">订单统计</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-orange-600 mb-1">{{ orderStats.pending }}</div>
              <div class="text-sm text-gray-600">待支付</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600 mb-1">{{ orderStats.paid }}</div>
              <div class="text-sm text-gray-600">已支付</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600 mb-1">{{ orderStats.completed }}</div>
              <div class="text-sm text-gray-600">已完成</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-gray-600 mb-1">{{ orderStats.cancelled }}</div>
              <div class="text-sm text-gray-600">已取消</div>
            </div>
          </div>
        </div>

        <!-- 最近订单 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">最近订单</h3>
            <router-link to="/user/orders" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看全部 →
            </router-link>
          </div>

          <div v-if="recentOrders.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>暂无订单</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
              @click="router.push(`/orders/${order.id}`)"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-medium text-gray-900">订单号: {{ order.orderNo }}</span>
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      order.status === 0 ? 'bg-orange-100 text-orange-700' :
                      order.status === 1 ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    ]"
                  >
                    {{ getOrderStatusText(order.status) }}
                  </span>
                </div>
                <span class="text-lg font-bold text-blue-600">¥{{ order.totalPrice }}</span>
              </div>
              <div class="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <span class="font-medium">{{ order.departureCity }}</span>
                  <svg class="w-4 h-4 inline mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span class="font-medium">{{ order.arrivalCity }}</span>
                  <span class="mx-2">|</span>
                  <span>{{ order.flightNo }}</span>
                </div>
                <span>{{ order.createTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '@/api/client'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()

// 状态
const loading = ref(true)
const userInfo = ref<any>({})
const orderStats = ref({
  total: 0,
  pending: 0,
  paid: 0,
  completed: 0,
  cancelled: 0
})
const recentOrders = ref<any[]>([])
const unreadCount = ref(0)

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

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const response = await request.get('/user/profile')
    if (response.success) {
      userInfo.value = response.data
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 加载订单统计
const loadOrderStats = async () => {
  try {
    const response = await request.get('/user/orders', { params: { pageSize: 100 } })
    if (response.success) {
      const orders = response.data.list || []
      orderStats.value = {
        total: orders.length,
        pending: orders.filter((o: any) => o.status === 0).length,
        paid: orders.filter((o: any) => o.status === 1).length,
        completed: orders.filter((o: any) => o.status === 2).length,
        cancelled: orders.filter((o: any) => o.status === 3).length
      }
      // 获取最近3个订单
      recentOrders.value = orders.slice(0, 3)
    }
  } catch (error) {
    console.error('加载订单统计失败:', error)
  }
}

// 加载未读消息数
const loadUnreadCount = async () => {
  try {
    const response = await request.get('/messages/unread-count')
    if (response.success) {
      unreadCount.value = response.data || 0
    }
  } catch (error) {
    console.error('加载未读消息数失败:', error)
  }
}

// 初始化
onMounted(async () => {
  await Promise.all([
    loadUserInfo(),
    loadOrderStats(),
    loadUnreadCount()
  ])
  loading.value = false
})
</script>
