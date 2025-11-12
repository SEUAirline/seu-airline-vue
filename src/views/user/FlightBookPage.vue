<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
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

            <!-- 舱位选择 -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">选择舱位</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label
                  v-for="cabin in ['economy', 'business', 'first']"
                  :key="cabin"
                  :class="[
                    'relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all',
                    selectedCabinClass === cabin
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  ]"
                >
                  <input
                    v-model="selectedCabinClass"
                    type="radio"
                    :value="cabin"
                    class="sr-only"
                  />
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold text-gray-900">
                      {{ cabin === 'economy' ? '经济舱' : cabin === 'business' ? '商务舱' : '头等舱' }}
                    </span>
                    <svg
                      v-if="selectedCabinClass === cabin"
                      class="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="text-2xl font-bold text-blue-600 mb-1">
                    ¥{{ cabin === 'economy' ? selectedFlight.price : cabin === 'business' ? Math.round(selectedFlight.price * 2.5) : Math.round(selectedFlight.price * 4) }}
                  </div>
                  <div class="text-sm text-gray-600">
                    剩余 {{ cabin === 'economy' ? selectedFlight.economySeats : cabin === 'business' ? selectedFlight.businessSeats : selectedFlight.firstClassSeats }} 座
                  </div>
                </label>
              </div>
            </div>

            <!-- 乘客信息 -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-900">乘客信息</h2>
                <div class="flex items-center space-x-2">
                  <button
                    v-if="passengers.length < maxPassengers"
                    @click="showFrequentPassengers = true"
                    type="button"
                    class="flex items-center px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <i class="fas fa-user-friends mr-1"></i>
                    选择常用旅客
                  </button>
                  <button
                    v-if="passengers.length < maxPassengers"
                    @click="addPassenger"
                    type="button"
                    class="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    手动添加
                  </button>
                </div>
              </div>

              <div class="space-y-4">
                <PassengerForm
                  v-for="(passenger, index) in passengers"
                  :key="index"
                  :passenger="passenger"
                  :index="index"
                  :errors="passengerErrors[index] || {}"
                  :show-delete="passengers.length > 1"
                  @update="(field, value) => updatePassengerField(index, field, value)"
                  @delete="deletePassenger(index)"
                />
              </div>
            </div>

            <!-- 附加服务 -->
            <ServiceSelector :services="services" @update="handleServiceUpdate" />

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
                  <span class="ml-2 text-sm text-gray-700">与第一位乘客相同</span>
                </label>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    联系人姓名 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="contactInfo.name"
                    type="text"
                    placeholder="请输入联系人姓名"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      contactErrors.name ? 'border-red-500' : 'border-gray-300'
                    ]"
                  />
                  <p v-if="contactErrors.name" class="mt-1 text-sm text-red-500">
                    {{ contactErrors.name }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    联系电话 <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="contactInfo.phone"
                    type="tel"
                    placeholder="请输入联系电话"
                    maxlength="11"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      contactErrors.phone ? 'border-red-500' : 'border-gray-300'
                    ]"
                  />
                  <p v-if="contactErrors.phone" class="mt-1 text-sm text-red-500">
                    {{ contactErrors.phone }}
                  </p>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2"> 电子邮箱 </label>
                  <input
                    v-model="contactInfo.email"
                    type="email"
                    placeholder="请输入电子邮箱（选填）"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      contactErrors.email ? 'border-red-500' : 'border-gray-300'
                    ]"
                  />
                  <p v-if="contactErrors.email" class="mt-1 text-sm text-red-500">
                    {{ contactErrors.email }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：订单摘要 -->
          <div class="lg:col-span-1">
            <PriceBreakdown
              :flight-info="flightInfoForPrice"
              :passenger-count="passengers.length"
              :cabin-class-name="getCabinClassName"
              :ticket-price="totalTicketPrice"
              :airport-fee="passengers.length * 50"
              :fuel-surcharge="passengers.length * 30"
              :service-price="servicePrice"
              :passenger-breakdown="passengerBreakdown"
              :service-details="serviceDetails"
              :disabled="submitting"
              :button-text="submitting ? '提交中...' : '提交订单'"
              @submit="handleSubmit"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 常用旅客选择弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showFrequentPassengers"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          @click.self="showFrequentPassengers = false"
        >
          <div
            class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            @click.stop
          >
            <!-- 弹窗头部 -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 class="text-xl font-semibold text-gray-900">选择常用旅客</h3>
              <button
                @click="showFrequentPassengers = false"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>

            <!-- 加载状态 -->
            <div v-if="loadingFrequentPassengers" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <!-- 旅客列表 -->
            <div v-else-if="frequentPassengers.length > 0" class="flex-1 overflow-y-auto p-6">
              <div class="space-y-3">
                <div
                  v-for="passenger in frequentPassengers"
                  :key="passenger.id"
                  class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                  @click="selectFrequentPassenger(passenger)"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <h4 class="font-semibold text-gray-900">{{ passenger.name }}</h4>
                        <span
                          v-if="passenger.isDefault"
                          class="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                        >
                          默认
                        </span>
                        <span class="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {{ getPassengerTypeText(passenger.passengerType) }}
                        </span>
                      </div>
                      <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span class="text-gray-500">证件:</span>
                          <span class="ml-1">{{ getIdTypeText(passenger.idType) }}</span>
                        </div>
                        <div>
                          <span class="text-gray-500">证件号:</span>
                          <span class="ml-1">{{ passenger.idNumber }}</span>
                        </div>
                      </div>
                    </div>
                    <i class="fas fa-chevron-right text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="flex-1 flex flex-col items-center justify-center py-12">
              <i class="fas fa-user-friends text-gray-300 text-5xl mb-4"></i>
              <p class="text-gray-500 mb-4">暂无常用旅客</p>
              <button
                @click="goToPassengersPage"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                去添加常用旅客
              </button>
            </div>

            <!-- 底部按钮 -->
            <div class="p-6 border-t border-gray-200">
              <button
                @click="showFrequentPassengers = false"
                class="w-full px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFlightStore } from '@/stores/flight'
import { useOrderStore } from '@/stores/order'
import { useUserStore } from '@/stores/user'
import { request } from '@/api/client'
import { flightApi } from '@/api/flight'
import type { Flight } from '@/types/flight'
import AppHeader from '@/components/AppHeader.vue'
import { formatTime, formatDate } from '@/utils/format'
import PassengerForm from '@/components/PassengerForm.vue'
import ServiceSelector from '@/components/ServiceSelector.vue'
import PriceBreakdown from '@/components/PriceBreakdown.vue'

const route = useRoute()
const router = useRouter()
const flightStore = useFlightStore()
const orderStore = useOrderStore()
const userStore = useUserStore()

// 状态
const loading = ref(true)
const submitting = ref(false)
const selectedFlight = ref<Flight | null>(null)
const sameAsPassenger = ref(false)
const maxPassengers = 9 // 最多9名乘客

// 常用旅客相关
const showFrequentPassengers = ref(false)
const loadingFrequentPassengers = ref(false)
const frequentPassengers = ref<any[]>([])

// 乘客列表
interface Passenger {
  name: string
  idType: 'idCard' | 'passport' | 'other'
  idCard: string
  phone: string
  passengerType: 'adult' | 'child' | 'infant'
}

const passengers = ref<Passenger[]>([
  {
    name: '',
    idType: 'idCard',
    idCard: '',
    phone: '',
    passengerType: 'adult'
  }
])

// 舱位选择
const selectedCabinClass = ref<'economy' | 'business' | 'first'>('economy')

// 联系人信息
const contactInfo = ref({
  name: '',
  phone: '',
  email: ''
})

// 附加服务
const services = ref({
  extraBaggage: false,
  baggageWeight: '10',
  insurance: false,
  insuranceType: 'basic',
  meal: false,
  mealType: 'standard',
  lounge: false
})

const servicePrice = ref(0)

// 错误信息
const passengerErrors = ref<Record<number, Record<string, string>>>({})
const contactErrors = ref<Record<string, string>>({})

// 计算属性
const getCabinClassName = computed(() => {
  const map = {
    economy: '经济舱',
    business: '商务舱',
    first: '头等舱'
  }
  return map[selectedCabinClass.value]
})

// 单张票价
const singleTicketPrice = computed(() => {
  if (!selectedFlight.value) return 0
  const priceMap = {
    economy: selectedFlight.value.price,
    business: Math.round(selectedFlight.value.price * 2.5),
    first: Math.round(selectedFlight.value.price * 4)
  }
  return priceMap[selectedCabinClass.value]
})

// 计算所有乘客的票价总和(儿童和婴儿有折扣)
const totalTicketPrice = computed(() => {
  return passengers.value.reduce((total, passenger) => {
    let price = singleTicketPrice.value
    if (passenger.passengerType === 'child') {
      price = Math.round(price * 0.5) // 儿童半价
    } else if (passenger.passengerType === 'infant') {
      price = Math.round(price * 0.1) // 婴儿10%
    }
    return total + price
  }, 0)
})

// 乘客价格明细
const passengerBreakdown = computed(() => {
  const breakdown: { label: string; price: number }[] = []
  const counts = { adult: 0, child: 0, infant: 0 }
  
  passengers.value.forEach(p => {
    counts[p.passengerType]++
  })
  
  if (counts.adult > 0) {
    breakdown.push({
      label: `成人 × ${counts.adult}`,
      price: singleTicketPrice.value * counts.adult
    })
  }
  if (counts.child > 0) {
    breakdown.push({
      label: `儿童 × ${counts.child}`,
      price: Math.round(singleTicketPrice.value * 0.5) * counts.child
    })
  }
  if (counts.infant > 0) {
    breakdown.push({
      label: `婴儿 × ${counts.infant}`,
      price: Math.round(singleTicketPrice.value * 0.1) * counts.infant
    })
  }
  
  return breakdown
})

// 服务明细
const serviceDetails = computed(() => {
  const details: { name: string; price: number }[] = []
  
  if (services.value.extraBaggage) {
    const prices = { '10': 150, '20': 280, '30': 400 }
    details.push({
      name: `额外行李 ${services.value.baggageWeight}kg`,
      price: prices[services.value.baggageWeight as keyof typeof prices]
    })
  }
  
  if (services.value.insurance) {
    const prices = { basic: 30, premium: 60 }
    const names = { basic: '基础保险', premium: '尊享保险' }
    details.push({
      name: names[services.value.insuranceType as keyof typeof names],
      price: prices[services.value.insuranceType as keyof typeof prices]
    })
  }
  
  if (services.value.meal) {
    details.push({
      name: '机上餐食',
      price: 50
    })
  }
  
  if (services.value.lounge) {
    details.push({
      name: '贵宾休息室',
      price: 120
    })
  }
  
  return details
})

const totalPrice = computed(() => {
  const airportFee = passengers.value.length * 50
  const fuelSurcharge = passengers.value.length * 30
  return totalTicketPrice.value + airportFee + fuelSurcharge + servicePrice.value
})

const flightInfoForPrice = computed(() => ({
  flightNo: selectedFlight.value?.flightNo || '',
  departureCity: selectedFlight.value?.departureCity || '',
  arrivalCity: selectedFlight.value?.arrivalCity || '',
  date: selectedFlight.value?.date || ''
}))

// 方法
const addPassenger = () => {
  if (passengers.value.length < maxPassengers) {
    passengers.value.push({
      name: '',
      idType: 'idCard',
      idCard: '',
      phone: '',
      passengerType: 'adult'
    })
  }
}

// 加载常用旅客
const loadFrequentPassengers = async () => {
  loadingFrequentPassengers.value = true
  try {
    const response = await request.get('/passengers')
    if (response.success) {
      // 转换后端数据格式为前端期望的格式
      frequentPassengers.value = (response.data || []).map((passenger: any) => ({
        id: passenger.id,
        name: passenger.passengerName,
        idType: passenger.idType,
        idNumber: passenger.idCard,
        phone: passenger.phone,
        email: passenger.email,
        passengerType: passenger.passengerType?.toLowerCase() || 'adult',
        isDefault: passenger.isDefault
      }))
    }
  } catch (error) {
    console.error('加载常用旅客失败:', error)
  } finally {
    loadingFrequentPassengers.value = false
  }
}

// 选择常用旅客
const selectFrequentPassenger = (passenger: any) => {
  if (passengers.value.length >= maxPassengers) {
    // 已达上限，静默阻止添加（按钮应该已禁用）
    return
  }

  // 检查是否存在空白旅客栏(所有字段都为空)
  const emptyPassengerIndex = passengers.value.findIndex(p => 
    !p.name.trim() && !p.idCard.trim() && !p.phone.trim()
  )

  // 如果存在空白旅客栏,则替换它;否则添加新旅客
  const newPassenger: Passenger = {
    name: passenger.name,
    idType: (passenger.idType === 'ID_CARD' ? 'idCard' : passenger.idType === 'PASSPORT' ? 'passport' : 'other') as 'idCard' | 'passport' | 'other',
    idCard: passenger.idNumber,
    phone: passenger.phone || '',
    passengerType: (passenger.passengerType || 'adult') as 'adult' | 'child' | 'infant'
  }

  if (emptyPassengerIndex !== -1) {
    // 替换空白旅客栏
    passengers.value[emptyPassengerIndex] = newPassenger
  } else {
    // 添加新旅客
    passengers.value.push(newPassenger)
  }

  showFrequentPassengers.value = false
}

// 获取证件类型文本
const getIdTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    ID_CARD: '身份证',
    PASSPORT: '护照',
    OTHER: '其他',
    idCard: '身份证',
    passport: '护照',
    other: '其他'
  }
  return typeMap[type] || type
}

// 获取旅客类型文本
const getPassengerTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    adult: '成人',
    child: '儿童',
    infant: '婴儿',
    ADULT: '成人',
    CHILD: '儿童',
    INFANT: '婴儿'
  }
  return typeMap[type] || type
}

// 跳转到常用旅客页面
const goToPassengersPage = () => {
  router.push('/user/passengers')
}

// 监听弹窗打开,加载常用旅客
watch(showFrequentPassengers, (newVal) => {
  if (newVal && frequentPassengers.value.length === 0) {
    loadFrequentPassengers()
  }
})

const deletePassenger = (index: number) => {
  if (passengers.value.length > 1) {
    passengers.value.splice(index, 1)
    delete passengerErrors.value[index]
  }
}

const updatePassengerField = (index: number, field: keyof Passenger, value: string) => {
  const passenger = passengers.value[index]
  if (field === 'name' || field === 'idCard' || field === 'phone') {
    passenger[field] = value
  } else if (field === 'idType') {
    passenger[field] = value as 'idCard' | 'passport' | 'other'
  } else if (field === 'passengerType') {
    passenger[field] = value as 'adult' | 'child' | 'infant'
  }
  // 清除该字段的错误
  if (passengerErrors.value[index]?.[field]) {
    delete passengerErrors.value[index][field]
  }
}

const handleSameAsPassenger = () => {
  if (sameAsPassenger.value && passengers.value.length > 0) {
    contactInfo.value.name = passengers.value[0].name
    contactInfo.value.phone = passengers.value[0].phone
  }
}

const handleServiceUpdate = (updatedServices: typeof services.value, price: number) => {
  services.value = updatedServices
  servicePrice.value = price
}

const validateForm = (): boolean => {
  passengerErrors.value = {}
  contactErrors.value = {}
  let isValid = true

  // 验证每个乘客
  passengers.value.forEach((passenger, index) => {
    const errors: Record<string, string> = {}

    // 姓名
    if (!passenger.name.trim()) {
      errors.name = '请输入乘客姓名'
      isValid = false
    }

    // 证件号
    if (!passenger.idCard.trim()) {
      errors.idCard = '请输入证件号码'
      isValid = false
    } else if (passenger.idType === 'idCard') {
      const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
      if (!idCardRegex.test(passenger.idCard)) {
        errors.idCard = '请输入正确的18位身份证号'
        isValid = false
      }
    }

    // 手机号
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!passenger.phone.trim()) {
      errors.phone = '请输入手机号'
      isValid = false
    } else if (!phoneRegex.test(passenger.phone)) {
      errors.phone = '请输入正确的11位手机号'
      isValid = false
    }

    if (Object.keys(errors).length > 0) {
      passengerErrors.value[index] = errors
    }
  })

  // 验证联系人
  if (!contactInfo.value.name.trim()) {
    contactErrors.value.name = '请输入联系人姓名'
    isValid = false
  }

  const phoneRegex = /^1[3-9]\d{9}$/
  if (!contactInfo.value.phone.trim()) {
    contactErrors.value.phone = '请输入联系电话'
    isValid = false
  } else if (!phoneRegex.test(contactInfo.value.phone)) {
    contactErrors.value.phone = '请输入正确的11位联系电话'
    isValid = false
  }

  // 邮箱（选填）
  if (contactInfo.value.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactInfo.value.email)) {
      contactErrors.value.email = '请输入正确的邮箱地址'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm() || !selectedFlight.value) {
    // 滚动到第一个错误位置
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  submitting.value = true

  try {
    // 创建订单数据
    const orderData = {
      flightId: selectedFlight.value.id,
      passengers: passengers.value.map(p => ({
        name: p.name,
        idType: p.idType,
        idCard: p.idCard,
        phone: p.phone,
        passengerType: p.passengerType
      })),
      cabinClass: selectedCabinClass.value,
      contactName: contactInfo.value.name,
      contactPhone: contactInfo.value.phone,
      contactEmail: contactInfo.value.email || '',
      services: services.value,
      totalPrice: totalPrice.value
    }

    // 调用 API 创建订单
    const result = await orderStore.createOrder(orderData)

    if (result.success && result.data) {
      // 跳转到支付页面
      router.push({
        name: 'Payment',
        params: { orderId: result.data.id }
      })
    }
    // 创建订单失败，静默处理
  } catch (error) {
    console.error('创建订单失败:', error)
    // 静默处理错误
  } finally {
    submitting.value = false
  }
}

// 初始化
onMounted(async () => {
  // 确保页面可以正常滚动（修复从弹窗跳转过来时滚动被禁用的问题）
  document.body.style.overflow = ''
  
  const flightId = route.params.id as string
  loading.value = true

  try {
    // 首先尝试从 store 获取航班信息
    let flight = flightStore.searchResults.find(f => f.id === flightId)

    if (!flight) {
      // 如果 store 中没有，从后端 API 获取
      console.log('从API获取航班信息:', flightId)
      try {
        const response = await flightApi.getFlightById(flightId)
        if (response.success && response.data) {
          flight = response.data
          console.log('成功从API获取航班:', flight)
        }
      } catch (error) {
        console.error('从API获取航班失败:', error)
      }
    }

    if (flight) {
      selectedFlight.value = flight
    } else {
      console.warn('未找到航班信息，航班ID:', flightId)
    }

    // 从 store 获取当前用户信息并填充第一个乘客
    const currentUser = userStore.currentUser
    if (currentUser && passengers.value.length > 0) {
      passengers.value[0] = {
        name: currentUser.fullName || '',
        idType: 'idCard',
        idCard: currentUser.idCard || '',
        phone: currentUser.phone || '',
        passengerType: 'adult'
      }
      console.log('已自动填充第一个乘客信息:', passengers.value[0])
    }
  } catch (error) {
    console.error('页面初始化失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>
