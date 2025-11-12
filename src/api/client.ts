import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'

// 创建axios实例
const client: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
client.interceptors.request.use(
  (config) => {
    // 添加token
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      console.error('请求错误详情:', {
        status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        responseData: data
      })
      
      switch (status) {
        case 400:
          console.error('请求参数错误:', data?.message || data)
          break
        case 401:
          // Token 过期或未授权
          const tokenExpired = data?.tokenExpired || false
          
          // 清除所有认证信息
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('adminToken')
          localStorage.removeItem('currentAdmin')
          
          // 如果是 token 过期，显示友好提示
          if (tokenExpired) {
            // 使用自定义事件通知应用 token 已过期
            window.dispatchEvent(new CustomEvent('token-expired', {
              detail: { message: '登录已过期，请重新登录' }
            }))
          } else {
            // 非 token 过期的 401 错误，跳转登录页
            console.error('未授权访问')
            window.location.href = '/login'
          }
          break
        case 403:
          console.error('没有权限访问')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error('请求失败')
      }
    }
    return Promise.reject(error)
  }
)

// 封装请求方法
export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return client.get(url, config)
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return client.post(url, data, config)
  },
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return client.put(url, data, config)
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return client.delete(url, config)
  }
}

export default client
