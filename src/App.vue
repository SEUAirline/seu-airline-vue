<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <RouterView />
    
    <!-- Token 过期弹窗 -->
    <div v-if="showTokenExpiredModal" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         @click="closeTokenExpiredModal">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl" 
           @click.stop>
        <div class="flex items-center mb-4">
          <svg class="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900">登录已过期</h3>
        </div>
        <p class="text-gray-600 mb-6">您的登录状态已过期，请重新登录以继续使用。</p>
        <button @click="closeTokenExpiredModal"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          我知道了
        </button>
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
  
  // 显示过期提示弹窗
  showTokenExpiredModal.value = true
  
  // 清除用户状态
  userStore.logout()
}

// 关闭弹窗
const closeTokenExpiredModal = () => {
  showTokenExpiredModal.value = false
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
