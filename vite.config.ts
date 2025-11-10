import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { handleMockRequest } from './mock-data'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  const useMock = env.VITE_USE_MOCK === 'true'
  
  console.log('=== Vite 配置 ===')
  console.log('模式:', mode)
  console.log('命令:', command)
  console.log('VITE_USE_MOCK:', env.VITE_USE_MOCK)
  console.log('useMock:', useMock)
  console.log('proxy 配置已启用:', !useMock)

  return {
    plugins: [
      vue(),
      // 自定义 Mock 插件
      useMock && command === 'serve' ? {
        name: 'vite-plugin-custom-mock',
        configureServer(server: any) {
          console.log('🚀 自定义 Mock 插件已启用')
          
          server.middlewares.use(async (req: any, res: any, next: any) => {
            if (req.url?.startsWith('/api/')) {
              const handled = handleMockRequest(req, res)
              if (handled) return
            }
            next()
          })
        }
      } : null
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 5173,
      open: true,
      // 根据 Mock 开关决定是否启用 proxy
      // 当 VITE_USE_MOCK=false 时，需要启用 proxy 连接后端
      proxy: useMock ? undefined : {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          ws: true
        },
        '/auth': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'chart-vendor': ['chart.js', 'vue-chartjs']
          }
        }
      }
    }
  }
})
