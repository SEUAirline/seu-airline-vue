import type { ApiResponse } from '@/types/api'
import type { User, LoginForm, RegisterForm } from '@/types/user'
import { mockApi } from './mock'

export const userApi = {
  // 用户登录
  login(loginForm: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> {
    return mockApi.login(loginForm)
  },

  // 用户注册
  register(registerForm: RegisterForm): Promise<ApiResponse<{ user: User; token: string }>> {
    return mockApi.register(registerForm)
  },

  // 获取当前用户信息
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // 更新用户信息
  async updateProfile(_userId: number | string, data: Partial<User>): Promise<ApiResponse<User>> {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      const updatedUser = { ...user, ...data }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      return {
        success: true,
        data: updatedUser,
        message: '更新成功'
      }
    }
    
    return {
      success: false,
      message: '用户不存在'
    }
  }
}
