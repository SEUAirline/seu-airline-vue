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
  // 创建订单
  {
    url: '/api/v1/order',
    method: 'post',
    response: (request: any) => {
      const { flightId, passengers, contactName, contactPhone, totalPrice } = request.body

      const orderNo = generateOrderNo()
      const order = {
        id: Mock.Random.guid(),
        orderNo,
        userId: 1,
        flightId,
        totalPrice,
        status: 1, // 1: 待支付
        paymentMethod: null,
        contactName,
        contactPhone,
        passengers,
        createTime: new Date().toISOString(),
        payTime: null,
        cancelTime: null
      }

      orders.push(order)

      return {
        code: 200,
        message: '订单创建成功',
        data: {
          orderId: order.id,
          orderNo: order.orderNo
        },
        success: true
      }
    }
  },

  // 获取订单列表
  {
    url: '/api/v1/order/list',
    method: 'get',
    response: (request: any) => {
      const { status, page = 1, pageSize = 10 } = request.query

      let filteredOrders = [...orders]
      
      if (status) {
        filteredOrders = filteredOrders.filter(o => o.status === parseInt(status))
      }

      const total = filteredOrders.length
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const list = filteredOrders.slice(start, end)

      return {
        code: 200,
        message: '查询成功',
        data: {
          list,
          total,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        },
        success: true
      }
    }
  },

  // 获取订单详情
  {
    url: '/api/v1/order/:id',
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

      return {
        code: 200,
        message: '查询成功',
        data: order,
        success: true
      }
    }
  },

  // 取消订单
  {
    url: '/api/v1/order/:id/cancel',
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
    url: '/api/v1/order/:id/pay',
    method: 'post',
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
    url: '/api/v1/order/:id/refund',
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
] as MockMethod[]
