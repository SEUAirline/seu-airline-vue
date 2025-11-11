<template>
  <AdminLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">机场管理</h1>
      <p class="text-gray-500 mt-1">管理所有机场信息，包括机场代码、名称、城市和状态</p>
    </div>

    <!-- 搜索栏 -->
    <div class="card mb-6">
      <div class="card-body">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">机场名称</label>
              <input v-model="searchForm.name" type="text" class="input-field" placeholder="输入机场名称" @keyup.enter="handleSearch">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">机场代码</label>
              <input v-model="searchForm.code" type="text" class="input-field" placeholder="输入机场代码" @keyup.enter="handleSearch">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">所在城市</label>
              <input v-model="searchForm.city" type="text" class="input-field" placeholder="输入所在城市" @keyup.enter="handleSearch">
            </div>
          </div>
          <div class="flex items-end space-x-3">
            <button @click="handleSearch" class="btn-primary"><i class="fas fa-search mr-1"></i> 搜索</button>
            <button @click="handleReset" class="btn-outline"><i class="fas fa-sync mr-1"></i> 重置</button>
            <button @click="handleAdd" class="btn-success"><i class="fas fa-plus mr-1"></i> 添加机场</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 机场列表 -->
    <div class="card">
      <div class="card-header">
        <h3 class="font-medium text-gray-800">机场列表</h3>
        <div class="text-sm text-gray-500">共 <span class="font-medium text-blue-900">{{ airports.length }}</span> 个机场</div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">机场代码</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">机场名称</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">所在城市</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">国家</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">航站楼</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="airport in filteredAirports" :key="airport.code">
              <td class="px-5 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{{ airport.code }}</td>
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ airport.name }}</div>
                <div class="text-xs text-gray-500">{{ airport.nameEn }}</div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{{ airport.city }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{{ airport.country }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{{ airport.terminals }}</td>
              <td class="px-5 py-4 whitespace-nowrap">
                <span :class="airport.status === 'active' ? 'status-badge bg-green-100 text-green-800' : 'status-badge bg-red-100 text-red-800'">
                  {{ airport.status === 'active' ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm">
                <div class="flex space-x-2">
                  <button @click="handleEdit(airport)" class="text-blue-900 hover:text-blue-700" title="编辑"><i class="fas fa-pencil-alt"></i></button>
                  <button @click="handleToggleStatus(airport)" :class="airport.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'" :title="airport.status === 'active' ? '禁用' : '启用'">
                    <i :class="airport.status === 'active' ? 'fas fa-ban' : 'fas fa-check-circle'"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

interface Airport {
  code: string
  name: string
  nameEn: string
  city: string
  country: string
  terminals: number
  status: 'active' | 'disabled'
}

const searchForm = ref({ name: '', code: '', city: '' })

const airports = ref<Airport[]>([
  { code: 'PEK', name: '北京首都国际机场', nameEn: 'Beijing Capital International Airport', city: '北京', country: '中国', terminals: 3, status: 'active' },
  { code: 'SHA', name: '上海虹桥国际机场', nameEn: 'Shanghai Hongqiao International Airport', city: '上海', country: '中国', terminals: 2, status: 'active' },
  { code: 'PVG', name: '上海浦东国际机场', nameEn: 'Shanghai Pudong International Airport', city: '上海', country: '中国', terminals: 2, status: 'active' },
  { code: 'CAN', name: '广州白云国际机场', nameEn: 'Guangzhou Baiyun International Airport', city: '广州', country: '中国', terminals: 2, status: 'active' },
  { code: 'SZX', name: '深圳宝安国际机场', nameEn: 'Shenzhen Bao\'an International Airport', city: '深圳', country: '中国', terminals: 3, status: 'active' },
  { code: 'CTU', name: '成都双流国际机场', nameEn: 'Chengdu Shuangliu International Airport', city: '成都', country: '中国', terminals: 2, status: 'active' },
  { code: 'HGH', name: '杭州萧山国际机场', nameEn: 'Hangzhou Xiaoshan International Airport', city: '杭州', country: '中国', terminals: 3, status: 'active' },
  { code: 'WUH', name: '武汉天河国际机场', nameEn: 'Wuhan Tianhe International Airport', city: '武汉', country: '中国', terminals: 3, status: 'active' },
  { code: 'XIY', name: '西安咸阳国际机场', nameEn: 'Xi\'an Xianyang International Airport', city: '西安', country: '中国', terminals: 3, status: 'active' },
  { code: 'NKG', name: '南京禄口国际机场', nameEn: 'Nanjing Lukou International Airport', city: '南京', country: '中国', terminals: 2, status: 'active' }
])

const filteredAirports = computed(() => {
  let result = airports.value
  if (searchForm.value.name) result = result.filter(a => a.name.includes(searchForm.value.name))
  if (searchForm.value.code) result = result.filter(a => a.code.toLowerCase().includes(searchForm.value.code.toLowerCase()))
  if (searchForm.value.city) result = result.filter(a => a.city.includes(searchForm.value.city))
  return result
})

function handleSearch() {}
function handleReset() { searchForm.value = { name: '', code: '', city: '' } }
function handleAdd() { console.log('添加机场功能待实现') }
function handleEdit(airport: Airport) { console.log(`编辑机场: ${airport.name}`) }
function handleToggleStatus(airport: Airport) {
  airport.status = airport.status === 'active' ? 'disabled' : 'active'
}
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden; }
.card-header { @apply px-5 py-4 border-b border-gray-100 flex justify-between items-center; }
.card-body { @apply px-5 py-4; }
.input-field { @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-900; }
.btn-primary { @apply bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800; }
.btn-outline { @apply bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50; }
.btn-success { @apply bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700; }
.status-badge { @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium; }
</style>
