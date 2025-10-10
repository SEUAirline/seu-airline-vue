// Mock API - 模拟后端接口
import type { ApiResponse } from '@/types/api'
import type { User, LoginForm, RegisterForm } from '@/types/user'
import type { Flight, FlightSearchParams, Airport } from '@/types/flight'
import type { Order, OrderCreateParams, PaymentParams } from '@/types/order'

// 模拟延迟
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock数据存储
class MockStorage {
  // 加载机场数据
  static async loadAirports(): Promise<Airport[]> {
    try {
      const response = await fetch('/data/airports.json')
      return await response.json()
    } catch (error) {
      console.error('加载机场数据失败:', error)
      return []
    }
  }

  // 加载航班数据
  static async loadFlights(): Promise<Flight[]> {
    try {
      const response = await fetch('/data/flights.json')
      return await response.json()
    } catch (error) {
      console.error('加载航班数据失败:', error)
      return []
    }
  }

  // 获取用户列表
  static getUsers(): User[] {
    const users = localStorage.getItem('users')
    return users ? JSON.parse(users) : []
  }

  // 保存用户列表
  static saveUsers(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users))
  }

  // 获取订单列表
  static getOrders(): Order[] {
    const orders = localStorage.getItem('orders')
    return orders ? JSON.parse(orders) : []
  }

  // 保存订单列表
  static saveOrders(orders: Order[]) {
    localStorage.setItem('orders', JSON.stringify(orders))
  }
}

// Mock API实现
export const mockApi = {
  // 用户登录
  async login(loginForm: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay()
    
    if (loginForm.username && loginForm.password) {
      const user: User = {
        id: Date.now(),
        username: loginForm.username,
        email: `${loginForm.username}@example.com`,
        role: 'user',
        vipLevel: 1,
        points: 1000
      }
      const token = 'mock-token-' + Date.now()
      
      return {
        success: true,
        data: { user, token },
        message: '登录成功'
      }
    }
    
    return {
      success: false,
      message: '用户名或密码错误'
    }
  },

  // 用户注册
  async register(registerForm: RegisterForm): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay()
    
    const users = MockStorage.getUsers()
    const existingUser = users.find(u => u.username === registerForm.username)
    
    if (existingUser) {
      return {
        success: false,
        message: '用户名已存在'
      }
    }
    
    const newUser: User = {
      id: Date.now(),
      username: registerForm.username,
      email: registerForm.email,
      phone: registerForm.phone,
      idCard: registerForm.idCard,
      realName: registerForm.realName,
      role: 'user',
      vipLevel: 0,
      points: 0,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    MockStorage.saveUsers(users)
    
    const token = 'mock-token-' + Date.now()
    
    return {
      success: true,
      data: { user: newUser, token },
      message: '注册成功'
    }
  },

  // 管理员登录
  async adminLogin(username: string, password: string): Promise<ApiResponse<{ admin: User; token: string }>> {
    await delay()
    
    if (username === 'admin' && password === 'admin123') {
      const admin: User = {
        id: 1,
        username: 'admin',
        email: 'admin@seuairline.com',
        role: 'admin',
        vipLevel: 0,
        points: 0
      }
      const token = 'admin-token-' + Date.now()
      
      return {
        success: true,
        data: { admin, token },
        message: '登录成功'
      }
    }
    
    return {
      success: false,
      message: '管理员用户名或密码错误'
    }
  },

  // 获取机场列表
  async getAirports(): Promise<ApiResponse<Airport[]>> {
    await delay(300)
    const airports = await MockStorage.loadAirports()
    return {
      success: true,
      data: airports
    }
  },

  // 搜索航班
  async searchFlights(params: FlightSearchParams): Promise<ApiResponse<Flight[]>> {
    await delay()
    const flights = await MockStorage.loadFlights()
    
    const filtered = flights.filter(flight => {
      return (
        flight.departureCity === params.departureCity &&
        flight.arrivalCity === params.arrivalCity &&
        flight.date === params.departureDate
      )
    })
    
    return {
      success: true,
      data: filtered
    }
  },

  // 根据ID获取航班
  async getFlightById(flightId: string): Promise<ApiResponse<Flight>> {
    await delay(300)
    const flights = await MockStorage.loadFlights()
    const flight = flights.find(f => f.id === flightId || f.flightNo === flightId)
    
    if (flight) {
      return {
        success: true,
        data: flight
      }
    }
    
    return {
      success: false,
      message: '航班不存在'
    }
  },

  // 创建订单
  async createOrder(params: OrderCreateParams): Promise<ApiResponse<Order>> {
    await delay()
    
    const flight = await mockApi.getFlightById(params.flightId)
    if (!flight.success || !flight.data) {
      return {
        success: false,
        message: '航班不存在'
      }
    }
    
    const flightData = flight.data
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    const order: Order = {
      id: 'ORD' + Date.now(),
      userId: user.id,
      flightId: params.flightId,
      flightNo: flightData.flightNo,
      departureCity: flightData.departureCity,
      arrivalCity: flightData.arrivalCity,
      departureTime: flightData.departureTime,
      arrivalTime: flightData.arrivalTime,
      date: flightData.date,
      passengers: params.passengers,
      cabinClass: params.cabinClass,
      price: flightData.price,
      totalAmount: params.passengers.length * flightData.price,
      status: 'pending',
      createTime: new Date().toISOString(),
      contactName: params.contactName,
      contactPhone: params.contactPhone,
      contactEmail: params.contactEmail
    }
    
    const orders = MockStorage.getOrders()
    orders.push(order)
    MockStorage.saveOrders(orders)
    
    return {
      success: true,
      data: order,
      message: '订单创建成功'
    }
  },

  // 获取用户订单
  async getUserOrders(): Promise<ApiResponse<Order[]>> {
    await delay()
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const orders = MockStorage.getOrders()
    const userOrders = orders.filter(order => order.userId === user.id)
    
    return {
      success: true,
      data: userOrders
    }
  },

  // 根据ID获取订单
  async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    await delay(300)
    const orders = MockStorage.getOrders()
    const order = orders.find(o => o.id === orderId)
    
    if (order) {
      return {
        success: true,
        data: order
      }
    }
    
    return {
      success: false,
      message: '订单不存在'
    }
  },

  // 支付订单
  async payOrder(params: PaymentParams): Promise<ApiResponse> {
    await delay(1000)
    const orders = MockStorage.getOrders()
    const orderIndex = orders.findIndex(o => o.id === params.orderId)
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'paid'
      orders[orderIndex].paymentMethod = params.paymentMethod
      orders[orderIndex].payTime = new Date().toISOString()
      MockStorage.saveOrders(orders)
      
      return {
        success: true,
        message: '支付成功'
      }
    }
    
    return {
      success: false,
      message: '订单不存在'
    }
  },

  // 取消订单
  async cancelOrder(orderId: string): Promise<ApiResponse> {
    await delay()
    const orders = MockStorage.getOrders()
    const orderIndex = orders.findIndex(o => o.id === orderId)
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'cancelled'
      MockStorage.saveOrders(orders)
      
      return {
        success: true,
        message: '订单已取消'
      }
    }
    
    return {
      success: false,
      message: '订单不存在'
    }
  },

  // 获取所有用户（管理员）
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    await delay()
    const users = MockStorage.getUsers()
    return {
      success: true,
      data: users
    }
  },

  // 获取所有订单（管理员）
  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    await delay()
    const orders = MockStorage.getOrders()
    return {
      success: true,
      data: orders
    }
  }
}
