<template>
  <AdminLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">文档中心</h1>
      <p class="text-gray-500 mt-2">浏览系统使用文档、API参考和用户手册</p>
    </div>

    <!-- 搜索框 -->
    <div class="mb-8">
      <div class="relative">
        <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input v-model="searchQuery" type="text" class="input-field pl-12" placeholder="搜索文档、API或用户手册..." @keyup.enter="handleSearch">
      </div>
    </div>

    <!-- 文档分类选项卡 -->
    <div class="mb-6 border-b border-gray-200">
      <div class="flex overflow-x-auto whitespace-nowrap pb-2 -mb-px">
        <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id" :class="['px-4 py-2 mr-2 text-sm font-medium border-b-2 transition-colors', activeCategory === cat.id ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-500 hover:text-gray-700']">
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- 文档查看区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 左侧文档树 -->
      <div class="hidden lg:block">
        <div class="card">
          <div class="card-header">
            <h3 class="font-semibold">文档目录</h3>
          </div>
          <div class="card-body p-0">
            <div class="doc-tree">
              <div v-for="tree in docTree" :key="tree.id" class="doc-tree-section">
                <div @click="toggleTree(tree.id)" :class="['doc-tree-item has-children', expandedTrees.includes(tree.id) ? 'expanded' : '']">
                  <i :class="['fas mr-2', expandedTrees.includes(tree.id) ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
                  {{ tree.title }}
                </div>
                <div v-if="expandedTrees.includes(tree.id)" class="doc-tree-subitems">
                  <div v-for="item in tree.items" :key="item" @click="handleDocClick(item)" :class="['doc-tree-item', selectedDoc === item ? 'active' : '']">
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="lg:col-span-3">
        <!-- 热门文档 -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">热门文档</h2>
            <a href="#" class="text-blue-900 text-sm hover:underline">查看全部</a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="doc in popularDocs" :key="doc.id" class="card hover:shadow-md transition-shadow cursor-pointer" @click="handleDocClick(doc.title)">
              <div class="card-header flex justify-between items-center">
                <h3 class="font-semibold">{{ doc.title }}</h3>
                <span :class="['doc-badge', doc.badge === 'popular' ? 'badge-popular' : 'badge-updated']">{{ doc.badge === 'popular' ? '热门' : '已更新' }}</span>
              </div>
              <div class="card-body">
                <p class="text-gray-700 mb-3">{{ doc.description }}</p>
                <div class="flex justify-between items-center text-sm text-gray-500">
                  <span><i class="far fa-folder mr-1"></i> {{ doc.category }}</span>
                  <span><i class="fas fa-clock mr-1"></i> {{ doc.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 最新文档 -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">最新文档</h2>
            <a href="#" class="text-blue-900 text-sm hover:underline">查看全部</a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="doc in latestDocs" :key="doc.id" class="card hover:shadow-md transition-shadow cursor-pointer" @click="handleDocClick(doc.title)">
              <div class="card-header flex justify-between items-center">
                <h3 class="font-semibold text-sm">{{ doc.title }}</h3>
                <span :class="['doc-badge', doc.badge === 'new' ? 'badge-new' : 'badge-updated']">{{ doc.badge === 'new' ? '新' : '已更新' }}</span>
              </div>
              <div class="card-body">
                <p class="text-gray-700 text-sm mb-3">{{ doc.description }}</p>
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span><i class="far fa-folder mr-1"></i> {{ doc.category }}</span>
                  <span><i class="fas fa-clock mr-1"></i> {{ doc.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文档分类浏览 -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">文档分类</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="cat in docCategories" :key="cat.id" class="card hover:shadow-md transition-shadow cursor-pointer" @click="handleCategoryClick(cat)">
              <div class="card-header">
                <div class="flex items-center">
                  <i :class="cat.icon + ' text-blue-900 text-xl mr-3'"></i>
                  <h3 class="font-semibold">{{ cat.title }}</h3>
                </div>
              </div>
              <div class="card-body">
                <p class="text-gray-700 mb-4">{{ cat.description }}</p>
                <ul class="space-y-2">
                  <li v-for="item in cat.items.slice(0, 4)" :key="item" class="flex items-center justify-between">
                    <span class="text-gray-700 hover:text-blue-900 cursor-pointer text-sm">{{ item }}</span>
                    <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
                  </li>
                </ul>
                <div class="mt-4 text-sm text-gray-500">共 {{ cat.items.length }} 篇文档</div>
              </div>
            </div>
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
const activeCategory = ref('all')
const selectedDoc = ref('')
const expandedTrees = ref(['system', 'api'])

const categories = ref([
  { id: 'all', name: '全部文档' },
  { id: 'system', name: '系统文档' },
  { id: 'api', name: 'API文档' },
  { id: 'user-guide', name: '用户手册' },
  { id: 'developer', name: '开发者指南' },
  { id: 'release-notes', name: '发布说明' }
])

const docTree = ref([
  { id: 'system', title: '系统文档', items: ['系统概述', '系统架构', '功能模块说明', '系统配置指南'] },
  { id: 'api', title: 'API文档', items: ['API概述', '认证方式', '航班API', '订单API', '用户API', '支付API'] },
  { id: 'user-guide', title: '用户手册', items: ['系统登录', '航班管理', '订单处理', '用户管理', '数据统计'] },
  { id: 'developer', title: '开发者指南', items: ['开发环境搭建', '代码规范', '数据库设计', '测试策略', '部署指南'] },
  { id: 'release', title: '发布说明', items: ['最新版本', '历史版本', '更新日志'] }
])

const popularDocs = ref([
  { id: 1, title: '系统管理操作指南', description: '详细介绍系统管理员的日常操作，包括航班管理、订单处理、用户管理等核心功能的使用方法。', category: '用户手册', date: '2023-06-15更新', badge: 'popular' },
  { id: 2, title: 'API接口文档', description: '完整的API接口参考文档，包括认证方法、请求参数、响应格式及错误码说明。', category: 'API文档', date: '2023-07-10更新', badge: 'updated' }
])

const latestDocs = ref([
  { id: 1, title: '数据分析报表功能', description: '介绍新上线的数据分析报表功能，包括销售统计、用户增长等数据可视化展示。', category: '系统文档', date: '2023-07-14', badge: 'new' },
  { id: 2, title: '安全加固指南', description: '详细的系统安全加固方案，包括密码策略、访问控制、数据加密等安全措施。', category: '系统文档', date: '2023-07-12', badge: 'updated' },
  { id: 3, title: '开发者API示例代码', description: '各编程语言的API调用示例代码，包括Python、Java、JavaScript等多种实现方式。', category: '开发者指南', date: '2023-07-11', badge: 'new' }
])

const docCategories = ref([
  { id: 1, icon: 'fas fa-cube', title: '系统文档', description: '系统架构、功能模块和配置指南等系统级文档。', items: ['系统概述', '系统架构', '功能模块说明', '系统配置指南', '性能优化', '故障排查'] },
  { id: 2, icon: 'fas fa-code', title: 'API文档', description: '完整的API接口文档，包括认证、请求和响应格式。', items: ['API概述', '认证方式', '航班API', '订单API', '用户API', '支付API', '错误码'] },
  { id: 3, icon: 'fas fa-book', title: '用户手册', description: '面向管理员的详细操作手册和使用指南。', items: ['系统登录', '航班管理', '订单处理', '用户管理', '数据统计', '报表导出'] },
  { id: 4, icon: 'fas fa-laptop-code', title: '开发者指南', description: '面向开发者的技术文档和最佳实践。', items: ['开发环境搭建', '代码规范', '数据库设计', '测试策略', '部署指南', 'CI/CD'] },
  { id: 5, icon: 'fas fa-rocket', title: '发布说明', description: '系统版本更新记录和新功能介绍。', items: ['最新版本 v2.0', '历史版本', '更新日志', '已知问题', '路线图'] },
  { id: 6, icon: 'fas fa-question-circle', title: '常见问题', description: '常见问题解答和故障排除指南。', items: ['登录问题', '权限问题', '数据问题', '性能问题', '其他问题'] }
])

function handleSearch() {
  if (searchQuery.value) {
    console.log(`搜索: ${searchQuery.value}`)
  }
}

function toggleTree(id: string) {
  const index = expandedTrees.value.indexOf(id)
  if (index > -1) {
    expandedTrees.value.splice(index, 1)
  } else {
    expandedTrees.value.push(id)
  }
}

function handleDocClick(title: string) {
  selectedDoc.value = title
  console.log(`查看文档: ${title}`)
}

function handleCategoryClick(cat: any) {
  console.log(`浏览 ${cat.title} 分类`)
}
</script>

<style scoped>
.card { @apply bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden; }
.card-header { @apply px-5 py-4 border-b border-gray-100; }
.card-body { @apply px-5 py-4; }
.input-field { @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900/50; }

.doc-tree { @apply p-2; }
.doc-tree-item { @apply px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded transition-colors; }
.doc-tree-item.has-children { @apply font-medium text-gray-700; }
.doc-tree-item.active { @apply bg-blue-50 text-blue-900 font-medium; }
.doc-tree-subitems { @apply ml-4 mt-1 space-y-1; }
.doc-tree-subitems .doc-tree-item { @apply text-gray-600; }

.doc-badge { @apply inline-flex items-center px-2 py-0.5 rounded text-xs font-medium; }
.badge-popular { @apply bg-red-100 text-red-800; }
.badge-updated { @apply bg-blue-100 text-blue-800; }
.badge-new { @apply bg-green-100 text-green-800; }
</style>
