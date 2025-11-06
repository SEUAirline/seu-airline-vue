<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">附加服务</h2>

    <div class="space-y-4">
      <!-- 行李额度 -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center">
            <svg
              class="w-6 h-6 text-blue-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div>
              <h3 class="font-medium text-gray-900">额外行李额</h3>
              <p class="text-sm text-gray-600 mt-1">免费托运20kg，超出部分需购买</p>
            </div>
          </div>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="localServices.extraBaggage"
              type="checkbox"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              @change="handleServiceChange"
            />
          </label>
        </div>
        <div v-if="localServices.extraBaggage" class="ml-9 space-y-2">
          <div class="flex items-center gap-4">
            <label class="text-sm text-gray-700">选择重量:</label>
            <select
              v-model="localServices.baggageWeight"
              @change="handleServiceChange"
              class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10kg - ¥150</option>
              <option value="20">20kg - ¥280</option>
              <option value="30">30kg - ¥400</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 航空保险 -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center">
            <svg
              class="w-6 h-6 text-green-600 mr-3"
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
            <div>
              <h3 class="font-medium text-gray-900">航空意外险</h3>
              <p class="text-sm text-gray-600 mt-1">最高赔付200万元，保障您的旅途安全</p>
            </div>
          </div>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="localServices.insurance"
              type="checkbox"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              @change="handleServiceChange"
            />
          </label>
        </div>
        <div v-if="localServices.insurance" class="ml-9 space-y-2">
          <div class="flex items-center gap-4">
            <label class="text-sm text-gray-700">保险类型:</label>
            <select
              v-model="localServices.insuranceType"
              @change="handleServiceChange"
              class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="basic">基础版 - ¥30</option>
              <option value="premium">尊享版 - ¥60</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 机上餐食 -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center">
            <svg
              class="w-6 h-6 text-orange-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <div>
              <h3 class="font-medium text-gray-900">机上餐食</h3>
              <p class="text-sm text-gray-600 mt-1">提前预订，享受美味航空餐</p>
            </div>
          </div>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="localServices.meal"
              type="checkbox"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              @change="handleServiceChange"
            />
          </label>
        </div>
        <div v-if="localServices.meal" class="ml-9 space-y-2">
          <div class="flex items-center gap-4">
            <label class="text-sm text-gray-700">餐食类型:</label>
            <select
              v-model="localServices.mealType"
              @change="handleServiceChange"
              class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="standard">标准餐 - ¥50</option>
              <option value="vegetarian">素食餐 - ¥50</option>
              <option value="halal">清真餐 - ¥50</option>
              <option value="premium">精选餐 - ¥80</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 贵宾休息室 -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-start justify-between">
          <div class="flex items-center">
            <svg
              class="w-6 h-6 text-purple-600 mr-3"
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
            <div>
              <h3 class="font-medium text-gray-900">贵宾休息室</h3>
              <p class="text-sm text-gray-600 mt-1">享受舒适候机环境，免费茶点饮料</p>
              <p class="text-sm font-medium text-purple-600 mt-1">¥120/人</p>
            </div>
          </div>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="localServices.lounge"
              type="checkbox"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              @change="handleServiceChange"
            />
          </label>
        </div>
      </div>
    </div>

    <!-- 费用小计 -->
    <div class="mt-6 pt-4 border-t border-gray-200">
      <div class="flex justify-between items-center">
        <span class="text-gray-700 font-medium">附加服务费用</span>
        <span class="text-xl font-bold text-blue-600">¥{{ totalServicePrice }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 类型定义
interface Services {
  extraBaggage: boolean
  baggageWeight: string
  insurance: boolean
  insuranceType: string
  meal: boolean
  mealType: string
  lounge: boolean
}

interface Props {
  services: Services
}

// Props
const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  update: [services: Services, totalPrice: number]
}>()

// 本地状态
const localServices = ref<Services>({ ...props.services })

// 价格配置
const prices = {
  baggage: { '10': 150, '20': 280, '30': 400 },
  insurance: { basic: 30, premium: 60 },
  meal: { standard: 50, vegetarian: 50, halal: 50, premium: 80 },
  lounge: 120
}

// 计算总价
const totalServicePrice = computed(() => {
  let total = 0

  if (localServices.value.extraBaggage) {
    total += prices.baggage[localServices.value.baggageWeight as keyof typeof prices.baggage] || 0
  }

  if (localServices.value.insurance) {
    total += prices.insurance[localServices.value.insuranceType as keyof typeof prices.insurance] || 0
  }

  if (localServices.value.meal) {
    total += prices.meal[localServices.value.mealType as keyof typeof prices.meal] || 0
  }

  if (localServices.value.lounge) {
    total += prices.lounge
  }

  return total
})

// 监听变化
watch(
  () => props.services,
  (newServices) => {
    localServices.value = { ...newServices }
  },
  { deep: true }
)

// 方法
const handleServiceChange = () => {
  emit('update', { ...localServices.value }, totalServicePrice.value)
}
</script>
