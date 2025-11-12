import type { ApiResponse } from '@/types/api'
import type { Order, OrderCreateParams, PaymentParams } from '@/types/order'
import { request } from './client'

// 座位信息接口
export interface Seat {
  id: number
  flightId: number
  seatNumber: string
  seatType: string
  price: number
  status: string
}

export const orderApi = {
  // 获取航班可用座位
  getAvailableSeats(flightId: string, cabinClass: string): Promise<ApiResponse<Seat[]>> {
    // 将前端的 cabinClass 映射到后端的 seatType
    const seatTypeMap: Record<string, string> = {
      economy: 'ECONOMY',
      business: 'BUSINESS',
      first: 'FIRST'
    }
    const seatType = seatTypeMap[cabinClass.toLowerCase()] || 'ECONOMY'

    return request.get(`/seats/flight/${flightId}/type/${seatType}/available`)
  },

  // 创建订单
  async createOrder(params: OrderCreateParams): Promise<ApiResponse<Order>> {
    const flightId = params.flightId
    const cabinClass = params.cabinClass

    try {
      // 先获取可用座位
      const seatsResponse = await this.getAvailableSeats(flightId, cabinClass)

      if (!seatsResponse.success || !seatsResponse.data || seatsResponse.data.length === 0) {
        return {
          success: false,
          message: `暂无${cabinClass === 'economy' ? '经济舱' : cabinClass === 'business' ? '商务舱' : '头等舱'}可用座位`,
          data: null as any
        }
      }

      const availableSeats = seatsResponse.data

      // 检查座位数量是否足够
      if (availableSeats.length < params.passengers.length) {
        return {
          success: false,
          message: `可用座位不足，当前仅剩 ${availableSeats.length} 个座位`,
          data: null as any
        }
      }

      // 为每个乘客自动分配座位
      const orderRequest = {
        items: params.passengers.map((passenger, index) => ({
          seatId: availableSeats[index].id,
          passengerName: passenger.name,
          passengerIdCard: passenger.idCard
        }))
      }

      // 创建订单
      return request.post('/orders', orderRequest)
    } catch (error) {
      console.error('获取座位失败:', error)
      return {
        success: false,
        message: '获取座位信息失败，请稍后重试',
        data: null as any
      }
    }
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
    return request.put(`/orders/${params.orderId}/pay`, {
      paymentMethod: params.paymentMethod
    })
  },

  // 取消订单
  cancelOrder(orderId: string): Promise<ApiResponse> {
    return request.put(`/orders/${orderId}/cancel`)
  }
}
