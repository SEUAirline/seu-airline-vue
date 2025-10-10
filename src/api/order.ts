import type { ApiResponse } from '@/types/api'
import type { Order, OrderCreateParams, PaymentParams } from '@/types/order'
import { mockApi } from './mock'

export const orderApi = {
  // 创建订单
  createOrder(params: OrderCreateParams): Promise<ApiResponse<Order>> {
    return mockApi.createOrder(params)
  },

  // 获取用户订单列表
  getUserOrders(): Promise<ApiResponse<Order[]>> {
    return mockApi.getUserOrders()
  },

  // 根据ID获取订单详情
  getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    return mockApi.getOrderById(orderId)
  },

  // 支付订单
  payOrder(params: PaymentParams): Promise<ApiResponse> {
    return mockApi.payOrder(params)
  },

  // 取消订单
  cancelOrder(orderId: string): Promise<ApiResponse> {
    return mockApi.cancelOrder(orderId)
  }
}
