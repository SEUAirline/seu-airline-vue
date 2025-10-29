<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- 航班不存在 -->
      <div v-else-if="!selectedFlight" class="bg-white rounded-lg shadow-md p-12 text-center">
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
        <h3 class="text-xl font-semibold text-gray-900 mb-2">航班信息不存在</h3>
        <p class="text-gray-600 mb-6">请返回重新搜索航班</p>
        <button
          @click="router.push('/')"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回首页
        </button>
      </div>

      <!-- 预订表单 -->
      <div v-else class="max-w-5xl mx-auto">
        <!-- 步骤指示器 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center flex-1">
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold"
                >
                  1
                </div>
                <span class="ml-3 font-medium text-gray-900">填写信息</span>
              </div>
              <div class="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            </div>
            <div class="flex items-center flex-1">
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold"
                >
                  2
                </div>
                <span class="ml-3 font-medium text-gray-500">确认支付</span>
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
          <!-- 左侧：表单 -->
          <div class="lg:col-span-2 space-y-6">
            <!-- 航班信息 -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">航班信息</h2>
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-2xl font-bold text-gray-900">
                      {{ formatTime(selectedFlight.departureTime) }}
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                      {{ formatDate(selectedFlight.departureTime, 'MM-DD') }}
                    </div>
                    <div class="text-sm text-gray-600">
                      {{ selectedFlight.departureCity }}
                    </div>
                  </div>

                  <div class="flex-1 px-8">
                    <div class="flex items-center justify-center">
                      <div class="flex-1 h-0.5 bg-gray-300"></div>
                      <div class="px-4 text-center">
                        <div class="text-sm font-medium text-gray-600">
                          {{ selectedFlight.duration }}
                        </div>
                        <div class="text-xs text-gray-500">{{ selectedFlight.flightNo }}</div>
                      </div>
                      <div class="flex-1 h-0.5 bg-gray-300"></div>
                    </div>
                  </div>

                  <div class="text-right">
                    <div class="text-2xl font-bold text-gray-900">
                      {{ formatTime(selectedFlight.arrivalTime) }}
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                      {{ formatDate(selectedFlight.arrivalTime, 'MM-DD') }}
                    </div>
                    <div class="text-sm text-gray-600">
                      {{ selectedFlight.arrivalCity }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 乘客信息 -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">乘客信息</h2>

              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      姓名 <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="bookingForm.passengerName"
                      type="text"
                      placeholder="请输入乘客姓名"
                      :class="[
                        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                        errors.passengerName ? 'border-red-500' : 'border-gray-300'
                      ]"
                    />
                    <p v-if="errors.passengerName" class="mt-1 text-sm text-red-500">
                      {{ errors.passengerName }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      证件号码 <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="bookingForm.idCard"
                      type="text"
                      placeholder="请输入18位身份证号"
                      maxlength="18"
                      :class="[
                        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                        errors.idCard ? 'border-red-500' : 'border-gray-300'
                      ]"
                    />
                    <p v-if="errors.idCard" class="mt-1 text-sm text-red-500">
                      {{ errors.idCard }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      手机号 <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="bookingForm.phone"
                      type="tel"
                      placeholder="请输入手机号"
                      maxlength="11"
                      :class="[
                        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      ]"
                    />
                    <p v-if="errors.phone" class="mt-1 text-sm text-red-500">
                      {{ errors.phone }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      舱位等级 <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="bookingForm.cabinClass"
                      :class="[
                        'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                        errors.cabinClass ? 'border-red-500' : 'border-gray-300'
                      ]"
                    >
                      <option value="economy" :disabled="selectedFlight.economySeats <= 0">
                        经济舱 (¥{{ selectedFlight.price }})
                        {{
                          selectedFlight.economySeats > 0
                            ? `剩余${selectedFlight.economySeats}座`
                            : '已售罄'
                        }}
                      </option>
                      <option value="business" :disabled="selectedFlight.businessSeats <= 0">
                        商务舱 (¥{{ Math.round(selectedFlight.price * 2.5) }})
                        {{
                          selectedFlight.businessSeats > 0
                            ? `剩余${selectedFlight.businessSeats}座`
                            : '已售罄'
                        }}
                      </option>
                      <option value="first" :disabled="selectedFlight.firstClassSeats <= 0">
                        头等舱 (¥{{ Math.round(selectedFlight.price * 4) }})
                        {{
                          selectedFlight.firstClassSeats > 0
                            ? `剩余${selectedFlight.firstClassSeats}座`
                            : '已售罄'
                        }}
                      </option>
                    </select>
                    <p v-if="errors.cabinClass" class="mt-1 text-sm text-red-500">
                      {{ errors.cabinClass }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 联系人信息 -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-900">联系人信息</h2>
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="sameAsPassenger"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    @change="handleSameAsPassenger"
                  />
                  <span class="ml-2 text-sm text-gray-700">与乘机人相同</span>
                </label>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    联系人姓名 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="bookingForm.contactName"
                    type="text"
                    placeholder="请输入联系人姓名"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      errors.contactName ? 'border-red-500' : 'border-gray-300'
                    ]"
                  />
                  <p v-if="errors.contactName" class="mt-1 text-sm text-red-500">
                    {{ errors.contactName }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    联系电话 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="bookingForm.contactPhone"
                    type="tel"
                    placeholder="请输入联系电话"
                    maxlength="11"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    ]"
                  />
                  <p v-if="errors.contactPhone" class="mt-1 text-sm text-red-500">
                    {{ errors.contactPhone }}
                  </p>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2"> 电子邮箱 </label>
                  <input
                    v-model="bookingForm.email"
                    type="email"
                    placeholder="请输入电子邮箱（选填）"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    ]"
                  />
                  <p v-if="errors.email" class="mt-1 text-sm text-red-500">
                    {{ errors.email }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：订单摘要 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">订单摘要</h2>

              <div class="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">航班号</span>
                  <span class="font-medium text-gray-900">{{ selectedFlight.flightNo }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">航线</span>
                  <span class="font-medium text-gray-900">
                    {{ selectedFlight.departureCity }} → {{ selectedFlight.arrivalCity }}
                  </span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">出发日期</span>
                  <span class="font-medium text-gray-900">{{ selectedFlight.date }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">乘客人数</span>
                  <span class="font-medium text-gray-900">1 人</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">舱位</span>
                  <span class="font-medium text-gray-900">{{ getCabinClassName }}</span>
                </div>
              </div>

              <div class="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">机票价格</span>
                  <span class="font-medium text-gray-900">¥{{ ticketPrice }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">机场建设费</span>
                  <span class="font-medium text-gray-900">¥50</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">燃油附加费</span>
                  <span class="font-medium text-gray-900">¥30</span>
                </div>
              </div>

              <div class="flex justify-between items-center mb-6">
                <span class="text-lg font-semibold text-gray-900">总计</span>
                <span class="text-2xl font-bold text-blue-600">¥{{ totalPrice }}</span>
              </div>

              <button
                @click="handleSubmit"
                :disabled="submitting"
                :class="[
                  'w-full py-3 rounded-lg font-semibold transition-colors',
                  submitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                ]"
              >
                {{ submitting ? '提交中...' : '提交订单' }}
              </button>

              <p class="text-xs text-gray-500 text-center mt-4">
                点击提交表示您已阅读并同意
                <a href="#" class="text-blue-600 hover:underline">《购票协议》</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFlightStore } from '@/stores/flight'
import { useOrderStore } from '@/stores/order'
import type { Flight } from '@/types/flight'
import { formatTime, formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const flightStore = useFlightStore()
const orderStore = useOrderStore()

// 状态
const loading = ref(true)
const submitting = ref(false)
const selectedFlight = ref<Flight | null>(null)
const sameAsPassenger = ref(false)

// 表单数据
const bookingForm = ref({
  passengerName: '',
  idCard: '',
  phone: '',
  cabinClass: 'economy' as 'economy' | 'business' | 'first',
  contactName: '',
  contactPhone: '',
  email: ''
})

// 错误信息
const errors = ref<Record<string, string>>({})

// 计算属性
const getCabinClassName = computed(() => {
  const map = {
    economy: '经济舱',
    business: '商务舱',
    first: '头等舱'
  }
  return map[bookingForm.value.cabinClass]
})

const ticketPrice = computed(() => {
  if (!selectedFlight.value) return 0
  const priceMap = {
    economy: selectedFlight.value.price,
    business: Math.round(selectedFlight.value.price * 2.5),
    first: Math.round(selectedFlight.value.price * 4)
  }
  return priceMap[bookingForm.value.cabinClass]
})

const totalPrice = computed(() => {
  return ticketPrice.value + 50 + 30 // 机票 + 建设费 + 燃油费
})

// 方法
const handleSameAsPassenger = () => {
  if (sameAsPassenger.value) {
    bookingForm.value.contactName = bookingForm.value.passengerName
    bookingForm.value.contactPhone = bookingForm.value.phone
  }
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  // 乘客姓名
  if (!bookingForm.value.passengerName.trim()) {
    errors.value.passengerName = '请输入乘客姓名'
    isValid = false
  }

  // 身份证
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
  if (!bookingForm.value.idCard.trim()) {
    errors.value.idCard = '请输入身份证号'
    isValid = false
  } else if (!idCardRegex.test(bookingForm.value.idCard)) {
    errors.value.idCard = '请输入正确的18位身份证号'
    isValid = false
  }

  // 手机号
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!bookingForm.value.phone.trim()) {
    errors.value.phone = '请输入手机号'
    isValid = false
  } else if (!phoneRegex.test(bookingForm.value.phone)) {
    errors.value.phone = '请输入正确的11位手机号'
    isValid = false
  }

  // 舱位
  if (!bookingForm.value.cabinClass) {
    errors.value.cabinClass = '请选择舱位等级'
    isValid = false
  }

  // 联系人姓名
  if (!bookingForm.value.contactName.trim()) {
    errors.value.contactName = '请输入联系人姓名'
    isValid = false
  }

  // 联系电话
  if (!bookingForm.value.contactPhone.trim()) {
    errors.value.contactPhone = '请输入联系电话'
    isValid = false
  } else if (!phoneRegex.test(bookingForm.value.contactPhone)) {
    errors.value.contactPhone = '请输入正确的11位联系电话'
    isValid = false
  }

  // 邮箱（选填，但如果填了要验证）
  if (bookingForm.value.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(bookingForm.value.email)) {
      errors.value.email = '请输入正确的邮箱地址'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm() || !selectedFlight.value) return

  submitting.value = true

  try {
    // 创建订单数据
    const orderData = {
      flightId: selectedFlight.value.id,
      passengers: [
        {
          name: bookingForm.value.passengerName,
          idCard: bookingForm.value.idCard,
          phone: bookingForm.value.phone,
          passengerType: 'adult' as const
        }
      ],
      cabinClass: bookingForm.value.cabinClass,
      contactName: bookingForm.value.contactName,
      contactPhone: bookingForm.value.contactPhone,
      contactEmail: bookingForm.value.email || ''
    }

    // 调用 API 创建订单（这里使用 Mock）
    const result = await orderStore.createOrder(orderData)

    if (result.success && result.data) {
      // 跳转到支付页面
      router.push({
        name: 'Payment',
        params: { orderId: result.data.id }
      })
    } else {
      alert(result.message || '创建订单失败')
    }
  } catch (error) {
    console.error('创建订单失败:', error)
    alert('创建订单失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 初始化
onMounted(async () => {
  const flightId = route.params.id as string

  // 尝试从 store 获取航班信息
  const flight = flightStore.searchResults.find(f => f.id === flightId)

  if (flight) {
    selectedFlight.value = flight
  } else {
    // 如果 store 中没有，尝试通过 API 获取（这里Mock暂时不实现）
    // 在实际项目中应该调用 API
    console.warn('未找到航班信息，实际项目中应调用API获取')
  }

  loading.value = false
})
</script>
