<template>
  <div 
    v-if="modelValue" 
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <!-- 对话框头部 -->
      <div class="p-5 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">
            {{ dialogTitle }}
          </h3>
          <button 
            @click="handleClose" 
            class="text-gray-400 hover:text-gray-500"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- 对话框内容 -->
      <form @submit.prevent="handleSubmit" class="p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 航班号 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              航班号 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formData.flightNo" 
              type="text" 
              class="input-field" 
              placeholder="例如: CA1234"
              :disabled="mode === 'view'"
              required
            >
          </div>

          <!-- 航空公司 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              航空公司 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formData.airline" 
              type="text" 
              class="input-field" 
              placeholder="例如: 中国国际航空"
              :disabled="mode === 'view'"
              required
            >
          </div>

          <!-- 机型 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              机型
            </label>
            <input 
              v-model="formData.aircraft" 
              type="text" 
              class="input-field" 
              placeholder="例如: 波音737"
              :disabled="mode === 'view'"
            >
          </div>

          <!-- 出发机场 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              出发机场 <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="formData.departureAirport" 
              class="input-field"
              :disabled="mode === 'view'"
              required
            >
              <option value="">请选择出发机场</option>
              <option v-for="airport in airports" :key="airport.code" :value="airport.code">
                {{ airport.name }} ({{ airport.code }})
              </option>
            </select>
          </div>

          <!-- 到达机场 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              到达机场 <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="formData.arrivalAirport" 
              class="input-field"
              :disabled="mode === 'view'"
              required
            >
              <option value="">请选择到达机场</option>
              <option v-for="airport in airports" :key="airport.code" :value="airport.code">
                {{ airport.name }} ({{ airport.code }})
              </option>
            </select>
          </div>

          <!-- 航班日期 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              航班日期 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formData.date" 
              type="date" 
              class="input-field"
              :disabled="mode === 'view'"
              required
            >
          </div>

          <!-- 起飞时间 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              起飞时间 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formData.departureTime" 
              type="time" 
              class="input-field"
              :disabled="mode === 'view'"
              required
            >
          </div>

          <!-- 到达时间 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              到达时间 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="formData.arrivalTime" 
              type="time" 
              class="input-field"
              :disabled="mode === 'view'"
              required
            >
          </div>

          <!-- 飞行时长 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              飞行时长
            </label>
            <input 
              v-model="formData.duration" 
              type="text" 
              class="input-field" 
              placeholder="例如: 2h 20m"
              :disabled="mode === 'view'"
            >
          </div>

          <!-- 经济舱价格 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              经济舱价格 <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-400">¥</span>
              </div>
              <input 
                v-model.number="formData.price" 
                type="number" 
                class="input-field pl-8" 
                placeholder="0.00"
                min="0"
                step="0.01"
                :disabled="mode === 'view'"
                required
              >
            </div>
          </div>

          <!-- 经济舱座位 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              经济舱座位 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model.number="formData.economySeats" 
              type="number" 
              class="input-field" 
              placeholder="0"
              min="0"
              :disabled="mode === 'view'"
              required
            >
          </div>

          <!-- 商务舱座位 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              商务舱座位
            </label>
            <input 
              v-model.number="formData.businessSeats" 
              type="number" 
              class="input-field" 
              placeholder="0"
              min="0"
              :disabled="mode === 'view'"
            >
          </div>

          <!-- 头等舱座位 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              头等舱座位
            </label>
            <input 
              v-model.number="formData.firstClassSeats" 
              type="number" 
              class="input-field" 
              placeholder="0"
              min="0"
              :disabled="mode === 'view'"
            >
          </div>

          <!-- 航班状态 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              航班状态 <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="formData.status" 
              class="input-field"
              :disabled="mode === 'view'"
              required
            >
              <option value="scheduled">已排班</option>
              <option value="delayed">延误</option>
              <option value="cancelled">已取消</option>
              <option value="completed">已完成</option>
            </select>
          </div>
        </div>

        <!-- 按钮组 -->
        <div v-if="mode !== 'view'" class="flex justify-end space-x-3 mt-6">
          <button 
            type="button" 
            @click="handleClose" 
            class="btn-outline"
          >
            取消
          </button>
          <button 
            type="submit" 
            class="btn-primary"
          >
            {{ mode === 'add' ? '添加航班' : '保存修改' }}
          </button>
        </div>
        <div v-else class="flex justify-end mt-6">
          <button 
            type="button" 
            @click="handleClose" 
            class="btn-primary"
          >
            关闭
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Flight } from '@/types/flight'

const props = defineProps<{
  modelValue: boolean
  flight: Flight | null
  mode: 'add' | 'edit' | 'view'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [flight: Flight]
}>()

// 机场列表
const airports = ref([
  { code: 'PEK', name: '北京首都', city: '北京' },
  { code: 'SHA', name: '上海虹桥', city: '上海' },
  { code: 'PVG', name: '上海浦东', city: '上海' },
  { code: 'CAN', name: '广州白云', city: '广州' },
  { code: 'SZX', name: '深圳宝安', city: '深圳' },
  { code: 'CTU', name: '成都双流', city: '成都' },
  { code: 'HGH', name: '杭州萧山', city: '杭州' },
  { code: 'WUH', name: '武汉天河', city: '武汉' },
  { code: 'XIY', name: '西安咸阳', city: '西安' },
  { code: 'NKG', name: '南京禄口', city: '南京' }
])

// 表单数据
const formData = ref<Partial<Flight>>({
  flightNo: '',
  airline: '',
  aircraft: '',
  departureAirport: '',
  arrivalAirport: '',
  departureCity: '',
  arrivalCity: '',
  departureTime: '',
  arrivalTime: '',
  date: '',
  duration: '',
  price: 0,
  economySeats: 0,
  businessSeats: 0,
  firstClassSeats: 0,
  status: 'scheduled'
})

// 对话框标题
const dialogTitle = computed(() => {
  if (props.mode === 'add') return '添加航班'
  if (props.mode === 'edit') return '编辑航班'
  return '查看航班详情'
})

// 监听flight变化，更新表单数据
watch(() => props.flight, (newFlight) => {
  if (newFlight) {
    formData.value = { ...newFlight }
  } else {
    resetForm()
  }
}, { immediate: true })

// 监听机场选择，自动填充城市
watch(() => formData.value.departureAirport, (code) => {
  const airport = airports.value.find(a => a.code === code)
  if (airport) {
    formData.value.departureCity = airport.city
  }
})

watch(() => formData.value.arrivalAirport, (code) => {
  const airport = airports.value.find(a => a.code === code)
  if (airport) {
    formData.value.arrivalCity = airport.city
  }
})

// 重置表单
function resetForm() {
  formData.value = {
    flightNo: '',
    airline: '',
    aircraft: '',
    departureAirport: '',
    arrivalAirport: '',
    departureCity: '',
    arrivalCity: '',
    departureTime: '',
    arrivalTime: '',
    date: '',
    duration: '',
    price: 0,
    economySeats: 0,
    businessSeats: 0,
    firstClassSeats: 0,
    status: 'scheduled'
  }
}

// 关闭对话框
function handleClose() {
  emit('update:modelValue', false)
  setTimeout(resetForm, 300)
}

// 提交表单
function handleSubmit() {
  // 生成ID（如果是新增）
  if (props.mode === 'add') {
    formData.value.id = 'FL' + Date.now()
  }

  emit('save', formData.value as Flight)
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-900 transition-all;
}

.input-field:disabled {
  @apply bg-gray-100 cursor-not-allowed;
}

.btn-primary {
  @apply bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-all duration-300;
}

.btn-outline {
  @apply bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-all duration-300;
}
</style>
