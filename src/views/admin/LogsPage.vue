<template>
  <AdminLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">系统日志</h1>
      <p class="text-gray-500 mt-1">查看系统操作日志、登录日志和错误日志</p>
    </div>

    <!-- 筛选栏 -->
    <div class="card mb-6">
      <div class="card-body">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">日志类型</label>
              <select v-model="filter.type" class="input-field">
                <option value="">全部</option>
                <option value="login">登录日志</option>
                <option value="operation">操作日志</option>
                <option value="error">错误日志</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
              <input v-model="filter.startDate" type="date" class="input-field">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
              <input v-model="filter.endDate" type="date" class="input-field">
            </div>
          </div>
          <div class="flex items-end space-x-3">
            <button @click="handleSearch" class="btn-primary"><i class="fas fa-search mr-1"></i> 查询</button>
            <button @click="handleExport" class="btn-outline"><i class="fas fa-download mr-1"></i> 导出</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 日志列表 -->
    <div class="card">
      <div class="card-header">
        <h3 class="font-medium text-gray-800">日志记录</h3>
        <div class="text-sm text-gray-500">共 <span class="font-medium text-blue-900">{{ logs.length }}</span> 条记录</div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP地址</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in logs" :key="log.id">
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{{ log.time }}</td>
              <td class="px-5 py-4 whitespace-nowrap">
                <span :class="getTypeClass(log.type)">{{ getTypeText(log.type) }}</span>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{{ log.user }}</td>
              <td class="px-5 py-4 text-sm text-gray-600">{{ log.action }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{{ log.ip }}</td>
              <td class="px-5 py-4 whitespace-nowrap">
                <span :class="log.status === 'success' ? 'text-green-600' : 'text-red-600'">
                  <i :class="log.status === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const filter = ref({ type: '', startDate: '', endDate: '' })

const logs = ref([
  { id: 1, time: '2025-11-10 21:30:15', type: 'login', user: 'admin', action: '管理员登录', ip: '192.168.1.100', status: 'success' },
  { id: 2, time: '2025-11-10 21:25:32', type: 'operation', user: 'admin', action: '修改航班 CA1234 信息', ip: '192.168.1.100', status: 'success' },
  { id: 3, time: '2025-11-10 21:20:45', type: 'operation', user: 'admin', action: '删除订单 ORD20231110001', ip: '192.168.1.100', status: 'success' },
  { id: 4, time: '2025-11-10 21:15:12', type: 'error', user: 'admin', action: '导出订单数据失败', ip: '192.168.1.100', status: 'failed' },
  { id: 5, time: '2025-11-10 21:10:28', type: 'login', user: 'admin', action: '管理员登录', ip: '192.168.1.100', status: 'success' }
])

function getTypeClass(type: string) {
  const classes = {
    login: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    operation: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    error: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
  }
  return classes[type as keyof typeof classes]
}

function getTypeText(type: string) {
  const texts = { login: '登录', operation: '操作', error: '错误' }
  return texts[type as keyof typeof texts]
}

function handleSearch() {}
function handleExport() { alert('导出功能待实现') }
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden; }
.card-header { @apply px-5 py-4 border-b border-gray-100 flex justify-between items-center; }
.card-body { @apply px-5 py-4; }
.input-field { @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900/50; }
.btn-primary { @apply bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800; }
.btn-outline { @apply bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50; }
</style>
