<template>
  <AdminLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">帮助中心</h1>
      <p class="text-gray-500 mt-1">管理员使用指南和常见问题解答</p>
    </div>

    <!-- 搜索栏 -->
    <div class="card mb-6">
      <div class="card-body">
        <div class="relative">
          <input v-model="searchQuery" type="text" class="input-field pl-10" placeholder="搜索帮助文档..." @keyup.enter="handleSearch">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- 帮助分类 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <div v-for="category in categories" :key="category.id" class="card hover:shadow-md transition-shadow cursor-pointer" @click="handleCategoryClick(category)">
        <div class="card-body">
          <div class="flex items-center mb-3">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center mr-3" :class="category.color">
              <i :class="category.icon + ' text-2xl text-white'"></i>
            </div>
            <div>
              <h3 class="font-medium text-gray-800">{{ category.title }}</h3>
              <p class="text-xs text-gray-500">{{ category.count }} 篇文章</p>
            </div>
          </div>
          <p class="text-sm text-gray-600">{{ category.description }}</p>
        </div>
      </div>
    </div>

    <!-- 常见问题 -->
    <div class="card">
      <div class="card-header">
        <h3 class="font-medium text-gray-800"><i class="far fa-question-circle mr-2"></i>常见问题</h3>
      </div>
      <div class="card-body">
        <div class="space-y-4">
          <div v-for="faq in faqs" :key="faq.id" class="border-b border-gray-200 pb-4 last:border-0">
            <div class="flex justify-between items-start cursor-pointer" @click="toggleFaq(faq.id)">
              <h4 class="font-medium text-gray-800 flex-1">{{ faq.question }}</h4>
              <i :class="expandedFaq === faq.id ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-gray-400 mt-1"></i>
            </div>
            <div v-if="expandedFaq === faq.id" class="mt-2 text-sm text-gray-600">{{ faq.answer }}</div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const searchQuery = ref('')
const expandedFaq = ref<number | null>(null)

const categories = ref([
  { id: 1, title: '快速入门', icon: 'fas fa-rocket', color: 'bg-blue-500', count: 8, description: '了解系统基本功能和操作流程' },
  { id: 2, title: '航班管理', icon: 'fas fa-plane', color: 'bg-green-500', count: 12, description: '如何添加、编辑和管理航班信息' },
  { id: 3, title: '订单处理', icon: 'fas fa-file-alt', color: 'bg-purple-500', count: 10, description: '订单查询、处理和退款操作' },
  { id: 4, title: '用户管理', icon: 'fas fa-users', color: 'bg-yellow-500', count: 6, description: '用户账户管理和权限设置' },
  { id: 5, title: '系统设置', icon: 'fas fa-cog', color: 'bg-red-500', count: 9, description: '系统参数配置和优化建议' },
  { id: 6, title: '故障排除', icon: 'fas fa-tools', color: 'bg-gray-500', count: 15, description: '常见问题解决方案' }
])

const faqs = ref([
  { id: 1, question: '如何添加新航班？', answer: '在航班管理页面点击“添加航班”按钮，填写航班信息后保存即可。' },
  { id: 2, question: '如何处理退款请求？', answer: '在订单管理页面找到对应订单，点击“退款”按钮，审核通过后系统会自动处理。' },
  { id: 3, question: '如何禁用用户账户？', answer: '在用户管理页面找到目标用户，点击“禁用”按钮即可。禁用后用户将无法登录系统。' },
  { id: 4, question: '如何修改系统设置？', answer: '在系统设置页面可以修改系统名称、邮件配置、支付设置等，修改后记得点击保存。' },
  { id: 5, question: '如何查看系统日志？', answer: '在系统日志页面可以查看所有操作记录，支持按类型、时间筛选和导出。' }
])

function handleSearch() {}
function handleCategoryClick(category: any) {
  alert(`查看 ${category.title} 相关文档`)
}
function toggleFaq(id: number) {
  expandedFaq.value = expandedFaq.value === id ? null : id
}
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden; }
.card-header { @apply px-5 py-4 border-b border-gray-100; }
.card-body { @apply px-5 py-4; }
.input-field { @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900/50; }
</style>
