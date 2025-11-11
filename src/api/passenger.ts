import { request } from './client'
import type { ApiResponse } from '@/types/api'
import type { 
  FrequentPassenger, 
  FrequentPassengerCreateRequest, 
  FrequentPassengerUpdateRequest,
  PassengerDisplay
} from '@/types/passenger'
import { toPassengerDisplay, toBackendRequest } from '@/types/passenger'

/**
 * 常用乘客 API
 */
export const passengerApi = {
  /**
   * 获取当前用户的常用乘客列表
   */
  async getFrequentPassengers(): Promise<ApiResponse<FrequentPassenger[]>> {
    return request.get('/passengers/frequent')
  },

  /**
   * 获取当前用户的常用乘客列表（前端显示格式）
   * 兼容旧版 PassengersPage.vue
   */
  async getPassengersForDisplay(): Promise<ApiResponse<PassengerDisplay[]>> {
    const response = await this.getFrequentPassengers()
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(toPassengerDisplay)
      }
    }
    return response as any
  },

  /**
   * 添加常用乘客
   */
  async addFrequentPassenger(data: FrequentPassengerCreateRequest): Promise<ApiResponse<FrequentPassenger>> {
    return request.post('/passengers/frequent', data)
  },

  /**
   * 添加常用乘客（前端显示格式）
   */
  async addPassengerFromDisplay(data: Partial<PassengerDisplay>): Promise<ApiResponse<FrequentPassenger>> {
    const backendData = toBackendRequest(data)
    return this.addFrequentPassenger(backendData as FrequentPassengerCreateRequest)
  },

  /**
   * 更新常用乘客
   */
  async updateFrequentPassenger(
    id: number, 
    data: FrequentPassengerUpdateRequest
  ): Promise<ApiResponse<FrequentPassenger>> {
    return request.put(`/passengers/frequent/${id}`, data)
  },

  /**
   * 更新常用乘客（前端显示格式）
   */
  async updatePassengerFromDisplay(
    id: number, 
    data: Partial<PassengerDisplay>
  ): Promise<ApiResponse<FrequentPassenger>> {
    const backendData = toBackendRequest(data)
    return this.updateFrequentPassenger(id, backendData)
  },

  /**
   * 删除常用乘客
   */
  async deleteFrequentPassenger(id: number): Promise<ApiResponse<void>> {
    return request.delete(`/passengers/frequent/${id}`)
  },

  /**
   * 设置默认乘客
   */
  async setDefaultPassenger(id: number): Promise<ApiResponse<void>> {
    return request.put(`/passengers/frequent/${id}/set-default`)
  },

  // ===== 兼容旧版 API（直接使用 /passengers 路径）=====
  // 这些方法是为了兼容现有的 PassengersPage.vue 和 FlightBookPage.vue

  /**
   * 获取乘客列表（旧版 API，兼容用）
   * @deprecated 推荐使用 getPassengersForDisplay()
   */
  async getPassengers(): Promise<ApiResponse<PassengerDisplay[]>> {
    return this.getPassengersForDisplay()
  },

  /**
   * 创建乘客（旧版 API，兼容用）
   * @deprecated 推荐使用 addPassengerFromDisplay()
   */
  async createPassenger(data: any): Promise<ApiResponse<any>> {
    return this.addPassengerFromDisplay(data)
  },

  /**
   * 更新乘客（旧版 API，兼容用）
   * @deprecated 推荐使用 updatePassengerFromDisplay()
   */
  async updatePassenger(id: number, data: any): Promise<ApiResponse<any>> {
    return this.updatePassengerFromDisplay(id, data)
  },

  /**
   * 删除乘客（旧版 API，兼容用）
   * @deprecated 推荐使用 deleteFrequentPassenger()
   */
  async deletePassenger(id: number): Promise<ApiResponse<void>> {
    return this.deleteFrequentPassenger(id)
  }
}

export default passengerApi
