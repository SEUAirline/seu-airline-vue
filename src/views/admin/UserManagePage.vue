<template>
  <AdminLayout>
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">用户管理</h1>
      <p class="text-gray-500 mt-1">管理所有注册用户，包括用户信息查看、账户状态管理和订单查询</p>
    </div>

    <!-- 搜索栏 -->
    <div class="card mb-6">
      <div class="card-body">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input 
                v-model="searchForm.username" 
                type="text" 
                class="input-field" 
                placeholder="输入用户名"
                @keyup.enter="handleSearch"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
              <input 
                v-model="searchForm.phone" 
                type="text" 
                class="input-field" 
                placeholder="输入手机号"
                @keyup.enter="handleSearch"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">真实姓名</label>
              <input 
                v-model="searchForm.realName" 
                type="text" 
                class="input-field" 
                placeholder="输入真实姓名"
                @keyup.enter="handleSearch"
              >
            </div>
          </div>
          <div class="flex items-end space-x-3">
            <button @click="handleSearch" class="btn-primary">
              <i class="fas fa-search mr-1"></i> 搜索
            </button>
            <button @click="handleResetSearch" class="btn-outline">
              <i class="fas fa-sync mr-1"></i> 重置
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="card">
      <div class="card-header">
        <div class="flex justify-between items-center w-full">
          <h3 class="font-medium text-gray-800">用户列表</h3>
          <div class="flex items-center space-x-3">
            <div class="relative">
              <select 
                v-model="statusFilter" 
                @change="handleSearch"
                class="pl-3 pr-10 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900"
              >
                <option value="">全部状态</option>
                <option value="active">正常</option>
                <option value="disabled">禁用</option>
                <option value="pending">待验证</option>
              </select>
              <i class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none"></i>
            </div>
            <div class="text-sm text-gray-500">
              共 <span class="font-medium text-blue-900">{{ filteredUsers.length }}</span> 个用户
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户ID</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">真实姓名</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">手机号</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最后登录</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ user.id }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <i class="fas fa-user text-blue-900"></i>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                    <div class="text-xs text-gray-500">普通会员</div>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ user.realName || '-' }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatPhone(user.phone) }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ user.email || '-' }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createTime) }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(user.lastLoginTime) }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <span :class="getStatusClass(user.status)">
                  {{ getStatusText(user.status) }}
                </span>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm">
                <div class="flex space-x-2">
                  <button 
                    @click="handleViewUser(user)" 
                    class="text-blue-900 hover:text-blue-700 transition-colors" 
                    title="查看详情"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    v-if="user.status === 'active'"
                    @click="handleDisableUser(user)" 
                    class="text-red-600 hover:text-red-800 transition-colors" 
                    title="禁用账户"
                  >
                    <i class="fas fa-ban"></i>
                  </button>
                  <button 
                    v-if="user.status === 'disabled'"
                    @click="handleEnableUser(user)" 
                    class="text-green-600 hover:text-green-800 transition-colors" 
                    title="启用账户"
                  >
                    <i class="fas fa-check-circle"></i>
                  </button>
                  <button 
                    @click="handleViewOrders(user)" 
                    class="text-gray-600 hover:text-gray-800 transition-colors" 
                    title="查看订单"
                  >
                    <i class="far fa-file-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="9" class="px-5 py-8 text-center text-gray-500">
                暂无用户数据
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="filteredUsers.length > 0" class="px-5 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
        <div class="text-sm text-gray-700 mb-4 sm:mb-0">
          显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, filteredUsers.length) }} 条，共 {{ filteredUsers.length }} 条
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
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import type { User } from '@/types/user'
import { adminApi } from '@/api/admin'

// 搜索表单
const searchForm = ref({
  username: '',
  phone: '',
  realName: ''
})

// 状态筛选
const statusFilter = ref('')

// 用户列表
const users = ref<User[]>([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选后的用户列表
const filteredUsers = computed(() => {
  let result = users.value

  // 用户名筛选
  if (searchForm.value.username) {
    result = result.filter(u => 
      u.username.toLowerCase().includes(searchForm.value.username.toLowerCase())
    )
  }

  // 手机号筛选
  if (searchForm.value.phone) {
    result = result.filter(u => 
      u.phone?.includes(searchForm.value.phone)
    )
  }

  // 真实姓名筛选
  if (searchForm.value.realName) {
    result = result.filter(u => 
      u.realName?.toLowerCase().includes(searchForm.value.realName.toLowerCase())
    )
  }

  // 状态筛选
  if (statusFilter.value) {
    result = result.filter(u => u.status === statusFilter.value)
  }

  return result
})

// 分页后的用户列表
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / pageSize.value)
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

// 加载用户数据
async function loadUsers() {
  try {
    const response = await adminApi.getAllUsers()
    if (response.success && response.data) {
      users.value = response.data
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
}

// 搜索用户
function handleSearch() {
  currentPage.value = 1
}

// 重置搜索
function handleResetSearch() {
  searchForm.value = {
    username: '',
    phone: '',
    realName: ''
  }
  statusFilter.value = ''
  currentPage.value = 1
}

// 查看用户详情
function handleViewUser(user: User) {
  console.log(`用户详情：${user.username}`, user)
}

// 禁用用户
function handleDisableUser(user: User) {
  user.status = 'disabled'
}

// 启用用户
function handleEnableUser(user: User) {
  user.status = 'active'
}

// 查看用户订单
function handleViewOrders(user: User) {
  console.log(`查看用户 ${user.username} 的订单 - 功能待实现`)
}

// 格式化电话号码
function formatPhone(phone?: string): string {
  if (!phone) return '-'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 格式化日期
function formatDate(datetime?: string): string {
  if (!datetime) return '-'
  return datetime.substring(0, 10)
}

// 格式化日期时间
function formatDateTime(datetime?: string): string {
  if (!datetime) return '-'
  return datetime.replace('T', ' ').substring(0, 16)
}

// 获取状态样式
function getStatusClass(status?: string): string {
  const classes: Record<string, string> = {
    'active': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    'disabled': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800',
    'pending': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
  }
  return classes[status || 'active'] || classes['active']
}

// 获取状态文本
function getStatusText(status?: string): string {
  const texts: Record<string, string> = {
    'active': '正常',
    'disabled': '禁用',
    'pending': '待验证'
  }
  return texts[status || 'active'] || '正常'
}

// 页面加载时
onMounted(() => {
  loadUsers()
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

.btn-outline {
  @apply bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-all duration-300;
}
</style>
