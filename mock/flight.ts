import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

// 航空公司列表
const airlines = ['中国国际航空', '中国东方航空', '中国南方航空', '海南航空', '厦门航空', '四川航空', '深圳航空']

// 机场数据
const airports = {
  '北京': ['PEK', '首都国际机场'],
  '上海': ['PVG', '浦东国际机场'],
  '广州': ['CAN', '白云国际机场'],
  '深圳': ['SZX', '宝安国际机场'],
  '成都': ['CTU', '双流国际机场'],
  '杭州': ['HGH', '萧山国际机场'],
  '西安': ['XIY', '咸阳国际机场'],
  '重庆': ['CKG', '江北国际机场'],
  '厦门': ['XMN', '高崎国际机场'],
  '南京': ['NKG', '禄口国际机场']
}

// 生成航班号
function generateFlightNo(airline: string): string {
  const codes: Record<string, string> = {
    '中国国际航空': 'CA',
    '中国东方航空': 'MU',
    '中国南方航空': 'CZ',
    '海南航空': 'HU',
    '厦门航空': 'MF',
    '四川航空': 'SC',
    '深圳航空': 'ZH'
  }
  const code = codes[airline] || 'CA'
  const number = Mock.Random.integer(1000, 9999)
  return `${code}${number}`
}

// 生成时间
function generateTime(baseDate: string, hourRange: [number, number]): string {
  const date = new Date(baseDate)
  const hour = Mock.Random.integer(hourRange[0], hourRange[1])
  const minute = Mock.Random.integer(0, 59)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

// 生成飞行时长
function calculateDuration(departureTime: string, hours: number): { arrivalTime: string; duration: string } {
  const departure = new Date(departureTime)
  const minutes = Mock.Random.integer(0, 59)
  const totalMinutes = hours * 60 + minutes
  const arrival = new Date(departure.getTime() + totalMinutes * 60000)
  
  const durationHours = Math.floor(totalMinutes / 60)
  const durationMinutes = totalMinutes % 60
  
  return {
    arrivalTime: arrival.toISOString(),
    duration: `${durationHours}小时${durationMinutes}分钟`
  }
}

// 生成航班数据
function generateFlights(params: any) {
  const { departureCity, arrivalCity, departureDate } = params
  const count = Mock.Random.integer(15, 30)
  const flights = []

  for (let i = 0; i < count; i++) {
    const airline = Mock.Random.pick(airlines)
    const flightNo = generateFlightNo(airline)
    const departureTime = generateTime(departureDate, [6, 22])
    const flightHours = Mock.Random.integer(1, 4)
    const { arrivalTime, duration } = calculateDuration(departureTime, flightHours)
    
    const basePrice = Mock.Random.integer(400, 2000)
    const economySeats = Mock.Random.integer(0, 150)
    const businessSeats = Mock.Random.integer(0, 30)
    const firstClassSeats = Mock.Random.integer(0, 10)
    
    const [depCode, depAirport] = airports[departureCity] || ['UNK', '未知机场']
    const [arrCode, arrAirport] = airports[arrivalCity] || ['UNK', '未知机场']

    flights.push({
      id: Mock.Random.guid(),
      flightNo,
      airline,
      departureAirport: depCode,
      arrivalAirport: arrCode,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      date: departureDate,
      duration,
      price: basePrice,
      economySeats,
      businessSeats,
      firstClassSeats,
      status: Mock.Random.pick(['scheduled', 'scheduled', 'scheduled', 'delayed']),
      aircraft: Mock.Random.pick(['A320', 'A321', 'A330', 'B737', 'B787', 'B777'])
    })
  }

  return flights
}

export default [
  // 搜索航班
  {
    url: '/api/v1/flight/search',
    method: 'get',
    response: (request: any) => {
      const { departureCity, arrivalCity, departureDate } = request.query
      
      if (!departureCity || !arrivalCity || !departureDate) {
        return {
          code: 400,
          message: '缺少必要参数',
          data: null,
          success: false
        }
      }

      const flights = generateFlights({ departureCity, arrivalCity, departureDate })

      return {
        code: 200,
        message: '查询成功',
        data: flights,
        success: true
      }
    }
  },

  // 获取航班详情
  {
    url: '/api/v1/flight/:id',
    method: 'get',
    response: (request: any) => {
      const { id } = request.params
      const airline = Mock.Random.pick(airlines)
      const departureCity = Mock.Random.pick(Object.keys(airports))
      let arrivalCity = Mock.Random.pick(Object.keys(airports))
      while (arrivalCity === departureCity) {
        arrivalCity = Mock.Random.pick(Object.keys(airports))
      }

      const departureDate = new Date().toISOString().split('T')[0]
      const departureTime = generateTime(departureDate, [6, 22])
      const { arrivalTime, duration } = calculateDuration(departureTime, Mock.Random.integer(1, 4))
      
      const [depCode, depAirport] = airports[departureCity]
      const [arrCode, arrAirport] = airports[arrivalCity]

      return {
        code: 200,
        message: '查询成功',
        data: {
          id,
          flightNo: generateFlightNo(airline),
          airline,
          departureAirport: depCode,
          arrivalAirport: arrCode,
          departureCity,
          arrivalCity,
          departureTime,
          arrivalTime,
          date: departureDate,
          duration,
          price: Mock.Random.integer(400, 2000),
          economySeats: Mock.Random.integer(0, 150),
          businessSeats: Mock.Random.integer(0, 30),
          firstClassSeats: Mock.Random.integer(0, 10),
          status: 'scheduled',
          aircraft: Mock.Random.pick(['A320', 'A321', 'A330', 'B737', 'B787', 'B777'])
        },
        success: true
      }
    }
  },

  // 获取机场列表
  {
    url: '/api/v1/airport/list',
    method: 'get',
    response: () => {
      const airportList = Object.entries(airports).map(([city, [code, name]]) => ({
        code,
        name,
        city
      }))

      return {
        code: 200,
        message: '查询成功',
        data: airportList,
        success: true
      }
    }
  },

  // 获取热门航线
  {
    url: '/api/v1/flight/popular',
    method: 'get',
    response: () => {
      const routes = [
        { from: '北京', to: '上海', count: 1250 },
        { from: '上海', to: '广州', count: 980 },
        { from: '北京', to: '深圳', count: 850 },
        { from: '成都', to: '上海', count: 720 },
        { from: '杭州', to: '北京', count: 650 }
      ]

      return {
        code: 200,
        message: '查询成功',
        data: routes,
        success: true
      }
    }
  }
] as MockMethod[]
