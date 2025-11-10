<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <AdminHeader @toggle-sidebar="toggleSidebar" />
    
    <!-- 主要内容区 -->
    <div class="flex">
      <!-- 侧边栏 -->
      <AdminSidebar :is-collapsed="isSidebarCollapsed" />
      
      <!-- 内容区域 -->
      <main class="flex-1 p-6 transition-all duration-300">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminHeader from './AdminHeader.vue'
import AdminSidebar from './AdminSidebar.vue'

const isSidebarCollapsed = ref(false)

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>
