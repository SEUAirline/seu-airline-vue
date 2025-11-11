import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FrequentPassenger, PassengerDisplay } from '@/types/passenger'
import { passengerApi } from '@/api/passenger'
import { toPassengerDisplay } from '@/types/passenger'

/**
 * 常用乘客状态管理
 */
export const usePassengerStore = defineStore('passenger', () => {
  // ===== 状态 =====
  const frequentPassengers = ref<FrequentPassenger[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ===== 计算属性 =====
  
  /**
   * 前端显示格式的乘客列表（兼容旧版）
   */
  const passengersForDisplay = computed<PassengerDisplay[]>(() => {
    return frequentPassengers.value.map(toPassengerDisplay)
  })

  /**
   * 默认乘客
   */
  const defaultPassenger = computed(() => {
    return frequentPassengers.value.find(p => p.isDefault) || null
  })

  /**
   * 成人乘客列表
   */
  const adultPassengers = computed(() => {
    return frequentPassengers.value.filter(p => p.passengerType === 'ADULT')
  })

  /**
   * 儿童乘客列表
   */
  const childPassengers = computed(() => {
    return frequentPassengers.value.filter(p => p.passengerType === 'CHILD')
  })

  /**
   * 乘客总数
   */
  const totalCount = computed(() => frequentPassengers.value.length)

  // ===== 方法 =====

  /**
   * 加载常用乘客列表
   */
  async function loadFrequentPassengers() {
    loading.value = true
    error.value = null
    try {
      const response = await passengerApi.getFrequentPassengers()
      if (response.success && response.data) {
        frequentPassengers.value = response.data
        return { success: true, data: response.data }
      }
      error.value = response.message || '加载失败'
      return { success: false, message: error.value }
    } catch (err) {
      error.value = '加载失败，请稍后重试'
      console.error('加载常用乘客失败:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 添加常用乘客
   */
  async function addFrequentPassenger(data: any) {
    loading.value = true
    error.value = null
    try {
      const response = await passengerApi.addPassengerFromDisplay(data)
      if (response.success) {
        await loadFrequentPassengers() // 重新加载列表
        return { success: true, data: response.data }
      }
      error.value = response.message || '添加失败'
      return { success: false, message: error.value }
    } catch (err) {
      error.value = '添加失败，请稍后重试'
      console.error('添加常用乘客失败:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新常用乘客
   */
  async function updateFrequentPassenger(id: number, data: any) {
    loading.value = true
    error.value = null
    try {
      const response = await passengerApi.updatePassengerFromDisplay(id, data)
      if (response.success) {
        await loadFrequentPassengers() // 重新加载列表
        return { success: true, data: response.data }
      }
      error.value = response.message || '更新失败'
      return { success: false, message: error.value }
    } catch (err) {
      error.value = '更新失败，请稍后重试'
      console.error('更新常用乘客失败:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除常用乘客
   */
  async function deleteFrequentPassenger(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await passengerApi.deleteFrequentPassenger(id)
      if (response.success) {
        // 从列表中移除
        frequentPassengers.value = frequentPassengers.value.filter(p => p.id !== id)
        return { success: true }
      }
      error.value = response.message || '删除失败'
      return { success: false, message: error.value }
    } catch (err) {
      error.value = '删除失败，请稍后重试'
      console.error('删除常用乘客失败:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 设置默认乘客
   */
  async function setDefaultPassenger(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await passengerApi.setDefaultPassenger(id)
      if (response.success) {
        // 更新本地状态
        frequentPassengers.value.forEach(p => {
          p.isDefault = p.id === id
        })
        return { success: true }
      }
      error.value = response.message || '设置失败'
      return { success: false, message: error.value }
    } catch (err) {
      error.value = '设置失败，请稍后重试'
      console.error('设置默认乘客失败:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据ID查找乘客
   */
  function getPassengerById(id: number) {
    return frequentPassengers.value.find(p => p.id === id) || null
  }

  /**
   * 清空错误信息
   */
  function clearError() {
    error.value = null
  }

  /**
   * 清空数据
   */
  function clearData() {
    frequentPassengers.value = []
    error.value = null
  }

  return {
    // 状态
    frequentPassengers,
    passengersForDisplay,
    loading,
    error,
    
    // 计算属性
    defaultPassenger,
    adultPassengers,
    childPassengers,
    totalCount,
    
    // 方法
    loadFrequentPassengers,
    addFrequentPassenger,
    updateFrequentPassenger,
    deleteFrequentPassenger,
    setDefaultPassenger,
    getPassengerById,
    clearError,
    clearData
  }
})
