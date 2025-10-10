// 航班相关类型定义

export interface Airport {
  code: string
  name: string
  city: string
}

export interface Flight {
  id: string
  flightNo: string
  airline: string
  departureAirport: string
  arrivalAirport: string
  departureCity: string
  arrivalCity: string
  departureTime: string
  arrivalTime: string
  date: string
  duration: string
  price: number
  economySeats: number
  businessSeats: number
  firstClassSeats: number
  status: 'scheduled' | 'delayed' | 'cancelled' | 'completed'
  aircraft?: string
}

export interface FlightSearchParams {
  tripType: 'oneWay' | 'roundTrip' | 'multiCity'
  departureCity: string
  arrivalCity: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass: 'economy' | 'business' | 'first'
}

export interface FlightSearchResult extends Flight {
  availableSeats: number
  lowestPrice: number
}
