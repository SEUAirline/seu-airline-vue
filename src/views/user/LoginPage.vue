<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">用户登录</h1>
        <p class="text-gray-600 mt-2">登录后享受更多会员专享服务</p>
      </div>

      <div class="bg-white rounded-xl p-8 card-shadow">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              v-model="loginForm.username"
              type="text"
              class="input-field"
              placeholder="请输入用户名"
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

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <div class="mt-4 text-center text-sm">
          <span class="text-gray-600">还没有账号？</span>
          <router-link to="/register" class="text-primary hover:underline">立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})

async function handleLogin() {
  loading.value = true
  try {
    const result = await userStore.login(loginForm.value)
    if (result.success) {
      // 登录成功，直接跳转，不显示弹窗
      router.push('/')
    } else {
      console.error('登录失败:', result.message)
    }
  } finally {
    loading.value = false
  }
}
</script>
