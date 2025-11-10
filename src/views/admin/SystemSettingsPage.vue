<template>
  <AdminLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">系统设置</h1>
      <p class="text-gray-500 mt-1">配置系统参数、邮件设置、支付配置等</p>
    </div>

    <!-- 基本设置 -->
    <div class="card mb-6">
      <div class="card-header">
        <h3 class="font-medium text-gray-800"><i class="fas fa-cog mr-2"></i>基本设置</h3>
      </div>
      <div class="card-body">
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">系统名称</label>
              <input v-model="settings.systemName" type="text" class="input-field">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">系统邮箱</label>
              <input v-model="settings.systemEmail" type="email" class="input-field">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">客服电话</label>
              <input v-model="settings.servicePhone" type="text" class="input-field">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">备案号</label>
              <input v-model="settings.icp" type="text" class="input-field">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 邮件设置 -->
    <div class="card mb-6">
      <div class="card-header">
        <h3 class="font-medium text-gray-800"><i class="fas fa-envelope mr-2"></i>邮件设置</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SMTP服务器</label>
            <input v-model="settings.smtpHost" type="text" class="input-field" placeholder="smtp.example.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SMTP端口</label>
            <input v-model="settings.smtpPort" type="number" class="input-field" placeholder="587">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">发件人邮箱</label>
            <input v-model="settings.smtpUser" type="email" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">邮箱密码</label>
            <input v-model="settings.smtpPassword" type="password" class="input-field">
          </div>
        </div>
      </div>
    </div>

    <!-- 支付设置 -->
    <div class="card mb-6">
      <div class="card-header">
        <h3 class="font-medium text-gray-800"><i class="fas fa-credit-card mr-2"></i>支付设置</h3>
      </div>
      <div class="card-body">
        <div class="space-y-4">
          <div class="flex items-center">
            <input v-model="settings.enableAlipay" type="checkbox" class="mr-2">
            <label class="text-sm font-medium text-gray-700">启用支付宝支付</label>
          </div>
          <div class="flex items-center">
            <input v-model="settings.enableWechat" type="checkbox" class="mr-2">
            <label class="text-sm font-medium text-gray-700">启用微信支付</label>
          </div>
          <div class="flex items-center">
            <input v-model="settings.enableBank" type="checkbox" class="mr-2">
            <label class="text-sm font-medium text-gray-700">启用银行卡支付</label>
          </div>
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="flex justify-end">
      <button @click="handleSave" class="btn-primary">
        <i class="fas fa-save mr-1"></i> 保存设置
      </button>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const settings = ref({
  systemName: 'SEUAirline 航空预订系统',
  systemEmail: 'service@seuairline.com',
  servicePhone: '400-123-4567',
  icp: '京ICP备12345678号',
  smtpHost: 'smtp.example.com',
  smtpPort: 587,
  smtpUser: 'noreply@seuairline.com',
  smtpPassword: '',
  enableAlipay: true,
  enableWechat: true,
  enableBank: false
})

function handleSave() {
  alert('设置已保存！')
}
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden; }
.card-header { @apply px-5 py-4 border-b border-gray-100; }
.card-body { @apply px-5 py-4; }
.input-field { @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900/50; }
.btn-primary { @apply bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800; }
</style>
