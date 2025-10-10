<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">用户注册</h1>
        <p class="text-gray-600 mt-2">创建您的SEUAirline账户</p>
      </div>

      <div class="bg-white rounded-xl p-8 card-shadow">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">用户名 *</label>
              <input
                v-model="registerForm.username"
                type="text"
                class="input-field"
                placeholder="4-16位字母数字"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
              <input
                v-model="registerForm.email"
                type="email"
                class="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">密码 *</label>
              <input
                v-model="registerForm.password"
                type="password"
                class="input-field"
                placeholder="至少6位"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">确认密码 *</label>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                class="input-field"
                placeholder="再次输入密码"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">手机号 *</label>
              <input
                v-model="registerForm.phone"
                type="tel"
                class="input-field"
                placeholder="11位手机号"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">真实姓名</label>
              <input
                v-model="registerForm.realName"
                type="text"
                class="input-field"
                placeholder="选填"
              />
            </div>
          </div>

          <div class="flex items-center">
            <input
              v-model="registerForm.agreeTerms"
              type="checkbox"
              id="agree"
              class="mr-2"
              required
            />
            <label for="agree" class="text-sm text-gray-600">
              我已阅读并同意 <a href="#" class="text-primary hover:underline">用户协议</a> 和
              <a href="#" class="text-primary hover:underline">隐私政策</a>
            </label>
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>

        <div class="mt-4 text-center text-sm">
          <span class="text-gray-600">已有账号？</span>
          <router-link to="/login" class="text-primary hover:underline">立即登录</router-link>
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
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  realName: '',
  agreeTerms: false
})

async function handleRegister() {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次密码输入不一致')
    return
  }

  loading.value = true
  try {
    const result = await userStore.register(registerForm.value)
    if (result.success) {
      alert('注册成功!')
      router.push('/')
    } else {
      alert(result.message || '注册失败')
    }
  } finally {
    loading.value = false
  }
}
</script>
