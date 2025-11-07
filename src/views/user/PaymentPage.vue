<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <div class="container mx-auto px-4 py-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- 订单不存在 -->
      <div v-else-if="!order" class="bg-white rounded-lg shadow-md p-12 text-center">
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
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">订单不存在</h3>
        <p class="text-gray-600 mb-6">请返回重新预订</p>
        <button
          @click="router.push('/')"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回首页
        </button>
      </div>

      <!-- 支付页面 -->
      <div v-else class="max-w-4xl mx-auto">
        <!-- 步骤指示器 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center flex-1">
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold"
                >
                  ✓
                </div>
                <span class="ml-3 font-medium text-gray-900">填写信息</span>
              </div>
              <div class="flex-1 h-0.5 bg-green-600 mx-4"></div>
            </div>
            <div class="flex items-center flex-1">
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold"
                >
                  2
                </div>
                <span class="ml-3 font-medium text-gray-900">确认支付</span>
              </div>
              <div class="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            </div>
            <div class="flex items-center">
              <div
                class="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold"
              >
                3
              </div>
              <span class="ml-3 font-medium text-gray-500">完成预订</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左侧：支付方式 -->
          <div class="lg:col-span-2 space-y-6">
            <!-- 倒计时提示 -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-center">
                <svg
                  class="w-6 h-6 text-yellow-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p class="font-medium text-yellow-900">
                    请在 <span class="text-2xl font-bold text-red-600">{{ formatTime(countdown) }}</span> 内完成支付
                  </p>
                  <p class="text-sm text-yellow-700 mt-1">超时后订单将自动取消</p>
                </div>
              </div>
            </div>

            <!-- 支付方式选择 -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">选择支付方式</h2>

              <div class="space-y-3">
                <!-- 支付宝 -->
                <label
                  :class="[
                    'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
                    selectedPaymentMethod === 'alipay'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  ]"
                >
                  <input
                    v-model="selectedPaymentMethod"
                    type="radio"
                    value="alipay"
                    class="sr-only"
                  />
                  <div class="flex items-center flex-1">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">支付宝</p>
                      <p class="text-sm text-gray-600">推荐使用，安全快捷</p>
                    </div>
                  </div>
                  <svg
                    v-if="selectedPaymentMethod === 'alipay'"
                    class="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </label>

                <!-- 微信支付 -->
                <label
                  :class="[
                    'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
                    selectedPaymentMethod === 'wechat'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  ]"
                >
                  <input
                    v-model="selectedPaymentMethod"
                    type="radio"
                    value="wechat"
                    class="sr-only"
                  />
                  <div class="flex items-center flex-1">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">微信支付</p>
                      <p class="text-sm text-gray-600">使用微信扫码支付</p>
                    </div>
                  </div>
                  <svg
                    v-if="selectedPaymentMethod === 'wechat'"
                    class="w-6 h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </label>

                <!-- 银行卡 -->
                <label
                  :class="[
                    'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
                    selectedPaymentMethod === 'bank'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  ]"
                >
                  <input
                    v-model="selectedPaymentMethod"
                    type="radio"
                    value="bank"
                    class="sr-only"
                  />
                  <div class="flex items-center flex-1">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">银行卡支付</p>
                      <p class="text-sm text-gray-600">支持各大银行储蓄卡和信用卡</p>
                    </div>
                  </div>
                  <svg
                    v-if="selectedPaymentMethod === 'bank'"
                    class="w-6 h-6 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </label>
              </div>
            </div>

            <!-- 支付协议 -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <label class="flex items-start cursor-pointer">
                <input
                  v-model="agreedToTerms"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <span class="ml-3 text-sm text-gray-700">
                  我已阅读并同意
                  <a href="#" class="text-blue-600 hover:underline">《支付服务协议》</a>
                  和
                  <a href="#" class="text-blue-600 hover:underline">《退改签规则》</a>
                </span>
              </label>
            </div>
          </div>

          <!-- 右侧：订单信息 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">订单信息</h2>

              <div class="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">订单号</span>
                  <span class="font-medium text-gray-900">{{ order.orderNo }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">航班号</span>
                  <span class="font-medium text-gray-900">{{ order.flightNo }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">乘客人数</span>
                  <span class="font-medium text-gray-900">{{ order.passengerCount }} 人</span>
                </div>
              </div>

              <div class="flex justify-between items-center mb-6">
                <span class="text-lg font-semibold text-gray-900">应付金额</span>
                <span class="text-3xl font-bold text-red-600">¥{{ order.totalPrice }}</span>
              </div>

              <button
                @click="handlePayment"
                :disabled="!agreedToTerms || paying"
                :class="[
                  'w-full py-3 rounded-lg font-semibold transition-colors',
                  !agreedToTerms || paying
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                ]"
              >
                {{ paying ? '支付中...' : '确认支付' }}
              </button>

              <p class="text-xs text-gray-500 text-center mt-4">
                支付过程中请勿关闭页面
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

// 状态
const loading = ref(true)
const paying = ref(false)
const order = ref<any>(null)
const selectedPaymentMethod = ref<'alipay' | 'wechat' | 'bank'>('alipay')
const agreedToTerms = ref(false)
const countdown = ref(15 * 60) // 15分钟倒计时
let countdownTimer: number | null = null

// 格式化倒计时
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 开始倒计时
const startCountdown = () => {
  countdownTimer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      stopCountdown()
      handleTimeout()
    }
  }, 1000)
}

// 停止倒计时
const stopCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// 超时处理
const handleTimeout = () => {
  alert('支付超时，订单已取消')
  router.push('/user/orders')
}

// 处理支付
const handlePayment = async () => {
  if (!agreedToTerms.value || !order.value) {
    console.error('支付条件不满足:', { agreedToTerms: agreedToTerms.value, hasOrder: !!order.value })
    return
  }

  console.log('开始支付，订单信息:', order.value)
  console.log('订单ID:', order.value.id)
  console.log('支付方式:', selectedPaymentMethod.value)

  if (!order.value.id) {
    console.error('订单ID为空!')
    alert('订单信息错误，请返回重新下单')
    return
  }

  paying.value = true

  try {
    // 模拟支付过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 调用支付API
    const result = await orderStore.payOrder({
      orderId: order.value.id,
      paymentMethod: selectedPaymentMethod.value
    })

    if (result.success) {
      // 停止倒计时
      stopCountdown()
      
      console.log('支付成功，准备跳转到成功页面，订单ID:', order.value.id)
      
      // 跳转到成功页面（路由参数名是 id，不是 orderId）
      router.push({
        name: 'OrderSuccess',
        params: { id: order.value.id }
      })
    } else {
      alert(result.message || '支付失败')
    }
  } catch (error) {
    console.error('支付失败:', error)
    alert('支付失败，请稍后重试')
  } finally {
    paying.value = false
  }
}

// 初始化
onMounted(async () => {
  const orderId = route.params.orderId as string
  console.log('支付页面加载，订单ID:', orderId)

  if (!orderId) {
    console.error('URL 中没有订单ID!')
    alert('订单信息错误，请返回重新下单')
    router.push('/user/orders')
    return
  }

  // 获取订单信息
  const result = await orderStore.getOrderById(orderId)
  console.log('获取订单结果:', result)

  if (result.success && result.data) {
    order.value = result.data
    console.log('订单信息已加载:', order.value)
    console.log('订单ID:', order.value.id)
    
    // 开始倒计时
    startCountdown()
  } else {
    console.error('未找到订单信息，结果:', result)
    alert('未找到订单信息，请返回重新下单')
    router.push('/user/orders')
  }

  loading.value = false
})

// 清理
onUnmounted(() => {
  stopCountdown()
})
</script>
