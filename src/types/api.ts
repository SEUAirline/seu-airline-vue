// API响应类型定义

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalFlights: number
  totalRevenue: number
  todayOrders: number
  todayRevenue: number
  pendingOrders: number
  activeFlights: number
}
