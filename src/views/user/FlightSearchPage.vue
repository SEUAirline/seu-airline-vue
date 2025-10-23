<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 搜索条件摘要 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div>
              <p class="text-sm text-gray-500">出发地</p>
              <p class="text-lg font-semibold text-gray-900">{{ searchParams.departureCity }}</p>
            </div>
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div>
              <p class="text-sm text-gray-500">目的地</p>
              <p class="text-lg font-semibold text-gray-900">{{ searchParams.arrivalCity }}</p>
            </div>
            <div class="ml-6">
              <p class="text-sm text-gray-500">出发日期</p>
              <p class="text-lg font-semibold text-gray-900">{{ formatDate(searchParams.departureDate) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">乘客</p>
              <p class="text-lg font-semibold text-gray-900">{{ searchParams.passengers }}人</p>
            </div>
          </div>
          <button
            @click="handleModifySearch"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            修改搜索
          </button>
        </div>
      </div>

      <div class="flex gap-6">
        <!-- 左侧筛选栏 -->
        <div class="w-64 flex-shrink-0">
          <FlightFilter
            :filters="filters"
            :airlines="availableAirlines"
            :min-price="priceRange.min"
            :max-price="priceRange.max"
            @update="handleFilterUpdate"
            @reset="handleFilterReset"
          />
        </div>

        <!-- 右侧航班列表 -->
        <div class="flex-1">
          <!-- 排序和结果统计 -->
          <div class="bg-white rounded-lg shadow-md p-4 mb-4">
            <div class="flex items-center justify-between">
              <p class="text-gray-600">
                找到 <span class="font-semibold text-gray-900">{{ filteredFlights.length }}</span> 个航班
              </p>
              <div class="flex items-center gap-4">
                <label class="text-sm text-gray-600">排序方式:</label>
                <select
                  v-model="sortBy"
                  @change="handleSortChange"
                  class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="price-asc">价格从低到高</option>
                  <option value="price-desc">价格从高到低</option>
                  <option value="time-asc">起飞时间早到晚</option>
                  <option value="time-desc">起飞时间晚到早</option>
                  <option value="duration-asc">飞行时长短到长</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">正在搜索航班...</p>
          </div>

          <!-- 航班列表 -->
          <div v-else-if="paginatedFlights.length > 0">
            <FlightCard
              v-for="flight in paginatedFlights"
              :key="flight.id"
              :flight="flight"
              @book="handleBook"
              @view-detail="handleViewDetail"
            />

            <!-- 分页 -->
            <Pagination
              v-if="filteredFlights.length > pageSize"
              :current-page="currentPage"
              :page-size="pageSize"
              :total="filteredFlights.length"
              @page-change="handlePageChange"
            />
          </div>

          <!-- 无结果提示 -->
          <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
            <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">未找到符合条件的航班</h3>
            <p class="text-gray-600 mb-6">请尝试修改搜索条件或筛选条件</p>
            <button
              @click="handleFilterReset"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重置筛选条件
            </button>
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
import type { Flight } from '@/types/flight'
import type { FlightFilters } from '@/components/FlightFilter.vue'
import FlightCard from '@/components/FlightCard.vue'
import FlightFilter from '@/components/FlightFilter.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const router = useRouter()
const flightStore = useFlightStore()

// 状态
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const sortBy = ref('price-asc')

// 筛选条件
const filters = ref<FlightFilters>({
  priceRange: [0, 5000],
  departureTime: [],
  airlines: [],
  cabinClass: 'economy',
  directOnly: false
})

// 搜索参数
const searchParams = computed(() => flightStore.searchParams)

// 搜索结果
const searchResults = computed(() => flightStore.searchResults)

// 可用航空公司列表
const availableAirlines = computed(() => {
  const airlines = new Set<string>()
  searchResults.value.forEach(flight => airlines.add(flight.airline))
  return Array.from(airlines)
})

// 价格区间
const priceRange = computed(() => {
  if (searchResults.value.length === 0) {
    return { min: 0, max: 5000 }
  }
  const prices = searchResults.value.map(f => f.price)
  return {
    min: Math.floor(Math.min(...prices) / 100) * 100,
    max: Math.ceil(Math.max(...prices) / 100) * 100
  }
})

// 筛选后的航班
const filteredFlights = computed(() => {
  let flights = [...searchResults.value]

  // 价格筛选
  flights = flights.filter(f => 
    f.price >= filters.value.priceRange[0] && 
    f.price <= filters.value.priceRange[1]
  )

  // 起飞时间筛选
  if (filters.value.departureTime.length > 0) {
    flights = flights.filter(f => {
      const hour = new Date(f.departureTime).getHours()
      return filters.value.departureTime.some(timeRange => {
        if (timeRange === 'morning') return hour >= 0 && hour < 6
        if (timeRange === 'forenoon') return hour >= 6 && hour < 12
        if (timeRange === 'afternoon') return hour >= 12 && hour < 18
        if (timeRange === 'evening') return hour >= 18 && hour < 24
        return false
      })
    })
  }

  // 航空公司筛选
  if (filters.value.airlines.length > 0) {
    flights = flights.filter(f => filters.value.airlines.includes(f.airline))
  }

  // 排序
  flights.sort((a, b) => {
    switch (sortBy.value) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'time-asc':
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
      case 'time-desc':
        return new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime()
      case 'duration-asc':
        return parseDuration(a.duration) - parseDuration(b.duration)
      default:
        return 0
    }
  })

  return flights
})

// 分页后的航班
const paginatedFlights = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredFlights.value.slice(start, end)
})

// 解析飞行时长（转换为分钟）
function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)小时(\d+)?分钟?/)
  if (match) {
    const hours = parseInt(match[1]) || 0
    const minutes = parseInt(match[2]) || 0
    return hours * 60 + minutes
  }
  return 0
}

// 格式化日期
function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[date.getDay()]
  return `${month}月${day}日 ${weekday}`
}

// 处理筛选更新
function handleFilterUpdate(newFilters: FlightFilters) {
  filters.value = newFilters
  currentPage.value = 1 // 重置到第一页
}

// 重置筛选
function handleFilterReset() {
  filters.value = {
    priceRange: [priceRange.value.min, priceRange.value.max],
    departureTime: [],
    airlines: [],
    cabinClass: 'economy',
    directOnly: false
  }
  currentPage.value = 1
}

// 处理排序变化
function handleSortChange() {
  currentPage.value = 1
}

// 处理分页变化
function handlePageChange(page: number) {
  currentPage.value = page
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 修改搜索
function handleModifySearch() {
  router.push('/')
}

// 预订航班
function handleBook(flight: Flight) {
  flightStore.selectFlight(flight)
  router.push({
    name: 'flight-book',
    params: { id: flight.id }
  })
}

// 查看详情
function handleViewDetail(flight: Flight) {
  flightStore.selectFlight(flight)
  // 可以打开一个模态框显示详情，或跳转到详情页
  console.log('查看航班详情:', flight)
}

// 初始化
onMounted(async () => {
  // 如果没有搜索结果，从URL参数重新搜索
  if (searchResults.value.length === 0) {
    const params = {
      tripType: (route.query.tripType as string) || 'oneWay',
      departureCity: (route.query.from as string) || '',
      arrivalCity: (route.query.to as string) || '',
      departureDate: (route.query.date as string) || '',
      passengers: parseInt(route.query.passengers as string) || 1,
      cabinClass: (route.query.cabin as string) || 'economy'
    }

    if (params.departureCity && params.arrivalCity && params.departureDate) {
      loading.value = true
      await flightStore.searchFlights(params as any)
      loading.value = false
    } else {
      // 没有搜索参数，返回首页
      router.push('/')
    }
  }

  // 初始化筛选条件的价格区间
  filters.value.priceRange = [priceRange.value.min, priceRange.value.max]
})
</script>
