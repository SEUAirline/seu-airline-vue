<template>
  <AdminLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">管理员账户</h1>
      <p class="text-gray-500 mt-1">管理系统管理员账户和权限</p>
    </div>

    <!-- 操作栏 -->
    <div class="mb-6 flex justify-between items-center">
      <div class="relative flex-1 max-w-md">
        <input v-model="searchQuery" type="text" class="input-field pl-10" placeholder="搜索管理员...">
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>
      <button @click="handleAddAdmin" class="btn-primary ml-4">
        <i class="fas fa-plus mr-1"></i> 添加管理员
      </button>
    </div>

    <!-- 管理员列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="admin in admins" :key="admin.id" class="card">
        <div class="card-body">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i class="fas fa-user-shield text-blue-900 text-xl"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-800">{{ admin.username }}</h3>
                <p class="text-xs text-gray-500">{{ admin.email }}</p>
              </div>
            </div>
            <span :class="admin.status === 'active' ? 'status-badge bg-green-100 text-green-800' : 'status-badge bg-red-100 text-red-800'">
              {{ admin.status === 'active' ? '正常' : '禁用' }}
            </span>
          </div>
          <div class="space-y-2 text-sm text-gray-600 mb-4">
            <div class="flex items-center">
              <i class="fas fa-shield-alt w-5 text-gray-400"></i>
              <span>{{ getRoleText(admin.role) }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-clock w-5 text-gray-400"></i>
              <span>最后登录: {{ admin.lastLogin }}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-calendar w-5 text-gray-400"></i>
              <span>创建时间: {{ admin.createdAt }}</span>
            </div>
          </div>
          <div class="flex space-x-2">
            <button @click="handleEdit(admin)" class="flex-1 btn-outline text-sm py-1">
              <i class="fas fa-edit mr-1"></i> 编辑
            </button>
            <button @click="handleToggleStatus(admin)" :class="admin.status === 'active' ? 'flex-1 btn-danger text-sm py-1' : 'flex-1 btn-success text-sm py-1'">
              <i :class="admin.status === 'active' ? 'fas fa-ban mr-1' : 'fas fa-check-circle mr-1'"></i>
              {{ admin.status === 'active' ? '禁用' : '启用' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const searchQuery = ref('')

const admins = ref([
  { id: 1, username: 'admin', email: 'admin@seuairline.com', role: 'super', status: 'active', lastLogin: '2025-11-10 21:30', createdAt: '2023-01-01' },
  { id: 2, username: 'manager', email: 'manager@seuairline.com', role: 'manager', status: 'active', lastLogin: '2025-11-10 18:45', createdAt: '2023-03-15' },
  { id: 3, username: 'operator', email: 'operator@seuairline.com', role: 'operator', status: 'active', lastLogin: '2025-11-09 22:10', createdAt: '2023-06-20' }
])

function getRoleText(role: string) {
  const roles = { super: '超级管理员', manager: '管理员', operator: '操作员' }
  return roles[role as keyof typeof roles]
}

function handleAddAdmin() { alert('添加管理员功能待实现') }
function handleEdit(admin: any) { alert(`编辑管理员: ${admin.username}`) }
function handleToggleStatus(admin: any) {
  admin.status = admin.status === 'active' ? 'disabled' : 'active'
  alert(`管理员${admin.username}已${admin.status === 'active' ? '启用' : '禁用'}`)
}
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden; }
.card-body { @apply p-5; }
.input-field { @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900/50; }
.btn-primary { @apply bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800; }
.btn-outline { @apply bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50; }
.btn-danger { @apply bg-white text-red-600 border border-red-300 px-4 py-2 rounded-md hover:bg-red-50; }
.btn-success { @apply bg-white text-green-600 border border-green-300 px-4 py-2 rounded-md hover:bg-green-50; }
.status-badge { @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium; }
</style>
