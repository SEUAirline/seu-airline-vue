<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute top-0 left-0 w-full h-full -z-10">
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full opacity-20"></div>
      <div class="absolute top-1/3 -left-32 w-96 h-96 bg-blue-900/10 rounded-full opacity-20"></div>
      <div class="absolute -bottom-20 right-1/4 w-72 h-72 bg-blue-200 rounded-full opacity-20"></div>
    </div>

    <div class="max-w-md w-full">
      <!-- 登录卡片 -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <!-- 头部 -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-4">
            <div class="bg-blue-900/10 p-3 rounded-lg">
              <i class="fas fa-lock text-3xl text-blue-900"></i>
            </div>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">管理员登录</h1>
          <p class="text-gray-500 mt-2">请输入您的管理员账号信息</p>
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          <i class="fas fa-exclamation-circle mr-2"></i>{{ errorMessage }}
        </div>

        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- 用户名 -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-user text-gray-400"></i>
              </div>
              <input
                id="username"
                v-model="loginForm.username"
                type="text"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-900 transition-all"
                placeholder="请输入管理员用户名"
                required
                autocomplete="username"
              />
            </div>
          </div>

          <!-- 密码 -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-key text-gray-400"></i>
              </div>
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900/50 focus:border-blue-900 transition-all"
                placeholder="请输入密码"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </button>
            </div>
          </div>

          <!-- 记住我 -->
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="loginForm.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
              记住我
            </label>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            class="w-full bg-blue-900 text-white px-4 py-3 rounded-md hover:bg-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <i v-if="!loading" class="fas fa-sign-in-alt mr-2"></i>
            <i v-else class="fas fa-spinner fa-spin mr-2"></i>
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 登录说明 -->
        <div class="mt-6 text-center text-sm text-gray-500">
          <p>仅管理员账户可登录此系统</p>
          <p class="mt-2">
            登录即表示您同意我们的
            <a href="#" class="text-blue-900 hover:text-blue-800">服务条款</a>
            和
            <a href="#" class="text-blue-900 hover:text-blue-800">隐私政策</a>
          </p>
        </div>

        <!-- 返回用户端 -->
        <div class="mt-4 text-center text-sm">
          <router-link to="/" class="text-blue-900 hover:underline">
            <i class="fas fa-arrow-left mr-1"></i>返回用户端
          </router-link>
        </div>
      </div>

      <!-- 系统信息 -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <p>© 2024 SEUAirline 航空管理系统</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false
})

// 处理登录
async function handleLogin() {
  // 清除之前的错误信息
  errorMessage.value = ''
  
  // 表单验证
  if (!loginForm.value.username || !loginForm.value.password) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  
  try {
    const result = await adminStore.login(loginForm.value.username, loginForm.value.password)
    
    if (result.success) {
      // 处理记住我功能
      if (loginForm.value.rememberMe) {
        localStorage.setItem('adminRememberMe', 'true')
        localStorage.setItem('adminUsername', loginForm.value.username)
      } else {
        localStorage.removeItem('adminRememberMe')
        localStorage.removeItem('adminUsername')
      }
      
      // 登录成功，跳转到仪表盘
      router.push('/admin/dashboard')
    } else {
      errorMessage.value = result.message || '登录失败，请检查用户名和密码'
    }
  } catch (error) {
    console.error('登录过程中发生错误:', error)
    errorMessage.value = '登录过程中发生错误，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 页面加载时检查是否已登录
onMounted(() => {
  // 检查是否已登录
  if (adminStore.isAuthenticated) {
    router.push('/admin/dashboard')
    return
  }
  
  // 恢复记住的用户名
  const rememberMe = localStorage.getItem('adminRememberMe')
  const savedUsername = localStorage.getItem('adminUsername')
  
  if (rememberMe === 'true' && savedUsername) {
    loginForm.value.username = savedUsername
    loginForm.value.rememberMe = true
  }
  
  // 开发环境提示
  if (import.meta.env.DEV) {
    console.log('默认管理员账号: admin, 密码: admin123')
  }
})
</script>
