<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <RouterView />
    
    <!-- Token 过期提示（自动消失，无需确认） -->
    <div v-if="showTokenExpiredModal" 
         class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300"
         :class="showTokenExpiredModal ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'">
      <div class="bg-white rounded-lg px-6 py-4 shadow-xl border-l-4 border-yellow-500 flex items-center space-x-3">
        <svg class="w-6 h-6 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p class="text-gray-900 font-medium">登录已过期</p>
          <p class="text-sm text-gray-600">您的登录状态已过期，请重新登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'

const showTokenExpiredModal = ref(false)
const userStore = useUserStore()

// 处理 token 过期事件
const handleTokenExpired = (event: Event) => {
  const customEvent = event as CustomEvent
  console.log('Token 过期:', customEvent.detail?.message)
  
  // 显示过期提示（3秒后自动消失，无需点击，不跳转）
  showTokenExpiredModal.value = true
  
  // 清除用户状态
  userStore.logout()
  
  // 3秒后自动关闭提示，不做任何跳转
  setTimeout(() => {
    showTokenExpiredModal.value = false
  }, 3000)
}

// 组件挂载时添加事件监听
onMounted(() => {
  window.addEventListener('token-expired', handleTokenExpired)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('token-expired', handleTokenExpired)
})
</script>

<style scoped>
/* 全局样式在 main.css 中定义 */
</style>

<!--test-->
