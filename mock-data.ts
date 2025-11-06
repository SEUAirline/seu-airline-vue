// 完整的 Mock 数据和处理函数
import { parse } from 'node:url'

// 机场数据
const airports = [
  { code: 'PEK', name: '首都国际机场', city: '北京' },
  { code: 'PVG', name: '浦东国际机场', city: '上海' },
  { code: 'CAN', name: '白云国际机场', city: '广州' },
  { code: 'SZX', name: '宝安国际机场', city: '深圳' },
  { code: 'CTU', name: '双流国际机场', city: '成都' },
  { code: 'HGH', name: '萧山国际机场', city: '杭州' },
  { code: 'XIY', name: '咸阳国际机场', city: '西安' },
  { code: 'CKG', name: '江北国际机场', city: '重庆' },
  { code: 'XMN', name: '高崎国际机场', city: '厦门' },
  { code: 'NKG', name: '禄口国际机场', city: '南京' }
]

// 航空公司
const airlines = ['中国国际航空', '中国东方航空', '中国南方航空', '海南航空', '厦门航空']

// 用户数据
const users: any = {
  '1': {
    id: 1,
    username: 'user123',
    nickname: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user123',
    gender: 'male',
    birthday: '1990-01-01',
    idCard: '320123199001011234',
    createTime: '2024-01-01 10:00:00',
    points: 1580,
    level: 'gold'
  }
}

// 常用旅客数据
const passengers: any[] = [
  {
    id: 'p1',
    userId: 1,
    name: '张三',
    idType: 'ID_CARD',
    idNumber: '320123199001011234',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    passengerType: 'adult',
    isDefault: true
  },
  {
    id: 'p2',
    userId: 1,
    name: '李四',
    idType: 'ID_CARD',
    idNumber: '320123199002021234',
    phone: '13900139000',
    email: 'lisi@example.com',
    passengerType: 'adult',
    isDefault: false
  }
]

// 生成航班数据
function generateFlights(departureCity: string, arrivalCity: string, departureDate: string) {
  const flights = []
  const baseDate = new Date(departureDate)
  
  for (let i = 0; i < 5; i++) {
    const airline = airlines[i % airlines.length]
    const flightNo = `${airline.substring(0, 2)}${1000 + i * 100}`
    
    const departureHour = 8 + i * 2
    const arrivalHour = departureHour + 2
    
    flights.push({
      id: `flight_${Date.now()}_${i}`,
      flightNo,
      airline,
      departureAirport: airports.find(a => a.city === departureCity)?.code || 'PEK',
      arrivalAirport: airports.find(a => a.city === arrivalCity)?.code || 'PVG',
      departureCity,
      arrivalCity,
      departureTime: `${departureDate} ${String(departureHour).padStart(2, '0')}:00`,
      arrivalTime: `${departureDate} ${String(arrivalHour).padStart(2, '0')}:00`,
      date: departureDate,
      duration: '2小时',
      price: 500 + i * 100,
      economySeats: 150 - i * 10,
      businessSeats: 30 - i * 2,
      firstClassSeats: 10 - i,
      status: 'scheduled',
      aircraft: 'A320'
    })
  }
  
  return flights
}

// 订单存储
const orders: any[] = []
let orderIdCounter = 1

// 生成订单号
function generateOrderNo(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 900000) + 100000
  return `${year}${month}${day}${random}`
}

// Mock API 处理器
export function handleMockRequest(req: any, res: any): boolean {
  const parsedUrl = parse(req.url || '', true)
  const pathname = parsedUrl.pathname
  const query = parsedUrl.query

  console.log('📡 拦截请求:', pathname, query)

  // 机场列表
  if (pathname === '/api/airport/list') {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: '查询成功',
      success: true,
      data: airports
    }))
    return true
  }

  // 航班搜索
  if (pathname === '/api/flight/search') {
    const { departureCity, arrivalCity, departureDate } = query
    
    if (!departureCity || !arrivalCity || !departureDate) {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        code: 400,
        message: '缺少必要参数',
        success: false,
        data: null
      }))
      return true
    }

    const flights = generateFlights(
      departureCity as string,
      arrivalCity as string,
      departureDate as string
    )

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: '查询成功',
      success: true,
      data: flights
    }))
    return true
  }

  // 航班详情
  if (pathname?.startsWith('/api/flight/') && !pathname.includes('search')) {
    const flightId = pathname.split('/').pop()
    
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: '查询成功',
      success: true,
      data: {
        id: flightId,
        flightNo: 'CA1234',
        airline: '中国国际航空',
        departureAirport: 'PEK',
        arrivalAirport: 'PVG',
        departureCity: '北京',
        arrivalCity: '上海',
        departureTime: '2025-11-07 10:00',
        arrivalTime: '2025-11-07 12:00',
        date: '2025-11-07',
        duration: '2小时',
        price: 800,
        economySeats: 150,
        businessSeats: 30,
        firstClassSeats: 10,
        status: 'scheduled',
        aircraft: 'A320'
      }
    }))
    return true
  }

  // 获取可用座位
  if (pathname?.includes('/api/seats/flight/')) {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: '查询成功',
      success: true,
      data: Array.from({ length: 20 }, (_, i) => ({
        id: `seat_${i + 1}`,
        seatNo: `${Math.floor(i / 6) + 1}${String.fromCharCode(65 + (i % 6))}`,
        type: 'ECONOMY',
        price: 800,
        status: 'available'
      }))
    }))
    return true
  }

  // 创建订单
  if (pathname === '/api/orders' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk: any) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const data = JSON.parse(body)
      const orderNo = generateOrderNo()
      const order = {
        id: `order_${orderIdCounter++}`,
        orderNo,
        userId: 1,
        flightId: data.items?.[0]?.flightId || 'flight_1',
        flightNo: 'CA1234',
        departureCity: '北京',
        arrivalCity: '上海',
        departureTime: '2025-11-07 10:00',
        arrivalTime: '2025-11-07 12:00',
        passengers: data.items || [],
        passengerCount: data.items?.length || 1,
        totalPrice: data.items?.reduce((sum: number, item: any) => sum + (item.price || 800), 0) || 800,
        status: 0, // 待支付
        paymentMethod: null,
        createTime: new Date().toISOString(),
        payTime: null
      }
      orders.push(order)

      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        code: 200,
        message: '订单创建成功',
        success: true,
        data: {
          id: order.id,
          orderNo: order.orderNo,
          flightNo: order.flightNo,
          departureCity: order.departureCity,
          arrivalCity: order.arrivalCity,
          departureTime: order.departureTime,
          passengerCount: order.passengerCount,
          totalPrice: order.totalPrice
        }
      }))
    })
    return true
  }

  // 获取订单详情
  if (pathname?.startsWith('/api/orders/') && req.method === 'GET') {
    const orderId = pathname.split('/')[3]
    const order = orders.find(o => o.id === orderId)

    if (!order) {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        code: 404,
        message: '订单不存在',
        success: false,
        data: null
      }))
      return true
    }

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: '查询成功',
      success: true,
      data: order
    }))
    return true
  }

  // 支付订单
  if (pathname?.includes('/pay') && req.method === 'PUT') {
    const orderId = pathname.split('/')[3]
    const order = orders.find(o => o.id === orderId)

    if (!order) {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        code: 404,
        message: '订单不存在',
        success: false,
        data: null
      }))
      return true
    }

    order.status = 1 // 已支付
    order.payTime = new Date().toISOString()

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: '支付成功',
      success: true,
      data: {
        orderId: order.id,
        orderNo: order.orderNo,
        payTime: order.payTime
      }
    }))
    return true
  }

  // 获取用户信息
  if (pathname === '/api/user/profile') {
    const user = users['1'] // 模拟当前登录用户
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: '查询成功',
      success: true,
      data: user
    }))
    return true
  }

  // 更新用户信息
  if (pathname === '/api/user/profile' && req.method === 'PUT') {
    let body = ''
    req.on('data', (chunk: any) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const data = JSON.parse(body)
      users['1'] = { ...users['1'], ...data }
      
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        code: 200,
        message: '更新成功',
        success: true,
        data: users['1']
      }))
    })
    return true
  }

  // 修改密码
  if (pathname === '/api/user/password' && req.method === 'PUT') {
    let body = ''
    req.on('data', (chunk: any) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        code: 200,
        message: '密码修改成功',
        success: true,
        data: null
      }))
    })
    return true
  }

  // 获取常用旅客列表
  if (pathname === '/api/passengers') {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: '查询成功',
      success: true,
      data: passengers
    }))
    return true
  }

  // 添加常用旅客
  if (pathname === '/api/passengers' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk: any) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const data = JSON.parse(body)
      const newPassenger = {
        id: `p${passengers.length + 1}`,
        userId: 1,
        ...data
      }
      passengers.push(newPassenger)
      
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        code: 200,
        message: '添加成功',
        success: true,
        data: newPassenger
      }))
    })
    return true
  }

  // 更新常用旅客
  if (pathname?.startsWith('/api/passengers/') && req.method === 'PUT') {
    const passengerId = pathname.split('/')[3]
    let body = ''
    req.on('data', (chunk: any) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const data = JSON.parse(body)
      const index = passengers.findIndex(p => p.id === passengerId)
      if (index !== -1) {
        passengers[index] = { ...passengers[index], ...data }
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          code: 200,
          message: '更新成功',
          success: true,
          data: passengers[index]
        }))
      } else {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          code: 404,
          message: '旅客不存在',
          success: false,
          data: null
        }))
      }
    })
    return true
  }

  // 删除常用旅客
  if (pathname?.startsWith('/api/passengers/') && req.method === 'DELETE') {
    const passengerId = pathname.split('/')[3]
    const index = passengers.findIndex(p => p.id === passengerId)
    if (index !== -1) {
      passengers.splice(index, 1)
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        code: 200,
        message: '删除成功',
        success: true,
        data: null
      }))
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        code: 404,
        message: '旅客不存在',
        success: false,
        data: null
      }))
    }
    return true
  }

  // 获取用户订单列表
  if (pathname === '/api/user/orders') {
    const { status, page = '1', pageSize = '10' } = query
    let filteredOrders = orders
    
    if (status && status !== 'all') {
      filteredOrders = orders.filter(o => o.status === parseInt(status as string))
    }
    
    const pageNum = parseInt(page as string)
    const size = parseInt(pageSize as string)
    const start = (pageNum - 1) * size
    const end = start + size
    
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: '查询成功',
      success: true,
      data: {
        list: filteredOrders.slice(start, end),
        total: filteredOrders.length,
        page: pageNum,
        pageSize: size
      }
    }))
    return true
  }

  // 消息未读数
  if (pathname === '/api/messages/unread-count') {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: 'success',
      success: true,
      data: 3
    }))
    return true
  }

  // 消息列表
  if (pathname === '/api/messages') {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: 'success',
      success: true,
      data: {
        list: [],
        total: 0,
        page: 1,
        pageSize: 20
      }
    }))
    return true
  }

  // 测试 API
  if (pathname === '/api/test') {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: 'Mock is working!',
      success: true,
      data: { test: true }
    }))
    return true
  }

  return false
}
