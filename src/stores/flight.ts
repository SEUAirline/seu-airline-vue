import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Flight, FlightSearchParams, Airport } from '@/types/flight'
import { flightApi } from '@/api/flight'

export const useFlightStore = defineStore('flight', () => {
  // 状态
  const searchParams = ref<FlightSearchParams>({
    tripType: 'oneWay',
    departureCity: '',
    arrivalCity: '',
    departureDate: '',
    passengers: 1,
    cabinClass: 'economy'
  })
  const searchResults = ref<Flight[]>([])
  const selectedFlight = ref<Flight | null>(null)
  const airports = ref<Airport[]>([])
  const loading = ref(false)

  // 加载机场数据
  async function loadAirports() {
    try {
      const response = await flightApi.getAirports()
      if (response.success && response.data) {
        airports.value = response.data
      }
    } catch (error) {
      console.error('加载机场数据失败:', error)
    }
  }

  // 搜索航班
  async function searchFlights(params: FlightSearchParams) {
    loading.value = true
    searchParams.value = params
    try {
      const response = await flightApi.searchFlights(params)
      if (response.success && response.data) {
        searchResults.value = response.data
        return { success: true, data: response.data }
      }
      return { success: false, message: response.message || '搜索失败' }
    } catch (error) {
      return { success: false, message: '搜索失败，请稍后重试' }
    } finally {
      loading.value = false
    }
  }

  // 获取航班详情
  async function getFlightDetail(flightId: string) {
    try {
      const response = await flightApi.getFlightById(flightId)
      if (response.success && response.data) {
        selectedFlight.value = response.data
        return { success: true, data: response.data }
      }
      return { success: false, message: response.message || '获取航班详情失败' }
    } catch (error) {
      return { success: false, message: '获取航班详情失败' }
    }
  }

  // 选择航班
  function selectFlight(flight: Flight) {
    selectedFlight.value = flight
  }

  // 清空搜索结果
  function clearSearchResults() {
    searchResults.value = []
    selectedFlight.value = null
  }

  return {
    searchParams,
    searchResults,
    selectedFlight,
    airports,
    loading,
    loadAirports,
    searchFlights,
    getFlightDetail,
    selectFlight,
    clearSearchResults
  }
})
