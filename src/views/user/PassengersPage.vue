<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <AppHeader />
    
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- 页面标题 -->
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">常用旅客</h1>
            <p class="text-gray-600 mt-1">管理您的常用旅客信息，预订时可快速选择</p>
          </div>
          <button
            @click="showAddModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 添加旅客
          </button>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- 旅客列表 -->
        <div v-else-if="passengers.length > 0" class="space-y-4">
          <div
            v-for="passenger in passengers"
            :key="passenger.id"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-3">
                  <h3 class="text-lg font-semibold text-gray-900">{{ passenger.name }}</h3>
                  <span
                    v-if="passenger.isDefault"
                    class="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                  >
                    默认
                  </span>
                  <span class="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
                    {{ getPassengerTypeText(passenger.passengerType) }}
                  </span>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span class="text-gray-500">证件类型:</span>
                    <span class="ml-2">{{ getIdTypeText(passenger.idType) }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">证件号码:</span>
                    <span class="ml-2">{{ passenger.idNumber }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">手机号:</span>
                    <span class="ml-2">{{ passenger.phone }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">邮箱:</span>
                    <span class="ml-2">{{ passenger.email }}</span>
                  </div>
                </div>
              </div>

              <div class="ml-6 flex flex-col space-y-2">
                <button
                  @click="editPassenger(passenger)"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  编辑
                </button>
                <button
                  v-if="!passenger.isDefault"
                  @click="deletePassenger(passenger)"
                  class="px-4 py-2 text-red-600 hover:text-red-700 text-sm"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无常用旅客</h3>
          <p class="text-gray-600 mb-6">添加常用旅客，预订时可快速填写信息</p>
          <button
            @click="showAddModal = true"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            添加旅客
          </button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑旅客弹窗 -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingPassenger ? '编辑旅客' : '添加旅客' }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="savePassenger" class="p-6 space-y-4">
          <!-- 姓名 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
            <input
              v-model="passengerForm.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入姓名"
            />
          </div>

          <!-- 证件类型 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">证件类型 *</label>
            <select
              v-model="passengerForm.idType"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ID_CARD">身份证</option>
              <option value="PASSPORT">护照</option>
              <option value="OTHER">其他</option>
            </select>
          </div>

          <!-- 证件号码 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">证件号码 *</label>
            <input
              v-model="passengerForm.idNumber"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入证件号码"
            />
          </div>

          <!-- 旅客类型 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">旅客类型 *</label>
            <select
              v-model="passengerForm.passengerType"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="adult">成人</option>
              <option value="child">儿童</option>
              <option value="infant">婴儿</option>
            </select>
          </div>

          <!-- 手机号 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">手机号 *</label>
            <input
              v-model="passengerForm.phone"
              type="tel"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入手机号"
            />
          </div>

          <!-- 邮箱 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
            <input
              v-model="passengerForm.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入邮箱（选填）"
            />
          </div>

          <!-- 设为默认 -->
          <div class="flex items-center">
            <input
              v-model="passengerForm.isDefault"
              type="checkbox"
              id="isDefault"
              class="mr-2"
            />
            <label for="isDefault" class="text-sm text-gray-700">设为默认旅客</label>
          </div>

          <!-- 按钮 -->
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { request } from '@/api/client'
import AppHeader from '@/components/AppHeader.vue'

// 状态
const loading = ref(true)
const saving = ref(false)
const showAddModal = ref(false)
const editingPassenger = ref<any>(null)
const passengers = ref<any[]>([])

// 表单数据
const passengerForm = ref({
  name: '',
  idType: 'ID_CARD',
  idNumber: '',
  phone: '',
  email: '',
  passengerType: 'adult',
  isDefault: false
})

// 获取证件类型文本
const getIdTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    ID_CARD: '身份证',
    PASSPORT: '护照',
    OTHER: '其他'
  }
  return typeMap[type] || type
}

// 获取旅客类型文本
const getPassengerTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    adult: '成人',
    child: '儿童',
    infant: '婴儿',
    ADULT: '成人',
    CHILD: '儿童',
    INFANT: '婴儿'
  }
  return typeMap[type] || type
}

// 加载旅客列表
const loadPassengers = async () => {
  loading.value = true
  try {
    const response = await request.get('/passengers')
    if (response.success) {
      // 转换后端数据格式为前端期望的格式
      passengers.value = (response.data || []).map((passenger: any) => ({
        id: passenger.id,
        name: passenger.passengerName,
        idType: passenger.idType,
        idNumber: passenger.idCard,
        phone: passenger.phone,
        email: passenger.email,
        passengerType: passenger.passengerType?.toLowerCase() || 'adult',
        isDefault: passenger.isDefault
      }))
    }
  } catch (error) {
    console.error('加载旅客列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 编辑旅客
const editPassenger = (passenger: any) => {
  editingPassenger.value = passenger
  passengerForm.value = {
    name: passenger.name,
    idType: passenger.idType,
    idNumber: passenger.idNumber,
    phone: passenger.phone,
    email: passenger.email || '',
    passengerType: passenger.passengerType,
    isDefault: passenger.isDefault
  }
  showAddModal.value = true
}

// 保存旅客
const savePassenger = async () => {
  saving.value = true
  try {
    // 转换前端表单数据为后端期望的格式
    const backendData = {
      passengerName: passengerForm.value.name,
      idType: passengerForm.value.idType,
      idCard: passengerForm.value.idNumber,
      phone: passengerForm.value.phone,
      email: passengerForm.value.email || null,
      passengerType: passengerForm.value.passengerType.toUpperCase(),
      isDefault: passengerForm.value.isDefault
    }

    let response
    if (editingPassenger.value) {
      // 更新
      response = await request.put(`/passengers/${editingPassenger.value.id}`, backendData)
    } else {
      // 新增
      response = await request.post('/passengers', backendData)
    }

    if (response.success) {
      // 保存成功，直接关闭并刷新列表
      closeModal()
      loadPassengers()
    }
    // 失败静默处理
  } catch (error) {
    console.error('保存旅客失败:', error)
    // 静默处理错误
  } finally {
    saving.value = false
  }
}

// 删除旅客
const deletePassenger = async (passenger: any) => {
  // 直接删除，不需要确认（可以通过撤销来恢复）
  try {
    const response = await request.delete(`/passengers/${passenger.id}`)
    if (response.success) {
      // 删除成功，刷新列表
      loadPassengers()
    }
    // 失败静默处理
  } catch (error) {
    console.error('删除旅客失败:', error)
    // 静默处理错误
  }
}

// 关闭弹窗
const closeModal = () => {
  showAddModal.value = false
  editingPassenger.value = null
  passengerForm.value = {
    name: '',
    idType: 'ID_CARD',
    idNumber: '',
    phone: '',
    email: '',
    passengerType: 'adult',
    isDefault: false
  }
}

// 初始化
onMounted(() => {
  loadPassengers()
})
</script>
