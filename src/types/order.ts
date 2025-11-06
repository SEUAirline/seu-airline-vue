// 订单相关类型定义

export interface Passenger {
  name: string
  idCard: string
  phone: string
  passengerType: 'adult' | 'child' | 'infant'
}

export interface Order {
  id: string
  userId: number | string
  flightId: string
  flightNo: string
  departureCity: string
  arrivalCity: string
  departureTime: string
  arrivalTime: string
  date: string
  passengers: Passenger[]
  cabinClass: 'economy' | 'business' | 'first'
  price: number
  totalAmount: number
  status: 'pending' | 'paid' | 'cancelled' | 'completed' | 'refunded'
  paymentMethod?: string
  createTime: string
  payTime?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
}

export interface OrderCreateParams {
  flightId: string
  passengers: Passenger[]
  cabinClass: 'economy' | 'business' | 'first'
  contactName: string
  contactPhone: string
  contactEmail: string
}

export interface PaymentParams {
  orderId: string
  paymentMethod: 'alipay' | 'wechat' | 'bank'
  amount?: number  // 可选，从订单中获取
}
