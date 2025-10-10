import type { ApiResponse, AdminStats } from '@/types/api'
import type { User } from '@/types/user'
import { mockApi } from './mock'

export const adminApi = {
  // 管理员登录
  login(username: string, password: string): Promise<ApiResponse<{ admin: User; token: string }>> {
    return mockApi.adminLogin(username, password)
  },

  // 获取统计数据
  async getStats(): Promise<ApiResponse<AdminStats>> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const users = await mockApi.getAllUsers()
    const orders = await mockApi.getAllOrders()
    const flights = await mockApi.searchFlights({
      tripType: 'oneWay',
      departureCity: '',
      arrivalCity: '',
      departureDate: '',
      passengers: 1,
      cabinClass: 'economy'
    })
    
    const today = new Date().toISOString().split('T')[0]
    const todayOrders = orders.data?.filter(o => o.createTime.startsWith(today)) || []
    const paidOrders = orders.data?.filter(o => o.status === 'paid') || []
    const pendingOrders = orders.data?.filter(o => o.status === 'pending') || []
    
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const todayRevenue = todayOrders
      .filter(o => o.status === 'paid')
      .reduce((sum, order) => sum + order.totalAmount, 0)
    
    const stats: AdminStats = {
      totalUsers: users.data?.length || 0,
      totalOrders: orders.data?.length || 0,
      totalFlights: flights.data?.length || 0,
      totalRevenue,
      todayOrders: todayOrders.length,
      todayRevenue,
      pendingOrders: pendingOrders.length,
      activeFlights: flights.data?.filter(f => f.status === 'scheduled').length || 0
    }
    
    return {
      success: true,
      data: stats
    }
  },

  // 获取所有用户
  getAllUsers() {
    return mockApi.getAllUsers()
  },

  // 获取所有订单
  getAllOrders() {
    return mockApi.getAllOrders()
  }
}
