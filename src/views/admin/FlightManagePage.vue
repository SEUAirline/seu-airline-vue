<template>
  <AdminLayout>
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">航班管理</h1>
      <p class="text-gray-500 mt-1">管理所有航班信息，包括添加、编辑、删除和查看航班详情</p>
    </div>

    <!-- 搜索栏 -->
    <div class="card mb-6">
      <div class="card-body">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">航班号</label>
              <input 
                v-model="searchForm.flightNo" 
                type="text" 
                class="input-field" 
                placeholder="输入航班号"
                @keyup.enter="handleSearch"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">出发机场</label>
              <select v-model="searchForm.departureAirport" class="input-field">
                <option value="">全部</option>
                <option v-for="airport in airports" :key="airport.code" :value="airport.code">
                  {{ airport.name }} ({{ airport.code }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">到达机场</label>
              <select v-model="searchForm.arrivalAirport" class="input-field">
                <option value="">全部</option>
                <option v-for="airport in airports" :key="airport.code" :value="airport.code">
                  {{ airport.name }} ({{ airport.code }})
                </option>
              </select>
            </div>
          </div>
          <div class="flex items-end space-x-3">
            <button @click="handleSearch" class="btn-primary">
              <i class="fas fa-search mr-1"></i> 搜索
            </button>
            <button @click="handleAddFlight" class="btn-secondary">
              <i class="fas fa-plus mr-1"></i> 添加航班
            </button>
            <button @click="handleResetSearch" class="btn-outline">
              <i class="fas fa-sync mr-1"></i> 重置
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 航班列表 -->
    <div class="card">
      <div class="card-header">
        <div class="flex justify-between items-center w-full">
          <h3 class="font-medium text-gray-800">航班列表</h3>
          <div class="flex items-center space-x-3">
            <div class="relative">
              <select 
                v-model="statusFilter" 
                @change="handleSearch"
                class="pl-3 pr-10 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900"
              >
                <option value="">全部状态</option>
                <option value="scheduled">已排班</option>
                <option value="delayed">延误</option>
                <option value="cancelled">已取消</option>
              </select>
              <i class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none"></i>
            </div>
            <div class="text-sm text-gray-500">
              共 <span class="font-medium text-blue-900">{{ filteredFlights.length }}</span> 个航班
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">航班号</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">机型</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出发</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">到达</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">起飞时间</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">到达时间</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">座位数</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="flight in paginatedFlights" :key="flight.id">
              <td class="px-5 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                {{ flight.flightNo }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ flight.aircraft || '-' }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-800">{{ flight.departureAirport }}</div>
                <div class="text-xs text-gray-500">{{ flight.departureCity }}</div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-800">{{ flight.arrivalAirport }}</div>
                <div class="text-xs text-gray-500">{{ flight.arrivalCity }}</div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ flight.departureTime }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ flight.arrivalTime }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                ¥{{ flight.price.toLocaleString() }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600">
                  可用 <span :class="getSeatColorClass(flight)">{{ getAvailableSeats(flight) }}</span>/{{ getTotalSeats(flight) }}
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    :class="getSeatBarColorClass(flight)" 
                    class="h-1.5 rounded-full" 
                    :style="{ width: getSeatPercentage(flight) + '%' }"
                  ></div>
                </div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <span :class="getStatusClass(flight.status)">
                  {{ getStatusText(flight.status) }}
                </span>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm">
                <div class="flex space-x-2">
                  <button 
                    @click="handleEditFlight(flight)" 
                    class="text-blue-900 hover:text-blue-700 transition-colors" 
                    title="编辑"
                  >
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button 
                    @click="handleViewFlight(flight)" 
                    class="text-gray-600 hover:text-gray-800 transition-colors" 
                    title="查看详情"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="handleDeleteFlight(flight)" 
                    class="text-red-600 hover:text-red-800 transition-colors" 
                    title="删除航班"
                    :disabled="flight.status === 'cancelled'"
                    :class="{ 'opacity-50 cursor-not-allowed': flight.status === 'cancelled' }"
                  >
                    <i class="fas fa-times-circle"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredFlights.length === 0">
              <td colspan="10" class="px-5 py-8 text-center text-gray-500">
                暂无航班数据
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="filteredFlights.length > 0" class="px-5 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
        <div class="text-sm text-gray-700 mb-4 sm:mb-0">
          显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredFlights.length) }} 条，共 {{ filteredFlights.length }} 条
        </div>
        <nav class="inline-flex rounded-md shadow">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 border-t border-b border-gray-300 text-sm font-medium',
              currentPage === page 
                ? 'bg-blue-900 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
    </div>

    <!-- 添加/编辑航班对话框 -->
    <FlightDialog 
      v-model="showDialog" 
      :flight="selectedFlight"
      :mode="dialogMode"
      @save="handleSaveFlight"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import FlightDialog from '@/components/admin/FlightDialog.vue'
import type { Flight } from '@/types/flight'
import { mockApi } from '@/api/mock'

// 搜索表单
const searchForm = ref({
  flightNo: '',
  departureAirport: '',
  arrivalAirport: ''
})

// 状态筛选
const statusFilter = ref('')

// 航班列表
const flights = ref<Flight[]>([])

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
  { code: 'XIY', name: '西安咒阳', city: '西安' },
  { code: 'NKG', name: '南京禄口', city: '南京' }
])

// 对话框相关
const showDialog = ref(false)
const selectedFlight = ref<Flight | null>(null)
const dialogMode = ref<'add' | 'edit' | 'view'>('add')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选后的航班列表
const filteredFlights = computed(() => {
  let result = flights.value

  // 航班号筛选
  if (searchForm.value.flightNo) {
    result = result.filter(f => 
      f.flightNo.toLowerCase().includes(searchForm.value.flightNo.toLowerCase())
    )
  }

  // 出发机场筛选
  if (searchForm.value.departureAirport) {
    result = result.filter(f => f.departureAirport === searchForm.value.departureAirport)
  }

  // 到达机场筛选
  if (searchForm.value.arrivalAirport) {
    result = result.filter(f => f.arrivalAirport === searchForm.value.arrivalAirport)
  }

  // 状态筛选
  if (statusFilter.value) {
    result = result.filter(f => f.status === statusFilter.value)
  }

  return result
})

// 分页后的航班列表
const paginatedFlights = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredFlights.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredFlights.value.length / pageSize.value)
})

// 可见页码
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 加载航班数据
async function loadFlights() {
  try {
    const response = await mockApi.searchFlights({
      tripType: 'oneWay',
      departureCity: '',
      arrivalCity: '',
      departureDate: '',
      passengers: 1,
      cabinClass: 'economy'
    })
    if (response.success && response.data) {
      flights.value = response.data
    }
  } catch (error) {
    console.error('加载航班数据失败:', error)
  }
}

// 搜索航班
function handleSearch() {
  currentPage.value = 1
}

// 重置搜索
function handleResetSearch() {
  searchForm.value = {
    flightNo: '',
    departureAirport: '',
    arrivalAirport: ''
  }
  statusFilter.value = ''
  currentPage.value = 1
}

// 添加航班
function handleAddFlight() {
  selectedFlight.value = null
  dialogMode.value = 'add'
  showDialog.value = true
}

// 编辑航班
function handleEditFlight(flight: Flight) {
  selectedFlight.value = { ...flight }
  dialogMode.value = 'edit'
  showDialog.value = true
}

// 查看航班
function handleViewFlight(flight: Flight) {
  selectedFlight.value = { ...flight }
  dialogMode.value = 'view'
  showDialog.value = true
}

// 删除航班
function handleDeleteFlight(flight: Flight) {
  if (flight.status === 'cancelled') return
  
  if (confirm(`确定要删除航班 ${flight.flightNo} 吗？`)) {
    flights.value = flights.value.filter(f => f.id !== flight.id)
    // TODO: 调用 API 删除
  }
}

// 保存航班
function handleSaveFlight(flight: Flight) {
  if (dialogMode.value === 'add') {
    flights.value.unshift(flight)
  } else if (dialogMode.value === 'edit') {
    const index = flights.value.findIndex(f => f.id === flight.id)
    if (index !== -1) {
      flights.value[index] = flight
    }
  }
  showDialog.value = false
}

// 获取可用座位数
function getAvailableSeats(flight: Flight): number {
  return flight.economySeats + flight.businessSeats + flight.firstClassSeats
}

// 获取总座位数
function getTotalSeats(flight: Flight): number {
  // 假设总座位是可用座位的1.5倍（示例）
  const available = getAvailableSeats(flight)
  return Math.ceil(available * 1.5)
}

// 获取座位百分比
function getSeatPercentage(flight: Flight): number {
  const available = getAvailableSeats(flight)
  const total = getTotalSeats(flight)
  return Math.round((available / total) * 100)
}

// 获取座位颜色类
function getSeatColorClass(flight: Flight): string {
  const percentage = getSeatPercentage(flight)
  if (percentage > 50) return 'font-medium text-green-600'
  if (percentage > 20) return 'font-medium text-yellow-600'
  return 'font-medium text-red-600'
}

// 获取座位进度条颜色
function getSeatBarColorClass(flight: Flight): string {
  const percentage = getSeatPercentage(flight)
  if (percentage > 50) return 'bg-green-600'
  if (percentage > 20) return 'bg-yellow-600'
  return 'bg-red-600'
}

// 获取状态样式
function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    'scheduled': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    'delayed': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    'cancelled': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800',
    'completed': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
  }
  return classes[status] || classes['scheduled']
}

// 获取状态文本
function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    'scheduled': '已排班',
    'delayed': '延误',
    'cancelled': '已取消',
    'completed': '已完成'
  }
  return texts[status] || status
}

// 页面加载时
onMounted(() => {
  loadFlights()
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden;
}

.card-header {
  @apply px-5 py-4 border-b border-gray-100 flex justify-between items-center;
}

.card-body {
  @apply px-5 py-4;
}

.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-900 transition-all;
}

.btn-primary {
  @apply bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-all duration-300;
}

.btn-secondary {
  @apply bg-white text-blue-900 border border-blue-900 px-4 py-2 rounded-md hover:bg-blue-50 transition-all duration-300;
}

.btn-outline {
  @apply bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-all duration-300;
}
</style>
