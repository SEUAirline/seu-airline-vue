<template>
  <div class="popular-flights">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">热门航线</h2>
      <p class="text-sm text-gray-500">为您推荐最受欢迎的航线</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="route in popularRoutes"
        :key="`${route.from}-${route.to}`"
        class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500"
        @click="handleRouteClick(route)"
      >
        <!-- 顶部装饰条 -->
        <div class="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        <div class="p-6">
          <!-- 航线信息 -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ route.from }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ route.fromCode }}</div>
              </div>

              <div class="flex flex-col items-center">
                <svg
                  class="w-8 h-8 text-blue-500 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
                <div class="text-xs text-gray-400 mt-1">直飞</div>
              </div>

              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ route.to }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ route.toCode }}</div>
              </div>
            </div>
          </div>

          <!-- 价格和航班数 -->
          <div class="flex items-end justify-between mt-6">
            <div>
              <p class="text-sm text-gray-500 mb-1">最低价格</p>
              <div class="flex items-baseline">
                <span class="text-3xl font-bold text-blue-600">¥{{ route.minPrice }}</span>
                <span class="text-sm text-gray-500 ml-1">起</span>
              </div>
            </div>

            <div class="text-right">
              <div class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  />
                </svg>
                <span class="text-sm font-medium">{{ route.flightCount }} 个航班</span>
              </div>
            </div>
          </div>

          <!-- 特色标签 -->
          <div class="flex flex-wrap gap-2 mt-4" v-if="route.tags && route.tags.length > 0">
            <span
              v-for="tag in route.tags"
              :key="tag"
              class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 底部悬停效果 -->
        <div
          class="h-0 group-hover:h-2 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface PopularRoute {
  from: string
  fromCode: string
  to: string
  toCode: string
  minPrice: number
  flightCount: number
  tags?: string[]
}

// 热门航线数据
const popularRoutes: PopularRoute[] = [
  {
    from: '南京',
    fromCode: 'NKG',
    to: '北京',
    toCode: 'PEK',
    minPrice: 680,
    flightCount: 12,
    tags: ['商务热线', '高频航线']
  },
  {
    from: '南京',
    fromCode: 'NKG',
    to: '上海',
    toCode: 'PVG',
    minPrice: 320,
    flightCount: 20,
    tags: ['经济实惠', '航班密集']
  },
  {
    from: '南京',
    fromCode: 'NKG',
    to: '广州',
    toCode: 'CAN',
    minPrice: 850,
    flightCount: 8,
    tags: ['热门航线']
  },
  {
    from: '南京',
    fromCode: 'NKG',
    to: '成都',
    toCode: 'CTU',
    minPrice: 920,
    flightCount: 10,
    tags: ['旅游热线', '美食之都']
  },
  {
    from: '南京',
    fromCode: 'NKG',
    to: '深圳',
    toCode: 'SZX',
    minPrice: 880,
    flightCount: 9,
    tags: ['科技之都']
  },
  {
    from: '南京',
    fromCode: 'NKG',
    to: '杭州',
    toCode: 'HGH',
    minPrice: 380,
    flightCount: 15,
    tags: ['短途优选', '风景优美']
  }
]

const router = useRouter()

// 点击航线跳转到搜索页
function handleRouteClick(route: PopularRoute) {
  // 获取明天的日期作为默认出发日期
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const departureDate = tomorrow.toISOString().split('T')[0]

  router.push({
    name: 'FlightSearch',
    query: {
      tripType: 'oneWay',
      from: route.from,
      to: route.to,
      date: departureDate,
      passengers: '1',
      cabin: 'economy'
    }
  })
}
</script>
