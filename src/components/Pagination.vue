<template>
  <div class="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow-md">
    <!-- 移动端简化版 -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="handlePrevious"
        :disabled="currentPage === 1"
        :class="[
          'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        ]"
      >
        上一页
      </button>
      <button
        @click="handleNext"
        :disabled="currentPage === totalPages"
        :class="[
          'relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        ]"
      >
        下一页
      </button>
    </div>

    <!-- 桌面端完整版 -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <!-- 信息显示 -->
      <div>
        <p class="text-sm text-gray-700">
          显示第
          <span class="font-medium">{{ startItem }}</span>
          到
          <span class="font-medium">{{ endItem }}</span>
          条，共
          <span class="font-medium">{{ total }}</span>
          条结果
        </p>
      </div>

      <!-- 分页按钮 -->
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- 上一页 -->
          <button
            @click="handlePrevious"
            :disabled="currentPage === 1"
            :class="[
              'relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
              currentPage === 1 ? 'cursor-not-allowed' : 'hover:text-gray-500'
            ]"
          >
            <span class="sr-only">上一页</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- 页码按钮 -->
          <button
            v-for="page in displayPages"
            :key="page"
            @click="handlePageChange(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
              page === currentPage
                ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            ]"
          >
            {{ page }}
          </button>

          <!-- 下一页 -->
          <button
            @click="handleNext"
            :disabled="currentPage === totalPages"
            :class="[
              'relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
              currentPage === totalPages ? 'cursor-not-allowed' : 'hover:text-gray-500'
            ]"
          >
            <span class="sr-only">下一页</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  pageSize: number
  total: number
  maxPages?: number // 最多显示多少个页码按钮
}

const props = withDefaults(defineProps<Props>(), {
  maxPages: 7
})

const emit = defineEmits<{
  pageChange: [page: number]
}>()

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize)
})

// 计算当前页起始项
const startItem = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1
})

// 计算当前页结束项
const endItem = computed(() => {
  const end = props.currentPage * props.pageSize
  return end > props.total ? props.total : end
})

// 计算要显示的页码
const displayPages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = props.currentPage
  const max = props.maxPages

  if (total <= max) {
    // 总页数小于最大显示数，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于最大显示数，需要计算显示哪些页码
    const half = Math.floor(max / 2)
    let start = current - half
    let end = current + half

    if (start < 1) {
      start = 1
      end = max
    }

    if (end > total) {
      end = total
      start = total - max + 1
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})

// 处理页码变化
function handlePageChange(page: number) {
  if (page !== props.currentPage && page >= 1 && page <= totalPages.value) {
    emit('pageChange', page)
  }
}

// 上一页
function handlePrevious() {
  if (props.currentPage > 1) {
    emit('pageChange', props.currentPage - 1)
  }
}

// 下一页
function handleNext() {
  if (props.currentPage < totalPages.value) {
    emit('pageChange', props.currentPage + 1)
  }
}
</script>
