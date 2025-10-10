import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order, OrderCreateParams, PaymentParams } from '@/types/order'
import { orderApi } from '@/api/order'

export const useOrderStore = defineStore('order', () => {
  // 状态
  const currentOrder = ref<Order | null>(null)
  const orderList = ref<Order[]>([])
  const loading = ref(false)

  // 创建订单
  async function createOrder(params: OrderCreateParams) {
    loading.value = true
    try {
      const response = await orderApi.createOrder(params)
      if (response.success && response.data) {
        currentOrder.value = response.data
        return { success: true, data: response.data }
      }
      return { success: false, message: response.message || '创建订单失败' }
    } catch (error) {
      return { success: false, message: '创建订单失败，请稍后重试' }
    } finally {
      loading.value = false
    }
  }

  // 获取用户订单列表
  async function getUserOrders() {
    loading.value = true
    try {
      const response = await orderApi.getUserOrders()
      if (response.success && response.data) {
        orderList.value = response.data
        return { success: true, data: response.data }
      }
      return { success: false, message: response.message || '获取订单列表失败' }
    } catch (error) {
      return { success: false, message: '获取订单列表失败' }
    } finally {
      loading.value = false
    }
  }

  // 获取订单详情
  async function getOrderById(orderId: string) {
    try {
      const response = await orderApi.getOrderById(orderId)
      if (response.success && response.data) {
        currentOrder.value = response.data
        return { success: true, data: response.data }
      }
      return { success: false, message: response.message || '获取订单详情失败' }
    } catch (error) {
      return { success: false, message: '获取订单详情失败' }
    }
  }

  // 支付订单
  async function payOrder(params: PaymentParams) {
    loading.value = true
    try {
      const response = await orderApi.payOrder(params)
      if (response.success) {
        // 更新当前订单状态
        if (currentOrder.value && currentOrder.value.id === params.orderId) {
          currentOrder.value.status = 'paid'
          currentOrder.value.paymentMethod = params.paymentMethod
        }
        return { success: true }
      }
      return { success: false, message: response.message || '支付失败' }
    } catch (error) {
      return { success: false, message: '支付失败，请稍后重试' }
    } finally {
      loading.value = false
    }
  }

  // 取消订单
  async function cancelOrder(orderId: string) {
    try {
      const response = await orderApi.cancelOrder(orderId)
      if (response.success) {
        // 更新订单列表中的状态
        const order = orderList.value.find(o => o.id === orderId)
        if (order) {
          order.status = 'cancelled'
        }
        return { success: true }
      }
      return { success: false, message: response.message || '取消订单失败' }
    } catch (error) {
      return { success: false, message: '取消订单失败' }
    }
  }

  // 清空当前订单
  function clearCurrentOrder() {
    currentOrder.value = null
  }

  return {
    currentOrder,
    orderList,
    loading,
    createOrder,
    getUserOrders,
    getOrderById,
    payOrder,
    cancelOrder,
    clearCurrentOrder
  }
})
