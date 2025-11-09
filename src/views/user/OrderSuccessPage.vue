<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <AppHeader />
    
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <!-- 成功动画 -->
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <!-- 成功图标 -->
          <div class="mb-6">
            <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <svg
                class="w-16 h-16 text-green-600"
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
            </div>
          </div>

          <!-- 成功标题 -->
          <h1 class="text-3xl font-bold text-gray-900 mb-2">支付成功！</h1>
          <p class="text-lg text-gray-600 mb-8">您的订单已完成支付，祝您旅途愉快</p>

          <!-- 订单信息 -->
          <div v-if="order" class="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">订单信息</h2>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">订单号</span>
                <span class="font-medium text-gray-900">{{ order.orderNo }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">航班号</span>
                <span class="font-medium text-gray-900">{{ order.flightNo }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">航线</span>
                <span class="font-medium text-gray-900">
                  {{ order.departureCity }} → {{ order.arrivalCity }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">出发时间</span>
                <span class="font-medium text-gray-900">{{ order.departureTime }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">乘客人数</span>
                <span class="font-medium text-gray-900">{{ order.passengerCount }} 人</span>
              </div>
              <div class="flex justify-between pt-3 border-t border-gray-200">
                <span class="text-gray-900 font-semibold">支付金额</span>
                <span class="text-2xl font-bold text-green-600">¥{{ order.totalPrice }}</span>
              </div>
            </div>
          </div>

          <!-- 温馨提示 -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <div class="flex items-start">
              <svg
                class="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div class="text-sm text-blue-900">
                <p class="font-medium mb-2">温馨提示：</p>
                <ul class="list-disc list-inside space-y-1">
                  <li>电子机票已发送至您的邮箱</li>
                  <li>请提前2小时到达机场办理值机</li>
                  <li>请携带有效身份证件</li>
                  <li>如需退改签，请在订单中心操作</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="router.push('/user/orders')"
              class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              查看订单
            </button>
            <button
              @click="router.push('/')"
              class="px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              继续预订
            </button>
            <button
              @click="router.push('/user/profile')"
              class="px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              个人中心
            </button>
          </div>
        </div>

        <!-- 推荐服务 (可选) -->
        <div class="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">您可能还需要</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
              <svg
                class="w-10 h-10 text-blue-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <h4 class="font-semibold text-gray-900 mb-1">酒店预订</h4>
              <p class="text-sm text-gray-600">优惠酒店，舒适住宿</p>
            </div>
            <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
              <svg
                class="w-10 h-10 text-green-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <h4 class="font-semibold text-gray-900 mb-1">接送机服务</h4>
              <p class="text-sm text-gray-600">专车接送，省心省力</p>
            </div>
            <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
              <svg
                class="w-10 h-10 text-orange-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h4 class="font-semibold text-gray-900 mb-1">旅行保险</h4>
              <p class="text-sm text-gray-600">全程保障，安心出行</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = ref<any>(null)

onMounted(async () => {
  const orderId = route.params.id as string
  console.log('订单成功页面加载，订单ID:', orderId)

  if (!orderId) {
    console.error('URL中没有订单ID!')
    router.push('/user/orders')
    return
  }

  // 获取订单信息
  const result = await orderStore.getOrderById(orderId)
  console.log('获取订单结果:', result)

  if (result.success && result.data) {
    order.value = result.data
    console.log('订单信息已加载:', order.value)
  } else {
    console.error('未找到订单信息')
    router.push('/user/orders')
  }
})
</script>
