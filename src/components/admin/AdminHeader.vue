<template>
  <header class="bg-white shadow-sm sticky top-0 z-30">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- 左侧 -->
        <div class="flex items-center">
          <button 
            @click="$emit('toggle-sidebar')" 
            class="mr-4 text-gray-500 hover:text-blue-900 transition-colors"
          >
            <i class="fas fa-bars text-xl"></i>
          </button>
          <router-link to="/admin/dashboard" class="flex items-center">
            <i class="fas fa-cube text-blue-900 text-2xl mr-2"></i>
            <span class="text-xl font-bold text-blue-900">SEUAirline 管理系统</span>
          </router-link>
        </div>

        <!-- 右侧 -->
        <div class="flex items-center space-x-4">
          <!-- 通知图标 -->
          <div class="relative">
            <button class="text-gray-500 hover:text-blue-900 focus:outline-none transition-colors">
              <i class="far fa-bell text-xl"></i>
              <span 
                v-if="notificationCount > 0"
                class="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center"
              >
                {{ notificationCount }}
              </span>
            </button>
          </div>

          <!-- 用户信息 -->
          <div class="flex items-center space-x-2">
            <img 
              :src="adminInfo?.avatar || 'https://picsum.photos/32/32'" 
              alt="管理员头像" 
              class="w-8 h-8 rounded-full"
            >
            <div class="hidden md:block">
              <div class="text-sm font-medium text-gray-700">
                {{ adminInfo?.username || '管理员' }}
              </div>
              <div class="text-xs text-gray-500">系统管理员</div>
            </div>
            <button 
              @click="handleLogout" 
              class="text-gray-500 hover:text-blue-900 transition-colors"
              title="退出登录"
            >
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const adminStore = useAdminStore()

const notificationCount = ref(3)
const adminInfo = computed(() => adminStore.adminInfo)

function handleLogout() {
  adminStore.logout()
  router.push('/admin/login')
}
</script>
