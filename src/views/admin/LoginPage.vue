<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">管理员登录</h1>
        <p class="text-gray-600 mt-2">SEUAirline 管理系统</p>
      </div>

      <div class="bg-white rounded-xl p-8 card-shadow">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">管理员账号</label>
            <input
              v-model="loginForm.username"
              type="text"
              class="input-field"
              placeholder="请输入管理员账号"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              v-model="loginForm.password"
              type="password"
              class="input-field"
              placeholder="请输入密码"
              required
            />
          </div>

          <div class="text-sm text-gray-500">
            <p>默认账号: admin</p>
            <p>默认密码: admin123</p>
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <div class="mt-4 text-center text-sm">
          <router-link to="/" class="text-primary hover:underline">返回用户端</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

const loading = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})

async function handleLogin() {
  loading.value = true
  try {
    const result = await adminStore.login(loginForm.value.username, loginForm.value.password)
    if (result.success) {
      alert('登录成功!')
      router.push('/admin/dashboard')
    } else {
      alert(result.message || '登录失败')
    }
  } finally {
    loading.value = false
  }
}
</script>
