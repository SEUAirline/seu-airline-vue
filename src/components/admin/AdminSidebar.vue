<template>
  <aside 
    class="w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300"
    :class="{ 'hidden': isCollapsed }"
  >
    <nav class="p-4">
      <!-- 主菜单 -->
      <div class="mb-6">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          主菜单
        </h3>
        <div class="space-y-2">
          <router-link
            v-for="item in mainMenuItems"
            :key="item.path"
            :to="item.path"
            class="sidebar-link"
            :class="{ 'active': isActive(item.path) }"
          >
            <i :class="item.icon" class="w-5 mr-3"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </div>

      <!-- 系统设置 -->
      <div class="mb-6">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          系统设置
        </h3>
        <div class="space-y-2">
          <router-link
            v-for="item in settingsMenuItems"
            :key="item.path"
            :to="item.path"
            class="sidebar-link"
            :class="{ 'active': isActive(item.path) }"
          >
            <i :class="item.icon" class="w-5 mr-3"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </div>

      <!-- 帮助与支持 -->
      <div>
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          帮助与支持
        </h3>
        <div class="space-y-2">
          <router-link
            v-for="item in helpMenuItems"
            :key="item.path"
            :to="item.path"
            class="sidebar-link"
            :class="{ 'active': isActive(item.path) }"
          >
            <i :class="item.icon" class="w-5 mr-3"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps<{
  isCollapsed: boolean
}>()

const route = useRoute()

// 主菜单项
const mainMenuItems = [
  { path: '/admin/dashboard', label: '仪表盘', icon: 'fas fa-tachometer-alt' },
  { path: '/admin/flights', label: '航班管理', icon: 'fas fa-plane' },
  { path: '/admin/orders', label: '订单管理', icon: 'far fa-file-alt' },
  { path: '/admin/users', label: '用户管理', icon: 'fas fa-users' },
  { path: '/admin/airports', label: '机场管理', icon: 'far fa-building' }
]

// 系统设置菜单项
const settingsMenuItems = [
  { path: '/admin/settings', label: '系统设置', icon: 'fas fa-cog' },
  { path: '/admin/accounts', label: '管理员账户', icon: 'far fa-user-circle' },
  { path: '/admin/logs', label: '系统日志', icon: 'fas fa-history' }
]

// 帮助与支持菜单项
const helpMenuItems = [
  { path: '/admin/help', label: '帮助中心', icon: 'far fa-question-circle' },
  { path: '/admin/docs', label: '文档中心', icon: 'fas fa-file-alt' }
]

// 判断是否为当前激活路由
function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-900 transition-all duration-200 rounded-lg cursor-pointer;
}

.sidebar-link.active {
  @apply bg-blue-50 text-blue-900 font-medium;
}
</style>
