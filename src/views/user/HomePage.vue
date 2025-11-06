<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm sticky top-0 z-30">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <svg class="w-8 h-8 text-primary mr-2" fill="currentColor" viewBox="0 0 640 640">
                <path
                  d="M552 264C582.9 264 608 289.1 608 320C608 350.9 582.9 376 552 376L424.7 376L265.5 549.6C259.4 556.2 250.9 560 241.9 560L198.2 560C187.3 560 179.6 549.3 183 538.9L237.3 376L137.6 376L84.8 442C81.8 445.8 77.2 448 72.3 448L52.5 448C42.1 448 34.5 438.2 37 428.1L64 320L37 211.9C34.4 201.8 42.1 192 52.5 192L72.3 192C77.2 192 81.8 194.2 84.8 198L137.6 264L237.3 264L183 101.1C179.6 90.7 187.3 80 198.2 80L241.9 80C250.9 80 259.4 83.8 265.5 90.4L424.7 264L552 264z"
                />
              </svg>
              <span class="text-xl font-bold text-primary">SEUAirline</span>
            </router-link>
          </div>

          <div class="hidden md:flex space-x-8">
            <router-link to="/" class="text-primary font-medium">首页</router-link>
            <router-link to="/help" class="text-gray-600 hover:text-primary">帮助中心</router-link>
          </div>

          <div class="flex items-center space-x-4">
            <template v-if="isAuthenticated">
              <!-- 消息通知 -->
              <MessageNotification />
              
              <!-- 用户下拉菜单 -->
              <div class="relative">
                <button 
                  @click="toggleUserMenu"
                  class="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{{ userInfo?.username }}</span>
                  <svg 
                    class="w-4 h-4 transition-transform"
                    :class="{ 'rotate-180': showUserMenu }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <!-- 下拉菜单 -->
                <div
                  v-show="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
                >
                  <router-link
                    to="/user/profile"
                    class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>个人中心</span>
                    </div>
                  </router-link>
                  <router-link
                    to="/user/orders"
                    class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>我的订单</span>
                    </div>
                  </router-link>
                  <router-link
                    to="/user/passengers"
                    class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>常用旅客</span>
                    </div>
                  </router-link>
                  <router-link
                    to="/user/settings"
                    class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>账号设置</span>
                    </div>
                  </router-link>
                  <div class="border-t border-gray-200 my-2"></div>
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>退出登录</span>
                    </div>
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <router-link to="/login" class="btn-secondary">登录</router-link>
              <router-link to="/register" class="btn-primary">注册</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero区域 -->
    <section class="hero-gradient text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">探索世界，从这里开始</h1>
        <p class="text-xl mb-8 opacity-90">SEUAirline 为您提供优质的航空服务</p>
      </div>
    </section>

    <!-- 搜索表单 -->
    <section class="container mx-auto px-4 -mt-16 relative z-10">
      <div class="bg-white rounded-xl shadow-xl p-8">
        <div class="mb-6">
          <div class="flex space-x-4 mb-6">
            <button
              @click="tripType = 'oneWay'"
              :class="[
                'px-4 py-2 rounded-md transition-all',
                tripType === 'oneWay' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
              ]"
            >
              单程
            </button>
            <button
              @click="tripType = 'roundTrip'"
              :class="[
                'px-4 py-2 rounded-md transition-all',
                tripType === 'roundTrip' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
              ]"
            >
              往返
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">出发城市</label>
              <select v-model="searchForm.departureCity" class="input-field">
                <option value="">请选择</option>
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">到达城市</label>
              <select v-model="searchForm.arrivalCity" class="input-field">
                <option value="">请选择</option>
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">出发日期</label>
              <input v-model="searchForm.departureDate" type="date" class="input-field" />
            </div>

            <div v-if="tripType === 'roundTrip'">
              <label class="block text-sm font-medium text-gray-700 mb-2">返程日期</label>
              <input v-model="searchForm.returnDate" type="date" class="input-field" />
            </div>
          </div>

          <div class="mt-6 flex justify-center">
            <button @click="handleSearch" class="btn-primary px-12 py-3 text-lg">搜索航班</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门航线推荐 -->
    <section class="container mx-auto px-4 py-16 bg-gray-50">
      <PopularFlights />
    </section>

    <!-- 特色服务 -->
    <section class="container mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold text-center mb-12">为什么选择SEUAirline</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="card p-6 text-center card-hover">
          <div
            class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">优惠价格</h3>
          <p class="text-gray-600">提供最具竞争力的机票价格，让您的旅行更实惠</p>
        </div>

        <div class="card p-6 text-center card-hover">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">安全保障</h3>
          <p class="text-gray-600">严格的安全标准，为您的旅程保驾护航</p>
        </div>

        <div class="card p-6 text-center card-hover">
          <div
            class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">24/7客服</h3>
          <p class="text-gray-600">全天候客户服务，随时为您解答疑问</p>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-gray-800 text-white py-8 mt-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 640 640">
                <path
                  d="M552 264C582.9 264 608 289.1 608 320C608 350.9 582.9 376 552 376L424.7 376L265.5 549.6C259.4 556.2 250.9 560 241.9 560L198.2 560C187.3 560 179.6 549.3 183 538.9L237.3 376L137.6 376L84.8 442C81.8 445.8 77.2 448 72.3 448L52.5 448C42.1 448 34.5 438.2 37 428.1L64 320L37 211.9C34.4 201.8 42.1 192 52.5 192L72.3 192C77.2 192 81.8 194.2 84.8 198L137.6 264L237.3 264L183 101.1C179.6 90.7 187.3 80 198.2 80L241.9 80C250.9 80 259.4 83.8 265.5 90.4L424.7 264L552 264z"
                />
              </svg>
              <span class="font-bold text-lg">SEUAirline</span>
            </div>
            <p class="text-gray-400 text-sm mt-1">企业级航空订票系统</p>
          </div>

          <div class="text-gray-400 text-sm">
            <p>© 2024 SEUAirline. All rights reserved.</p>
            <p>基于 Vue 3 + TypeScript + Vite 构建</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFlightStore } from '@/stores/flight'
import PopularFlights from '@/components/PopularFlights.vue'
import MessageNotification from '@/components/MessageNotification.vue'

const router = useRouter()
const userStore = useUserStore()
const flightStore = useFlightStore()

const isAuthenticated = computed(() => userStore.isAuthenticated)
const userInfo = computed(() => userStore.userInfo)

// 用户菜单显示状态
const showUserMenu = ref(false)

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 关闭用户菜单
const closeUserMenu = () => {
  showUserMenu.value = false
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    closeUserMenu()
  }
}

const tripType = ref<'oneWay' | 'roundTrip'>('oneWay')
const searchForm = ref({
  departureCity: '',
  arrivalCity: '',
  departureDate: '',
  returnDate: ''
})

const cities = ref<string[]>([])

// 初始化
onMounted(async () => {
  // 监听点击事件关闭菜单
  document.addEventListener('click', handleClickOutside)
  
  // 加载机场数据
  console.log('开始加载机场数据...')
  await flightStore.loadAirports()
  console.log('机场数据加载完成:', flightStore.airports)
  console.log('机场数量:', flightStore.airports.length)
  cities.value = [...new Set(flightStore.airports.map(a => a.city))]
  console.log('提取的城市列表:', cities.value)
  console.log('城市数量:', cities.value.length)
})

// 清理
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleSearch() {
  if (
    !searchForm.value.departureCity ||
    !searchForm.value.arrivalCity ||
    !searchForm.value.departureDate
  ) {
    alert('请填写完整的搜索信息')
    return
  }

  router.push({
    name: 'FlightSearch',
    query: {
      from: searchForm.value.departureCity,
      to: searchForm.value.arrivalCity,
      date: searchForm.value.departureDate,
      returnDate: searchForm.value.returnDate,
      tripType: tripType.value
    }
  })
}

function handleLogout() {
  userStore.logout()
  alert('已退出登录')
}
</script>
