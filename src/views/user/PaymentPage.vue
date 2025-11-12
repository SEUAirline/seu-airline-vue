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
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style="background: linear-gradient(135deg, #1677FF 0%, #0958D9 100%);">
                      <span class="text-white font-bold text-xl" style="font-family: 'Microsoft YaHei', 'SimHei', sans-serif;">支</span>
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
                      <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 1024 1024">
                        <path d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z"/>
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
                  <span class="font-medium text-gray-900">{{ order.orderNumber }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">航班号</span>
                  <span class="font-medium text-gray-900">{{ order.flightNo }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">乘客人数</span>
                  <span class="font-medium text-gray-900">{{ order.passengers ? order.passengers.length : 0 }} 人</span>
                </div>
              </div>

              <div class="flex justify-between items-center mb-6">
                <span class="text-lg font-semibold text-gray-900">应付金额</span>
                <span class="text-3xl font-bold text-red-600">¥{{ order.totalAmount }}</span>
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
  // 支付超时，直接跳转到订单页
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
    // 订单信息错误，静默返回
    router.push('/user/orders')
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
    }
    // 支付失败，静默处理
  } catch (error) {
    console.error('支付失败:', error)
    // 静默处理错误
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
    // 订单信息错误，返回订单列表
    router.push('/user/orders')
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
    // 未找到订单，直接返回订单列表
    router.push('/user/orders')
  }

  loading.value = false
})

// 清理
onUnmounted(() => {
  stopCountdown()
})
</script>
