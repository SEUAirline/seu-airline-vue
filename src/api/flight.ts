import type { ApiResponse } from '@/types/api'
import type { Flight, FlightSearchParams, Airport } from '@/types/flight'
import { request } from './client'

export const flightApi = {
  // 获取机场列表
  getAirports(): Promise<ApiResponse<Airport[]>> {
    return request.get('/v1/airport/list')
  },

  // 搜索航班
  searchFlights(params: FlightSearchParams): Promise<ApiResponse<Flight[]>> {
    return request.get('/v1/flight/search', { params })
  },

  // 根据ID获取航班详情
  getFlightById(flightId: string): Promise<ApiResponse<Flight>> {
    return request.get(`/v1/flight/${flightId}`)
  },

  // 获取所有航班（管理员）
  async getAllFlights(): Promise<ApiResponse<Flight[]>> {
    // 获取所有航班数据
    const response = await fetch('/data/flights.json')
    const flights = await response.json()
    
    return {
      success: true,
      data: flights
    }
  },

  // 添加航班（管理员）
  async addFlight(flight: Partial<Flight>): Promise<ApiResponse<Flight>> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newFlight: Flight = {
      id: 'FL' + Date.now(),
      flightNo: flight.flightNo || '',
      airline: flight.airline || '',
      departureAirport: flight.departureAirport || '',
      arrivalAirport: flight.arrivalAirport || '',
      departureCity: flight.departureCity || '',
      arrivalCity: flight.arrivalCity || '',
      departureTime: flight.departureTime || '',
      arrivalTime: flight.arrivalTime || '',
      date: flight.date || '',
      duration: flight.duration || '',
      price: flight.price || 0,
      economySeats: flight.economySeats || 0,
      businessSeats: flight.businessSeats || 0,
      firstClassSeats: flight.firstClassSeats || 0,
      status: flight.status || 'scheduled',
      aircraft: flight.aircraft
    }
    
    return {
      success: true,
      data: newFlight,
      message: '航班添加成功'
    }
  },

  // 更新航班（管理员）
  async updateFlight(_flightId: string, data: Partial<Flight>): Promise<ApiResponse<Flight>> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      data: data as Flight,
      message: '航班更新成功'
    }
  },

  // 删除航班（管理员）
  async deleteFlight(_flightId: string): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      message: '航班删除成功'
    }
  }
}
