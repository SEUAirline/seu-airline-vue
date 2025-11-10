<template>
  <div v-if="!isBackendConnected" class="backend-status-warning">
    <div class="warning-content">
      <span class="warning-icon">⚠️</span>
      <span class="warning-text">后端服务未启动，请先启动后端服务</span>
      <button @click="checkConnection" class="retry-btn">重试</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const isBackendConnected = ref(true)
const checking = ref(false)

const checkConnection = async () => {
  if (checking.value) return
  
  checking.value = true
  try {
    // 尝试连接后端健康检查接口
    await axios.get('/api/airport/list', { timeout: 3000 })
    isBackendConnected.value = true
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      isBackendConnected.value = false
    } else {
      // 其他错误（如403）说明后端是连接的
      isBackendConnected.value = true
    }
  } finally {
    checking.value = false
  }
}

onMounted(() => {
  checkConnection()
  // 每30秒检查一次
  setInterval(checkConnection, 30000)
})
</script>

<style scoped>
.backend-status-warning {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  padding: 12px 20px;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.warning-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.warning-icon {
  font-size: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.warning-text {
  flex: 1;
  font-weight: 500;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.retry-btn:active {
  transform: scale(0.95);
}
</style>
