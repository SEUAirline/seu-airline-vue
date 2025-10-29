import type { ApiResponse } from '@/types/api'
import type { Order, OrderCreateParams, PaymentParams } from '@/types/order'
import { request } from './client'

export const orderApi = {
  // 创建订单
  createOrder(params: OrderCreateParams): Promise<ApiResponse<Order>> {
    // 转换为后端期望的格式
    const orderRequest = {
      items: params.passengers.map(passenger => ({
        seatId: null, // 需要先选座位，这里暂时为null
        passengerName: passenger.name,
        passengerIdCard: passenger.idCard
      }))
    }
    return request.post('/orders', orderRequest)
  },

  // 获取用户订单列表
  getUserOrders(): Promise<ApiResponse<Order[]>> {
    return request.get('/orders')
  },

  // 根据ID获取订单详情
  getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    return request.get(`/orders/${orderId}`)
  },

  // 支付订单
  payOrder(params: PaymentParams): Promise<ApiResponse> {
    return request.put(`/orders/${params.orderId}/pay`)
  },

  // 取消订单
  cancelOrder(orderId: string): Promise<ApiResponse> {
    return request.put(`/orders/${orderId}/cancel`)
  }
}
