<template>
  <AdminLayout>
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">仪表盘</h1>
      <p class="text-gray-500 mt-1">欢迎回来，{{ adminInfo?.username || '管理员' }}！这是系统的运行概览</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- 今日航班 -->
      <div class="stat-card">
        <div class="stat-icon bg-blue-500">
          <i class="fas fa-plane text-xl"></i>
        </div>
        <div>
          <div class="text-3xl font-bold text-gray-800">{{ stats.totalFlights }}</div>
          <div class="text-sm text-gray-500">航班总数</div>
          <div class="text-xs text-green-500 mt-1">
            <i class="fas fa-arrow-up mr-1"></i> 活跃航班 {{ stats.activeFlights }}
          </div>
        </div>
      </div>

      <!-- 今日订单 -->
      <div class="stat-card">
        <div class="stat-icon bg-green-500">
          <i class="far fa-file-alt text-xl"></i>
        </div>
        <div>
          <div class="text-3xl font-bold text-gray-800">{{ stats.todayOrders }}</div>
          <div class="text-sm text-gray-500">今日订单数</div>
          <div class="text-xs text-green-500 mt-1">
            <i class="fas fa-arrow-up mr-1"></i> 总订单 {{ stats.totalOrders }}
          </div>
        </div>
      </div>

      <!-- 总用户 -->
      <div class="stat-card">
        <div class="stat-icon bg-purple-500">
          <i class="fas fa-users text-xl"></i>
        </div>
        <div>
          <div class="text-3xl font-bold text-gray-800">{{ stats.totalUsers.toLocaleString() }}</div>
          <div class="text-sm text-gray-500">总用户数</div>
          <div class="text-xs text-green-500 mt-1">
            <i class="fas fa-arrow-up mr-1"></i> 持续增长中
          </div>
        </div>
      </div>

      <!-- 今日收入 -->
      <div class="stat-card">
        <div class="stat-icon bg-amber-500">
          <i class="fas fa-chart-line text-xl"></i>
        </div>
        <div>
          <div class="text-3xl font-bold text-gray-800">¥{{ stats.todayRevenue.toLocaleString() }}</div>
          <div class="text-sm text-gray-500">今日销售额</div>
          <div class="text-xs text-blue-500 mt-1">
            <i class="fas fa-info-circle mr-1"></i> 总收入 ¥{{ stats.totalRevenue.toLocaleString() }}
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 销售趋势图表 -->
      <div class="card">
        <div class="card-header">
          <h3 class="font-medium text-gray-800">销售趋势分析</h3>
          <select 
            v-model="salesPeriod"
            class="pl-3 pr-10 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900"
          >
            <option value="7">近7天</option>
            <option value="30">近30天</option>
            <option value="90">近90天</option>
          </select>
        </div>
        <div class="card-body">
          <canvas ref="salesChartRef" height="250"></canvas>
        </div>
      </div>

      <!-- 热门航线图表 -->
      <div class="card">
        <div class="card-header">
          <h3 class="font-medium text-gray-800">热门航线分布</h3>
          <select 
            v-model="routesPeriod"
            class="pl-3 pr-10 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900"
          >
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="quarter">本季度</option>
          </select>
        </div>
        <div class="card-body">
          <canvas ref="routesChartRef" height="250"></canvas>
        </div>
      </div>
    </div>

    <!-- 最近活动和待处理任务 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 最新订单 -->
      <div class="card lg:col-span-2">
        <div class="card-header">
          <h3 class="font-medium text-gray-800">最新订单</h3>
          <router-link 
            to="/admin/orders" 
            class="text-blue-900 text-sm hover:underline"
          >
            查看全部
          </router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单号</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">航班号</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">乘客</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-800">{{ order.orderNo }}</td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{{ order.flightNo }}</td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ order.passengers?.[0]?.name || '-' }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">¥{{ order.totalAmount.toLocaleString() }}</td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-sm text-blue-900">
                  <router-link :to="`/admin/orders?id=${order.id}`" class="hover:underline">
                    查看详情
                  </router-link>
                </td>
              </tr>
              <tr v-if="recentOrders.length === 0">
                <td colspan="6" class="px-5 py-8 text-center text-gray-500">
                  暂无订单数据
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 待处理任务 -->
      <div class="card">
        <div class="card-header">
          <h3 class="font-medium text-gray-800">待处理任务</h3>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {{ pendingTasks.length }} 项
          </span>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div v-for="(task, index) in pendingTasks" :key="index" class="flex items-start">
              <input 
                type="checkbox" 
                :checked="task.completed"
                @change="toggleTask(index)"
                class="h-5 w-5 text-blue-900 focus:ring-blue-900 border-gray-300 rounded mt-0.5"
              >
              <div class="ml-3">
                <p class="text-sm text-gray-800 font-medium" :class="{ 'line-through text-gray-400': task.completed }">
                  {{ task.title }}
                </p>
                <p class="text-xs text-gray-500 mt-1">{{ task.description }}</p>
              </div>
            </div>
            <div v-if="pendingTasks.length === 0" class="text-center text-gray-500 py-4">
              暂无待处理任务
            </div>
          </div>
          <div class="mt-6">
            <a href="#" class="text-center block text-blue-900 text-sm font-medium hover:underline">
              查看全部任务
            </a>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { adminApi } from '@/api/admin'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import type { Order } from '@/types/order'

const adminStore = useAdminStore()

// 管理员信息
const adminInfo = computed(() => adminStore.adminInfo)

// 统计数据
const stats = ref({
  totalFlights: 0,
  activeFlights: 0,
  totalOrders: 0,
  todayOrders: 0,
  totalUsers: 0,
  totalRevenue: 0,
  todayRevenue: 0,
  pendingOrders: 0
})

// 最新订单
const recentOrders = ref<Order[]>([])

// 待处理任务
const pendingTasks = ref([
  { title: '处理异常订单（5个）', description: '需要管理员审核的异常订单', completed: false },
  { title: '添加新航班信息（3条）', description: '需添加明天的航班信息', completed: false },
  { title: '审核用户退票申请', description: '有2个用户申请退票', completed: false },
  { title: '更新航班状态', description: '部分航班信息需要更新', completed: false }
])

// 图表相关
const salesChartRef = ref<HTMLCanvasElement | null>(null)
const routesChartRef = ref<HTMLCanvasElement | null>(null)
const salesPeriod = ref('7')
const routesPeriod = ref('week')

// 获取统计数据
async function loadStats() {
  try {
    const response = await adminApi.getStats()
    if (response.success && response.data) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 获取最新订单
async function loadRecentOrders() {
  try {
    const response = await adminApi.getAllOrders()
    if (response.success && response.data) {
      // 取最新的4条订单
      recentOrders.value = response.data.slice(0, 4)
    }
  } catch (error) {
    console.error('加载最新订单失败:', error)
  }
}

// Chart.js 实例
let salesChart: any = null
let routesChart: any = null

// 初始化图表
async function initCharts() {
  try {
    // 动态导入 Chart.js
    const { Chart, registerables } = await import('chart.js')
    Chart.register(...registerables)

    // 销售趋势图表
    if (salesChartRef.value) {
      // 销毁旧图表
      if (salesChart) {
        salesChart.destroy()
      }

      // 生成销售数据
      const days = parseInt(salesPeriod.value)
      const labels = []
      const data = []
      const today = new Date()
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        labels.push(`${date.getMonth() + 1}/${date.getDate()}`)
        // 模拟数据：基础值 + 随机波动
        data.push(Math.floor(5000 + Math.random() * 3000 + (days - i) * 100))
      }

      salesChart = new Chart(salesChartRef.value, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: '销售额（¥）',
            data,
            borderColor: 'rgb(30, 58, 138)',
            backgroundColor: 'rgba(30, 58, 138, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context: any) {
                  return '销售额: ¥' + (context.parsed.y || 0).toLocaleString()
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '¥' + value.toLocaleString()
                }
              }
            }
          }
        }
      })
    }

    // 热门航线图表
    if (routesChartRef.value) {
      // 销毁旧图表
      if (routesChart) {
        routesChart.destroy()
      }

      // 热门航线数据
      const routeData = {
        week: {
          labels: ['北京-上海', '上海-广州', '广州-深圳', '成都-北京', '杭州-北京'],
          data: [450, 380, 320, 280, 250]
        },
        month: {
          labels: ['北京-上海', '上海-广州', '广州-深圳', '成都-北京', '杭州-北京', '西安-上海'],
          data: [1850, 1620, 1380, 1150, 980, 850]
        },
        quarter: {
          labels: ['北京-上海', '上海-广州', '广州-深圳', '成都-北京', '杭州-北京', '西安-上海', '南京-深圳'],
          data: [5500, 4800, 4200, 3600, 3100, 2800, 2400]
        }
      }

      const currentData = routeData[routesPeriod.value as keyof typeof routeData]

      routesChart = new Chart(routesChartRef.value, {
        type: 'bar',
        data: {
          labels: currentData.labels,
          datasets: [{
            label: '订单数量',
            data: currentData.data,
            backgroundColor: [
              'rgba(30, 58, 138, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(147, 197, 253, 0.8)',
              'rgba(96, 165, 250, 0.8)',
              'rgba(37, 99, 235, 0.8)',
              'rgba(29, 78, 216, 0.8)',
              'rgba(30, 64, 175, 0.8)'
            ],
            borderColor: [
              'rgb(30, 58, 138)',
              'rgb(59, 130, 246)',
              'rgb(147, 197, 253)',
              'rgb(96, 165, 250)',
              'rgb(37, 99, 235)',
              'rgb(29, 78, 216)',
              'rgb(30, 64, 175)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return '订单数: ' + context.parsed.y + ' 单'
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return value + ' 单'
                }
              }
            }
          }
        }
      })
    }
  } catch (error) {
    console.error('初始化图表失败:', error)
    // 如果 Chart.js 未安装，显示提示信息
    if (salesChartRef.value) {
      const salesCtx = salesChartRef.value.getContext('2d')
      if (salesCtx) {
        salesCtx.fillStyle = '#E5E7EB'
        salesCtx.fillRect(0, 0, salesChartRef.value.width, salesChartRef.value.height)
        salesCtx.fillStyle = '#6B7280'
        salesCtx.font = '14px sans-serif'
        salesCtx.textAlign = 'center'
        salesCtx.fillText('图表功能需要安装 Chart.js', salesChartRef.value.width / 2, salesChartRef.value.height / 2)
        salesCtx.fillText('npm install chart.js', salesChartRef.value.width / 2, salesChartRef.value.height / 2 + 20)
      }
    }
    if (routesChartRef.value) {
      const routesCtx = routesChartRef.value.getContext('2d')
      if (routesCtx) {
        routesCtx.fillStyle = '#E5E7EB'
        routesCtx.fillRect(0, 0, routesChartRef.value.width, routesChartRef.value.height)
        routesCtx.fillStyle = '#6B7280'
        routesCtx.font = '14px sans-serif'
        routesCtx.textAlign = 'center'
        routesCtx.fillText('图表功能需要安装 Chart.js', routesChartRef.value.width / 2, routesChartRef.value.height / 2)
        routesCtx.fillText('npm install chart.js', routesChartRef.value.width / 2, routesChartRef.value.height / 2 + 20)
      }
    }
  }
}

// 切换任务状态
function toggleTask(index: number) {
  pendingTasks.value[index].completed = !pendingTasks.value[index].completed
}

// 获取订单状态样式
function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    'pending': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    'paid': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    'completed': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    'cancelled': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
  }
  return classes[status] || classes['pending']
}

// 获取订单状态文本
function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    'pending': '待支付',
    'paid': '已支付',
    'completed': '已出票',
    'cancelled': '已取消'
  }
  return texts[status] || status
}

// 监听时间段变化
watch([salesPeriod, routesPeriod], () => {
  // 重新加载图表数据
  initCharts()
})

// 页面加载时
onMounted(async () => {
  await loadStats()
  await loadRecentOrders()
  initCharts()
})
</script>

<style scoped>
.stat-card {
  @apply bg-white rounded-lg shadow-sm p-5 border border-gray-100 flex items-center;
}

.stat-icon {
  @apply w-12 h-12 rounded-full flex items-center justify-center text-white mr-4;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden;
}

.card-header {
  @apply px-5 py-4 border-b border-gray-100 flex justify-between items-center;
}

.card-body {
  @apply px-5 py-4;
}
</style>
