import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 状态
  const loading = ref(false)
  const sidebarCollapsed = ref(false)
  const isMobile = ref(false)

  // Toast消息
  const toastMessage = ref('')
  const toastType = ref<'success' | 'error' | 'warning' | 'info'>('info')
  const showToast = ref(false)

  // 显示加载状态
  function setLoading(value: boolean) {
    loading.value = value
  }

  // 切换侧边栏
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 设置移动端状态
  function setMobile(value: boolean) {
    isMobile.value = value
  }

  // 显示Toast消息
  function showToastMessage(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration = 3000
  ) {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true

    setTimeout(() => {
      showToast.value = false
    }, duration)
  }

  return {
    loading,
    sidebarCollapsed,
    isMobile,
    toastMessage,
    toastType,
    showToast,
    setLoading,
    toggleSidebar,
    setMobile,
    showToastMessage
  }
})
