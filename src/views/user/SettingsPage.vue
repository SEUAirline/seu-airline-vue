<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <AppHeader />
    
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- 页面标题 -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">账号设置</h1>
          <p class="text-gray-600 mt-1">管理您的个人信息和账号安全</p>
        </div>

        <!-- 标签页 -->
        <div class="bg-white rounded-lg shadow-md mb-6">
          <div class="flex border-b border-gray-200">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="currentTab = tab.value"
              :class="[
                'flex-1 py-4 px-6 text-center font-medium transition-colors',
                currentTab === tab.value
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- 基本信息 -->
        <div v-if="currentTab === 'profile'" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">基本信息</h2>
          
          <form @submit.prevent="saveProfile" class="space-y-6">
            <!-- 头像 -->
            <div class="flex items-center space-x-6">
              <img
                :src="profileForm.avatar"
                alt="头像"
                class="w-20 h-20 rounded-full border-2 border-gray-200"
              />
              <div>
                <button
                  type="button"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  更换头像
                </button>
                <p class="text-xs text-gray-500 mt-2">支持 JPG、PNG 格式，大小不超过 2MB</p>
              </div>
            </div>

            <!-- 昵称 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">昵称</label>
              <input
                v-model="profileForm.nickname"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入昵称"
              />
            </div>

            <!-- 性别 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">性别</label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="profileForm.gender"
                    type="radio"
                    value="male"
                    class="mr-2"
                  />
                  <span>男</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="profileForm.gender"
                    type="radio"
                    value="female"
                    class="mr-2"
                  />
                  <span>女</span>
                </label>
              </div>
            </div>

            <!-- 生日 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">生日</label>
              <input
                v-model="profileForm.birthday"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- 手机号 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">手机号</label>
              <input
                v-model="profileForm.phone"
                type="tel"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入手机号"
              />
            </div>

            <!-- 邮箱 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入邮箱"
              />
            </div>

            <!-- 按钮 -->
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="loadUserInfo"
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

        <!-- 修改密码 -->
        <div v-if="currentTab === 'password'" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">修改密码</h2>
          
          <form @submit.prevent="changePassword" class="space-y-6 max-w-md">
            <!-- 当前密码 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
              <input
                v-model="passwordForm.oldPassword"
                type="password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入当前密码"
              />
            </div>

            <!-- 新密码 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">新密码</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入新密码（6-20位）"
              />
            </div>

            <!-- 确认密码 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请再次输入新密码"
              />
            </div>

            <!-- 按钮 -->
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="resetPasswordForm"
                class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {{ saving ? '修改中...' : '确认修改' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { request } from '@/api/client'
import AppHeader from '@/components/AppHeader.vue'

// 状态
const currentTab = ref('profile')
const saving = ref(false)

// 标签页配置
const tabs = [
  { label: '基本信息', value: 'profile' },
  { label: '修改密码', value: 'password' }
]

// 表单数据
const profileForm = ref({
  nickname: '',
  avatar: '',
  gender: 'male',
  birthday: '',
  phone: '',
  email: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const response = await request.get('/user/profile')
    if (response.success) {
      profileForm.value = {
        nickname: response.data.nickname || '',
        avatar: response.data.avatar || '',
        gender: response.data.gender || 'male',
        birthday: response.data.birthday || '',
        phone: response.data.phone || '',
        email: response.data.email || ''
      }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 保存个人信息
const saveProfile = async () => {
  saving.value = true
  try {
    const response = await request.put('/user/profile', profileForm.value)
    if (response.success) {
      alert('保存成功')
    } else {
      alert(response.message || '保存失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

// 修改密码
const changePassword = async () => {
  // 验证
  if (!passwordForm.value.oldPassword) {
    alert('请输入当前密码')
    return
  }
  if (!passwordForm.value.newPassword) {
    alert('请输入新密码')
    return
  }
  if (passwordForm.value.newPassword.length < 6 || passwordForm.value.newPassword.length > 20) {
    alert('密码长度应为6-20位')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }

  saving.value = true
  try {
    const response = await request.put('/user/password', {
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    if (response.success) {
      alert('密码修改成功，请重新登录')
      resetPasswordForm()
    } else {
      alert(response.message || '修改失败')
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    alert('修改失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

// 初始化
onMounted(() => {
  loadUserInfo()
})
</script>
