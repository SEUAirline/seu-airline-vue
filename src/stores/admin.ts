import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'
import { adminApi } from '@/api/admin'

export const useAdminStore = defineStore('admin', () => {
  // 状态
  const currentAdmin = ref<User | null>(null)
  const adminToken = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!adminToken.value && !!currentAdmin.value)
  const adminInfo = computed(() => currentAdmin.value)

  // 初始化 - 从localStorage恢复状态
  function init() {
    const savedAdmin = localStorage.getItem('currentAdmin')
    const savedToken = localStorage.getItem('adminToken')
    if (savedAdmin && savedToken) {
      currentAdmin.value = JSON.parse(savedAdmin)
      adminToken.value = savedToken
    }
  }

  // 管理员登录
  async function login(username: string, password: string) {
    try {
      const response = await adminApi.login(username, password)
      if (response.success && response.data) {
        currentAdmin.value = response.data.admin
        adminToken.value = response.data.token
        // 持久化
        localStorage.setItem('currentAdmin', JSON.stringify(response.data.admin))
        localStorage.setItem('adminToken', response.data.token)
        return { success: true }
      }
      return { success: false, message: response.message || '登录失败' }
    } catch (error) {
      return { success: false, message: '登录失败，请稍后重试' }
    }
  }

  // 登出
  function logout() {
    currentAdmin.value = null
    adminToken.value = null
    localStorage.removeItem('currentAdmin')
    localStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminToken')
  }

  // 初始化
  init()

  return {
    currentAdmin,
    adminToken,
    isAuthenticated,
    adminInfo,
    login,
    logout
  }
})
