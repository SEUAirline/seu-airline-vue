import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

// 模拟订单数据库
const orders: any[] = []

// 生成订单号
function generateOrderNo(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Mock.Random.integer(100000, 999999)
  return `${year}${month}${day}${random}`
}

export default [
  // 获取航班可用座位
  {
    url: /\/seats\/flight\/(.+)\/type\/(.+)\/available/,
    method: 'get',
    response: (request: any) => {
      // 从 URL 中提取参数
      const matches = request.url.match(/\/seats\/flight\/(.+)\/type\/(.+)\/available/)
      const flightId = matches ? matches[1] : ''
      const seatType = matches ? matches[2] : 'ECONOMY'

      // 根据舱位类型生成不同数量的可用座位
      const seatCounts: Record<string, number> = {
        ECONOMY: 150,
        BUSINESS: 30,
        FIRST: 10
      }

      const count = seatCounts[seatType] || 150

      // 生成座位列表
      const seats = []
      for (let i = 1; i <= count; i++) {
        seats.push({
          id: i,
          flightId: flightId,
          seatNumber: `${Math.ceil(i / 6)}${String.fromCharCode(65 + (i % 6))}`,
          seatType: seatType,
          price: seatType === 'ECONOMY' ? 800 : seatType === 'BUSINESS' ? 2000 : 3200,
          status: 'AVAILABLE'
        })
      }

      return {
        code: 200,
        message: '查询成功',
        data: seats,
        success: true
      }
    }
  },

  // 创建订单
  {
    url: '/orders',
    method: 'post',
    response: (request: any) => {
      const { items } = request.body

      const orderNo = generateOrderNo()
      const order = {
        id: Mock.Random.guid(),
        orderNo,
        userId: 1,
        flightId: items[0]?.flightId || Mock.Random.guid(),
        totalPrice: items.length * 800,
        status: 1, // 1: 待支付
        paymentMethod: null,
        contactName: items[0]?.passengerName || '测试用户',
        contactPhone: '13800138000',
        passengers: items.map((item: any) => ({
          name: item.passengerName,
          idCard: item.passengerIdCard,
          seatNumber: Mock.Random.pick(['12A', '12B', '12C', '13A', '13B', '13C'])
        })),
        createTime: new Date().toISOString(),
        payTime: null,
        cancelTime: null
      }

      orders.push(order)

      return {
        code: 200,
        message: '订单创建成功',
        data: {
          id: order.id,
          orderNo: order.orderNo,
          flightNo: 'CA1234',
          departureCity: '南京',
          arrivalCity: '北京',
          departureTime: '2025-11-07 08:00',
          passengerCount: items.length,
          totalPrice: order.totalPrice
        },
        success: true
      }
    }
  },

  // 获取订单列表
  {
    url: '/orders',
    method: 'get',
    response: (request: any) => {
      const { status, page = 1, pageSize = 10 } = request.query

      let filteredOrders = [...orders]

      if (status) {
        filteredOrders = filteredOrders.filter(o => o.status === parseInt(status))
      }

      // 将订单数据转换为前端期望的格式
      const formattedOrders = filteredOrders.map(order => ({
        id: order.id,
        orderNo: order.orderNo,
        flightNo: 'CA1234',
        departureCity: '南京',
        arrivalCity: '北京',
        departureTime: '2025-11-10T08:00:00.000Z',
        arrivalTime: '2025-11-10T10:30:00.000Z',
        date: '2025-11-10',
        status: order.status === 1 ? 'pending' : order.status === 2 ? 'paid' : order.status === 3 ? 'completed' : 'cancelled',
        totalPrice: order.totalPrice,
        passengers: order.passengers,
        createTime: order.createTime,
        payTime: order.payTime
      }))

      // 直接返回订单数组,不使用分页结构
      return {
        code: 200,
        message: '查询成功',
        data: formattedOrders,
        success: true
      }
    }
  },

  // 获取订单详情
  {
    url: '/orders/:id',
    method: 'get',
    response: (request: any) => {
      const { id } = request.params
      const order = orders.find(o => o.id === id)

      if (!order) {
        return {
          code: 404,
          message: '订单不存在',
          data: null,
          success: false
        }
      }

      // 返回完整的订单信息，包含支付页面需要的字段
      return {
        code: 200,
        message: '查询成功',
        data: {
          ...order,
          flightNo: 'CA1234',
          departureCity: '南京',
          arrivalCity: '北京',
          departureTime: '2025-11-07 08:00',
          arrivalTime: '2025-11-07 10:30',
          passengerCount: order.passengers?.length || 1
        },
        success: true
      }
    }
  },

  // 取消订单
  {
    url: '/orders/:id/cancel',
    method: 'put',
    response: (request: any) => {
      const { id } = request.params
      const order = orders.find(o => o.id === id)

      if (!order) {
        return {
          code: 404,
          message: '订单不存在',
          data: null,
          success: false
        }
      }

      if (order.status !== 1) {
        return {
          code: 400,
          message: '订单状态不允许取消',
          data: null,
          success: false
        }
      }

      order.status = 3 // 3: 已取消
      order.cancelTime = new Date().toISOString()

      return {
        code: 200,
        message: '订单取消成功',
        data: null,
        success: true
      }
    }
  },

  // 支付订单
  {
    url: '/orders/:id/pay',
    method: 'put',
    response: (request: any) => {
      const { id } = request.params
      const { paymentMethod } = request.body
      const order = orders.find(o => o.id === id)

      if (!order) {
        return {
          code: 404,
          message: '订单不存在',
          data: null,
          success: false
        }
      }

      if (order.status !== 1) {
        return {
          code: 400,
          message: '订单状态不允许支付',
          data: null,
          success: false
        }
      }

      // 模拟支付成功
      order.status = 2 // 2: 已支付
      order.paymentMethod = paymentMethod
      order.payTime = new Date().toISOString()

      return {
        code: 200,
        message: '支付成功',
        data: {
          orderId: order.id,
          orderNo: order.orderNo,
          payTime: order.payTime
        },
        success: true
      }
    }
  },

  // 申请退票
  {
    url: '/orders/:id/refund',
    method: 'post',
    response: (request: any) => {
      const { id } = request.params
      const { reason } = request.body
      const order = orders.find(o => o.id === id)

      if (!order) {
        return {
          code: 404,
          message: '订单不存在',
          data: null,
          success: false
        }
      }

      if (order.status !== 2) {
        return {
          code: 400,
          message: '只有已支付订单可以申请退票',
          data: null,
          success: false
        }
      }

      order.status = 4 // 4: 已退款
      order.refundReason = reason
      order.refundTime = new Date().toISOString()

      return {
        code: 200,
        message: '退票申请已提交',
        data: null,
        success: true
      }
    }
  }
]
