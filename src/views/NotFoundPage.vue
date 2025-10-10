<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary">404</h1>
      <h2 class="text-3xl font-semibold text-gray-800 mt-4">页面未找到</h2>
      <p class="text-gray-600 mt-2 mb-8">抱歉，您访问的页面不存在</p>
      <button @click="goHome" class="btn-primary">
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>
