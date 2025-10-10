// 用户相关类型定义

export interface User {
  id: number | string
  username: string
  email: string
  phone?: string
  idCard?: string
  realName?: string
  role: 'user' | 'admin'
  vipLevel: number
  points: number
  avatar?: string
  createdAt?: string
}

export interface LoginForm {
  username: string
  password: string
  loginType?: 'password' | 'phone' | 'idcard'
}

export interface RegisterForm {
  username: string
  password: string
  confirmPassword: string
  email: string
  phone: string
  idCard?: string
  realName?: string
  agreeTerms: boolean
}

export interface UserProfile {
  id: number | string
  username: string
  email: string
  phone: string
  idCard?: string
  realName?: string
  vipLevel: number
  points: number
  avatar?: string
  totalOrders?: number
  totalSpent?: number
}
