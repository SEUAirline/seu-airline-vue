<template>
  <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">订单摘要</h2>

    <!-- 航班信息 -->
    <div class="space-y-3 border-b border-gray-200 pb-4 mb-4">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">航班号</span>
        <span class="font-medium text-gray-900">{{ flightInfo.flightNo }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">航线</span>
        <span class="font-medium text-gray-900">
          {{ flightInfo.departureCity }} → {{ flightInfo.arrivalCity }}
        </span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">出发日期</span>
        <span class="font-medium text-gray-900">{{ flightInfo.date }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">乘客人数</span>
        <span class="font-medium text-gray-900">{{ passengerCount }} 人</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">舱位</span>
        <span class="font-medium text-gray-900">{{ cabinClassName }}</span>
      </div>
    </div>

    <!-- 价格明细 -->
    <div class="space-y-3 border-b border-gray-200 pb-4 mb-4">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">机票价格</span>
        <span class="font-medium text-gray-900">¥{{ ticketPrice }}</span>
      </div>

      <!-- 乘客类型价格明细 -->
      <div v-if="passengerBreakdown.length > 0" class="ml-4 space-y-1">
        <div
          v-for="(item, index) in passengerBreakdown"
          :key="index"
          class="flex justify-between text-xs text-gray-500"
        >
          <span>{{ item.label }}</span>
          <span>¥{{ item.price }}</span>
        </div>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-gray-600">机场建设费</span>
        <span class="font-medium text-gray-900">¥{{ airportFee }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">燃油附加费</span>
        <span class="font-medium text-gray-900">¥{{ fuelSurcharge }}</span>
      </div>

      <!-- 附加服务费用 -->
      <div v-if="servicePrice > 0" class="flex justify-between text-sm">
        <span class="text-gray-600">附加服务</span>
        <span class="font-medium text-gray-900">¥{{ servicePrice }}</span>
      </div>

      <!-- 服务明细 -->
      <div v-if="serviceDetails.length > 0" class="ml-4 space-y-1">
        <div
          v-for="(detail, index) in serviceDetails"
          :key="index"
          class="flex justify-between text-xs text-gray-500"
        >
          <span>{{ detail.name }}</span>
          <span>¥{{ detail.price }}</span>
        </div>
      </div>
    </div>

    <!-- 优惠券/折扣 (可选) -->
    <div v-if="discount > 0" class="space-y-3 border-b border-gray-200 pb-4 mb-4">
      <div class="flex justify-between text-sm text-green-600">
        <span>优惠折扣</span>
        <span>-¥{{ discount }}</span>
      </div>
    </div>

    <!-- 总价 -->
    <div class="flex justify-between items-center mb-6">
      <span class="text-lg font-semibold text-gray-900">总计</span>
      <div class="text-right">
        <div v-if="discount > 0" class="text-sm text-gray-500 line-through">
          ¥{{ totalPrice + discount }}
        </div>
        <div class="text-2xl font-bold text-blue-600">¥{{ totalPrice }}</div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <button
      @click="$emit('submit')"
      :disabled="disabled"
      :class="[
        'w-full py-3 rounded-lg font-semibold transition-colors',
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      ]"
    >
      {{ buttonText }}
    </button>

    <!-- 协议提示 -->
    <p class="text-xs text-gray-500 text-center mt-4">
      点击提交表示您已阅读并同意
      <a href="#" class="text-blue-600 hover:underline">《购票协议》</a>
      和
      <a href="#" class="text-blue-600 hover:underline">《退改签规则》</a>
    </p>

    <!-- 温馨提示 -->
    <div v-if="showTips" class="mt-4 p-3 bg-yellow-50 rounded-lg">
      <div class="flex items-start">
        <svg
          class="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div class="text-xs text-yellow-800">
          <p class="font-medium mb-1">温馨提示：</p>
          <ul class="list-disc list-inside space-y-1">
            <li>请确保乘客信息准确无误</li>
            <li>儿童和婴儿票价为成人票价的50%</li>
            <li>订单提交后15分钟内完成支付</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 类型定义
interface FlightInfo {
  flightNo: string
  departureCity: string
  arrivalCity: string
  date: string
}

interface PassengerBreakdownItem {
  label: string
  price: number
}

interface ServiceDetail {
  name: string
  price: number
}

interface Props {
  flightInfo: FlightInfo
  passengerCount: number
  cabinClassName: string
  ticketPrice: number
  airportFee?: number
  fuelSurcharge?: number
  servicePrice?: number
  discount?: number
  disabled?: boolean
  buttonText?: string
  showTips?: boolean
  passengerBreakdown?: PassengerBreakdownItem[]
  serviceDetails?: ServiceDetail[]
}

// Props
const props = withDefaults(defineProps<Props>(), {
  airportFee: 50,
  fuelSurcharge: 30,
  servicePrice: 0,
  discount: 0,
  disabled: false,
  buttonText: '提交订单',
  showTips: true,
  passengerBreakdown: () => [],
  serviceDetails: () => []
})

// Emits
defineEmits<{
  submit: []
}>()

// 计算总价
const totalPrice = computed(() => {
  return (
    props.ticketPrice +
    props.airportFee +
    props.fuelSurcharge +
    props.servicePrice -
    props.discount
  )
})
</script>
