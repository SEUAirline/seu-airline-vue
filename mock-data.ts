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

// 用户数据 - 添加密码字段用于登录验证
const users: any = {
  '1': {
    id: 1,
    username: 'user123',
    password: '123456', // 测试密码
    nickname: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user123',
    gender: 'male',
    birthday: '1990-01-01',
    idCard: '320123199001011234',
    realName: '张三',
    createTime: '2024-01-01 10:00:00',
    points: 1580,
    vipLevel: 2,
    level: 'gold',
    role: 'user'
  }
}

// 用户数据数组（用于查找）
const userList = Object.values(users)

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

// 消息存储
const messages: any[] = []
let messageIdCounter = 1

// 创建消息的辅助函数
function createMessage(type: string, title: string, content: string, relatedId?: string, priority: number = 1) {
  const message = {
    id: messageIdCounter++,
    type,
    title,
    content,
    relatedId,
    priority,
    isRead: false,
    createTime: new Date().toISOString(),
    readTime: null
  }
  messages.unshift(message) // 新消息放在最前面
  console.log('📨 创建消息:', message)
  return message
}

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

  // 用户登录
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk: any) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body)
        console.log('🔐 登录请求:', { username, password })
        
        // 查找用户
        const user: any = userList.find((u: any) => u.username === username && u.password === password)
        
        if (!user) {
          console.log('❌ 登录失败: 用户名或密码错误')
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            code: 401,
            message: '用户名或密码错误',
            success: false,
            data: null
          }))
          return
        }
        
        // 生成token
        const token = `mock_token_${Date.now()}_${user.id}`
        
        // 返回用户信息（不包含密码）
        const { password: _pwd, ...userWithoutPassword } = user
        
        console.log('✅ 登录成功:', userWithoutPassword)
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          code: 200,
          message: '登录成功',
          success: true,
          data: {
            token,
            user: userWithoutPassword
          }
        }))
      } catch (error) {
        console.error('❌ 登录处理错误:', error)
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          code: 500,
          message: '服务器错误',
          success: false,
          data: null
        }))
      }
    })
    return true
  }

  // 用户注册
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk: any) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        const { username, password, email, phone, idCard, fullName } = JSON.parse(body)
        console.log('📝 注册请求:', { username, email, phone })
        
        // 检查用户名是否已存在
        const existingUser = userList.find((u: any) => u.username === username)
        if (existingUser) {
          console.log('❌ 注册失败: 用户名已存在')
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            code: 400,
            message: '用户名已存在',
            success: false,
            data: null
          }))
          return
        }
        
        // 创建新用户
        const newUserId = Object.keys(users).length + 1
        const newUser = {
          id: newUserId,
          username,
          password,
          email,
          phone,
          idCard: idCard || '',
          realName: fullName || '',
          nickname: fullName || username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          gender: 'unknown',
          birthday: '',
          createTime: new Date().toISOString(),
          points: 0,
          vipLevel: 1,
          level: 'bronze',
          role: 'user'
        }
        
        users[newUserId] = newUser
        userList.push(newUser)
        
        // 生成token
        const token = `mock_token_${Date.now()}_${newUser.id}`
        
        // 返回用户信息（不包含密码）
        const { password: _pwd2, ...userWithoutPassword } = newUser
        
        console.log('✅ 注册成功:', userWithoutPassword)
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          code: 200,
          message: '注册成功',
          success: true,
          data: {
            token,
            user: userWithoutPassword
          }
        }))
      } catch (error) {
        console.error('❌ 注册处理错误:', error)
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          code: 500,
          message: '服务器错误',
          success: false,
          data: null
        }))
      }
    })
    return true
  }

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
        departureCity: '南京',
        arrivalCity: '上海',
        departureTime: '2025-11-10 08:00',
        arrivalTime: '2025-11-10 10:30',
        date: '2025-11-10',
        cabinClass: data.items?.[0]?.cabinClass || 'economy',
        passengers: data.items || [],
        passengerCount: data.items?.length || 1,
        totalPrice: data.items?.reduce((sum: number, item: any) => sum + (item.price || 800), 0) || 800,
        status: 1, // 1: 待支付
        paymentMethod: null,
        createTime: new Date().toISOString(),
        payTime: null
      }
      
      console.log('✅ 订单已创建:', order)
      orders.push(order)

      // 创建订单消息
      createMessage(
        'order',
        '订单创建成功',
        `您的订单 ${orderNo} 已创建成功，请尽快完成支付。航班 ${order.flightNo}，${order.departureCity} → ${order.arrivalCity}`,
        order.id,
        1
      )

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

    // 转换为前端期望的格式
    const formattedOrder = {
      id: order.id,
      orderNo: order.orderNo,
      flightNo: order.flightNo || 'CA1234',
      departureCity: order.departureCity || '南京',
      arrivalCity: order.arrivalCity || '上海',
      departureTime: order.departureTime || '2025-11-10 08:00',
      arrivalTime: order.arrivalTime || '2025-11-10 10:30',
      date: order.date || '2025-11-10',
      status: order.status === 1 ? 'pending' : 
              order.status === 2 ? 'paid' : 
              order.status === 3 ? 'completed' : 'cancelled',
      cabinClass: order.cabinClass || 'economy',
      price: order.totalPrice || 0,
      totalAmount: order.totalPrice || 0,
      totalPrice: order.totalPrice || 0,  // 支付页面需要
      passengerCount: order.passengerCount || order.passengers?.length || 1,  // 支付页面需要
      passengers: order.passengers || [],
      createTime: order.createTime,
      payTime: order.payTime,
      paymentMethod: order.paymentMethod
    }

    console.log('📋 返回订单详情:', formattedOrder)

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: '查询成功',
      success: true,
      data: formattedOrder
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

    order.status = 2 // 已支付 (修正:应该是2而不是1)
    order.payTime = new Date().toISOString()

    // 创建支付成功消息
    createMessage(
      'order',
      '支付成功',
      `订单 ${order.orderNo} 支付成功！航班 ${order.flightNo}，${order.departureCity} → ${order.arrivalCity}，祝您旅途愉快！`,
      order.id,
      2
    )

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

  // 取消订单
  if (pathname?.includes('/cancel') && req.method === 'PUT') {
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

    // 检查订单状态是否可以取消
    if (order.status !== 1 && order.status !== 2) {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        code: 400,
        message: '该订单状态不允许取消',
        success: false,
        data: null
      }))
      return true
    }

    // 模拟取消订单
    order.status = 4 // 4: 已取消
    order.cancelTime = new Date().toISOString()

    console.log('✅ 订单已取消:', order)

    // 创建取消订单消息
    createMessage(
      'order',
      '订单已取消',
      `订单 ${order.orderNo} 已成功取消。航班 ${order.flightNo}，${order.departureCity} → ${order.arrivalCity}`,
      order.id,
      1
    )

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: '订单取消成功',
      success: true,
      data: {
        orderId: order.id,
        orderNo: order.orderNo,
        cancelTime: order.cancelTime
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

  // 获取用户订单列表 (支持两种路径)
  if (pathname === '/api/user/orders' || pathname === '/api/orders') {
    const { status, page = '1', pageSize = '10' } = query
    let filteredOrders = orders
    
    if (status && status !== 'all') {
      filteredOrders = orders.filter(o => o.status === parseInt(status as string))
    }
    
    // 将订单数据转换为前端期望的格式
    const formattedOrders = filteredOrders.map(order => ({
      id: order.id,
      orderNo: order.orderNo,
      flightNo: order.flightNo || 'CA1234',
      departureCity: order.departureCity || '南京',
      arrivalCity: order.arrivalCity || '上海',
      departureTime: order.departureTime || '2025-11-10 08:00',
      arrivalTime: order.arrivalTime || '2025-11-10 10:30',
      date: order.date || '2025-11-10',
      status: order.status === 1 ? 'pending' : 
              order.status === 2 ? 'paid' : 
              order.status === 3 ? 'completed' : 'cancelled',
      cabinClass: order.cabinClass || 'economy',
      price: order.totalPrice || 0,
      totalAmount: order.totalPrice || 0,
      passengers: order.passengers || [],
      createTime: order.createTime,
      payTime: order.payTime
    }))
    
    console.log('📋 返回订单列表, 数量:', formattedOrders.length)
    
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: '查询成功',
      success: true,
      data: formattedOrders  // 直接返回数组
    }))
    return true
  }

  // 消息未读数
  if (pathname === '/api/messages/unread-count') {
    const unreadCount = messages.filter(m => !m.isRead).length
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: 'success',
      success: true,
      data: unreadCount
    }))
    return true
  }

  // 消息列表
  if (pathname === '/api/messages' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: 'success',
      success: true,
      data: {
        list: messages,
        total: messages.length,
        page: 1,
        pageSize: 20
      }
    }))
    return true
  }

  // 标记消息已读
  if (pathname?.startsWith('/api/messages/') && pathname?.endsWith('/read') && req.method === 'PUT') {
    const messageId = parseInt(pathname.split('/')[3])
    const message = messages.find(m => m.id === messageId)
    if (message) {
      message.isRead = true
      message.readTime = new Date().toISOString()
    }
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: 'success',
      success: true
    }))
    return true
  }

  // 全部标记已读
  if (pathname === '/api/messages/read-all' && req.method === 'PUT') {
    messages.forEach(m => {
      m.isRead = true
      m.readTime = new Date().toISOString()
    })
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: 'success',
      success: true
    }))
    return true
  }

  // 删除消息
  if (pathname?.startsWith('/api/messages/') && req.method === 'DELETE') {
    const messageId = parseInt(pathname.split('/')[3])
    const index = messages.findIndex(m => m.id === messageId)
    if (index !== -1) {
      messages.splice(index, 1)
    }
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 200,
      message: 'success',
      success: true
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
