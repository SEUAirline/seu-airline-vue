<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">筛选条件</h3>

    <!-- 价格区间 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">价格区间</label>
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span>¥{{ localFilters.priceRange[0] }}</span>
          <span>¥{{ localFilters.priceRange[1] }}</span>
        </div>
        <input
          type="range"
          v-model.number="localFilters.priceRange[0]"
          :min="minPrice"
          :max="maxPrice"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          @change="handleFilterChange"
        />
        <input
          type="range"
          v-model.number="localFilters.priceRange[1]"
          :min="minPrice"
          :max="maxPrice"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          @change="handleFilterChange"
        />
      </div>
    </div>

    <!-- 起飞时间 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">起飞时间</label>
      <div class="space-y-2">
        <label
          v-for="time in timeRanges"
          :key="time.value"
          class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
        >
          <input
            type="checkbox"
            :value="time.value"
            v-model="localFilters.departureTime"
            @change="handleFilterChange"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="ml-3 text-sm text-gray-700">{{ time.label }}</span>
        </label>
      </div>
    </div>

    <!-- 航空公司 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">航空公司</label>
      <div class="space-y-2">
        <label
          v-for="airline in airlines"
          :key="airline"
          class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
        >
          <input
            type="checkbox"
            :value="airline"
            v-model="localFilters.airlines"
            @change="handleFilterChange"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="ml-3 text-sm text-gray-700">{{ airline }}</span>
        </label>
      </div>
    </div>

    <!-- 舱位类型 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">舱位类型</label>
      <div class="space-y-2">
        <label
          v-for="cabin in cabinTypes"
          :key="cabin.value"
          class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
        >
          <input
            type="radio"
            :value="cabin.value"
            v-model="localFilters.cabinClass"
            @change="handleFilterChange"
            class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span class="ml-3 text-sm text-gray-700">{{ cabin.label }}</span>
        </label>
      </div>
    </div>

    <!-- 只看直飞 -->
    <div class="mb-6">
      <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
        <input
          type="checkbox"
          v-model="localFilters.directOnly"
          @change="handleFilterChange"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span class="ml-3 text-sm text-gray-700">只看直飞</span>
      </label>
    </div>

    <!-- 重置按钮 -->
    <button
      @click="handleReset"
      class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
    >
      重置筛选
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

export interface FlightFilters {
  priceRange: [number, number]
  departureTime: string[]
  airlines: string[]
  cabinClass: string
  directOnly: boolean
}

interface Props {
  filters: FlightFilters
  airlines: string[]
  minPrice?: number
  maxPrice?: number
}

const props = withDefaults(defineProps<Props>(), {
  minPrice: 0,
  maxPrice: 5000
})

const emit = defineEmits<{
  update: [filters: FlightFilters]
  reset: []
}>()

// 本地筛选状态
const localFilters = ref<FlightFilters>({ ...props.filters })

// 时间段选项
const timeRanges = [
  { label: '00:00 - 06:00 (早晨)', value: 'morning' },
  { label: '06:00 - 12:00 (上午)', value: 'forenoon' },
  { label: '12:00 - 18:00 (下午)', value: 'afternoon' },
  { label: '18:00 - 24:00 (晚上)', value: 'evening' }
]

// 舱位类型
const cabinTypes = [
  { label: '经济舱', value: 'economy' },
  { label: '商务舱', value: 'business' },
  { label: '头等舱', value: 'first' }
]

// 监听外部筛选条件变化
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// 处理筛选变化
function handleFilterChange() {
  // 确保价格区间正确
  if (localFilters.value.priceRange[0] > localFilters.value.priceRange[1]) {
    const temp = localFilters.value.priceRange[0]
    localFilters.value.priceRange[0] = localFilters.value.priceRange[1]
    localFilters.value.priceRange[1] = temp
  }
  
  emit('update', { ...localFilters.value })
}

// 重置筛选
function handleReset() {
  localFilters.value = {
    priceRange: [props.minPrice, props.maxPrice],
    departureTime: [],
    airlines: [],
    cabinClass: 'economy',
    directOnly: false
  }
  emit('reset')
  emit('update', { ...localFilters.value })
}
</script>

<style scoped>
/* 自定义滑块样式 */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style>
