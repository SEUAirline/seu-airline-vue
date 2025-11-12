import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginForm, RegisterForm } from '@/types/user'
import { userApi } from '@/api/user'
import { request } from '@/api/client'

export const useUserStore = defineStore('user', () => {
  // 状态
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!currentUser.value)
  const userInfo = computed(() => currentUser.value)

  // 初始化 - 从localStorage恢复状态
  function init() {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    if (savedUser && savedToken) {
      currentUser.value = JSON.parse(savedUser)
      token.value = savedToken
    }
  }

  // 获取完整的用户Profile信息
  async function fetchUserProfile() {
    try {
      const response = await request.get('/user/profile')
      if (response.data.code === 200 && response.data.data) {
        const profileData = response.data.data
        // 更新currentUser为完整的profile信息
        currentUser.value = {
          id: profileData.id,
          username: profileData.username,
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          idCard: profileData.idCard,
          role: profileData.role,
          status: profileData.status
        } as User
        // 持久化到localStorage
        localStorage.setItem('user', JSON.stringify(currentUser.value))
        return { success: true, data: currentUser.value }
      }
      return { success: false, message: '获取用户信息失败' }
    } catch (error) {
      console.error('获取用户Profile失败:', error)
      return { success: false, message: '获取用户信息失败' }
    }
  }

  // 登录
  async function login(loginForm: LoginForm) {
    try {
      const response = await userApi.login(loginForm)
      if (response.success && response.data) {
        currentUser.value = response.data.user
        token.value = response.data.token
        // 持久化
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('token', response.data.token)
        
        // 登录成功后立即获取完整的Profile信息
        await fetchUserProfile()
        
        return { success: true }
      }
      return { success: false, message: response.message || '登录失败' }
    } catch (error) {
      return { success: false, message: '登录失败，请稍后重试' }
    }
  }

  // 注册
  async function register(registerForm: RegisterForm) {
    try {
      const response = await userApi.register(registerForm)
      if (response.success && response.data) {
        currentUser.value = response.data.user
        token.value = response.data.token
        // 持久化
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('token', response.data.token)
        return { success: true }
      }
      return { success: false, message: response.message || '注册失败' }
    } catch (error) {
      return { success: false, message: '注册失败，请稍后重试' }
    }
  }

  // 登出
  function logout() {
    currentUser.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // 更新用户信息
  function updateUser(user: Partial<User>) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...user }
      localStorage.setItem('user', JSON.stringify(currentUser.value))
    }
  }

  // 初始化
  init()

  return {
    currentUser,
    token,
    isAuthenticated,
    userInfo,
    login,
    register,
    logout,
    updateUser,
    fetchUserProfile
  }
})
