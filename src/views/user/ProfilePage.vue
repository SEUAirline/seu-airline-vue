<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Toast 通知 -->
    <Toast 
      :message="toast.message" 
      :type="toast.type" 
      :show="toast.show"
      @update:show="toast.show = $event"
    />
    
    <!-- 顶部导航栏 -->
    <AppHeader />
    
    <!-- 主要内容区 -->
    <main class="container mx-auto px-4 py-6">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else class="flex flex-col md:flex-row gap-6">
        <!-- 左侧导航栏 -->
        <div class="md:w-64 lg:w-72 shrink-0">
          <div class="bg-white rounded-lg shadow-md p-5">
            <!-- 用户头像和基本信息 -->
            <div class="flex flex-col items-center mb-6">
              <div class="relative mb-3">
                <img
                  :src="userInfo.avatar || 'https://picsum.photos/100/100'"
                  alt="用户头像"
                  class="w-24 h-24 rounded-full object-cover border-2 border-primary"
                />
                <div class="absolute bottom-0 right-0 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <h3 class="text-lg font-medium">{{ userInfo.nickname || userInfo.username }}</h3>
              <p class="text-sm text-gray-500">{{ userInfo.level === 'gold' ? '金卡会员' : userInfo.level === 'silver' ? '银卡会员' : '普通会员' }}</p>
            </div>

            <!-- 侧边栏导航 -->
            <div class="space-y-2">
              <a
                href="#"
                :class="['flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-primary transition-all duration-200 rounded-lg', activeTab === 'info' ? 'bg-blue-50 text-primary font-medium' : '']"
                @click.prevent="activeTab = 'info'"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>个人信息</span>
              </a>
              <a
                href="#"
                :class="['flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-primary transition-all duration-200 rounded-lg', activeTab === 'security' ? 'bg-blue-50 text-primary font-medium' : '']"
                @click.prevent="activeTab = 'security'"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>账户安全</span>
              </a>
              <router-link
                to="/user/passengers"
                class="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-primary transition-all duration-200 rounded-lg"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>常用旅客</span>
              </router-link>
              <a
                href="#"
                :class="['flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-primary transition-all duration-200 rounded-lg', activeTab === 'favorites' ? 'bg-blue-50 text-primary font-medium' : '']"
                @click.prevent="activeTab = 'favorites'"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>我的收藏</span>
              </a>
              <router-link
                to="/user/settings"
                class="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-primary transition-all duration-200 rounded-lg"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>设置</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="flex-1">
          <!-- 个人信息标签页 -->
          <div v-if="activeTab === 'info'" class="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-medium">基本信息</h2>
              <button
                v-if="!isEditing"
                @click="startEdit"
                class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-all duration-300 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑资料
              </button>
            </div>
            
            <form @submit.prevent="handleSaveProfile">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input
                    v-model="profileForm.fullName"
                    type="text"
                    :disabled="!isEditing"
                    :class="[
                      'w-full px-4 py-2 border rounded-md transition-all',
                      isEditing 
                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    ]"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">身份证号</label>
                  <input
                    v-model="profileForm.idCard"
                    type="text"
                    :disabled="!isEditing"
                    :class="[
                      'w-full px-4 py-2 border rounded-md transition-all',
                      isEditing 
                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    ]"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                  <input
                    v-model="profileForm.phone"
                    type="tel"
                    :disabled="!isEditing"
                    :class="[
                      'w-full px-4 py-2 border rounded-md transition-all',
                      isEditing 
                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    ]"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    :disabled="!isEditing"
                    :class="[
                      'w-full px-4 py-2 border rounded-md transition-all',
                      isEditing 
                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    ]"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">性别</label>
                  <div class="flex items-center space-x-4 pt-1">
                    <label class="inline-flex items-center">
                      <input
                        v-model="profileForm.gender"
                        type="radio"
                        value="male"
                        :disabled="!isEditing"
                        class="text-primary focus:ring-primary"
                      />
                      <span class="ml-2">男</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input
                        v-model="profileForm.gender"
                        type="radio"
                        value="female"
                        :disabled="!isEditing"
                        class="text-primary focus:ring-primary"
                      />
                      <span class="ml-2">女</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">生日</label>
                  <input
                    v-model="profileForm.birthday"
                    type="date"
                    :disabled="!isEditing"
                    :class="[
                      'w-full px-4 py-2 border rounded-md transition-all',
                      isEditing 
                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    ]"
                  />
                </div>
              </div>
              
              <!-- 编辑模式下显示操作按钮 -->
              <div v-if="isEditing" class="flex justify-end gap-3">
                <button 
                  type="button" 
                  @click="cancelEdit"
                  class="bg-white text-gray-600 border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition-all duration-300"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-all duration-300"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>

          <!-- 账户安全标签页 -->
          <div v-if="activeTab === 'security'" class="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <h2 class="text-xl font-medium mb-4">账户安全</h2>
            <div class="space-y-4">
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <h3 class="font-medium">登录密码</h3>
                  <p class="text-sm text-gray-500 mt-1">定期修改密码可提高账户安全性</p>
                </div>
                <button class="bg-white text-primary border border-primary px-4 py-2 rounded-md hover:bg-gray-50 transition-all duration-300">修改密码</button>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <h3 class="font-medium">手机验证</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ userInfo.phone || '未绑定' }}</p>
                </div>
                <button class="text-primary font-medium">
                  <svg class="w-5 h-5 inline text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  已验证
                </button>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <h3 class="font-medium">邮箱验证</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ userInfo.email || '未绑定' }}</p>
                </div>
                <button class="text-primary font-medium">
                  <svg class="w-5 h-5 inline text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  已验证
                </button>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <h3 class="font-medium">实名认证</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ userInfo.fullName || '未认证' }}{{ userInfo.idCard ? '，' + userInfo.idCard : '' }}</p>
                </div>
                <button class="text-primary font-medium">
                  <svg class="w-5 h-5 inline text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  已认证
                </button>
              </div>
              <div class="flex justify-between items-center py-3">
                <div>
                  <h3 class="font-medium">支付密码</h3>
                  <p class="text-sm text-gray-500 mt-1">设置支付密码保护您的资金安全</p>
                </div>
                <button class="bg-white text-primary border border-primary px-4 py-2 rounded-md hover:bg-gray-50 transition-all duration-300">立即设置</button>
              </div>
            </div>
          </div>

          <!-- 我的收藏标签页 -->
          <div v-if="activeTab === 'favorites'" class="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <h2 class="text-xl font-medium mb-4">我的收藏</h2>
            <div class="text-center py-12 text-gray-500">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p>暂无收藏</p>
            </div>
          </div>

          <!-- 快捷入口 -->
          <div v-if="activeTab === 'info'" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <router-link
            to="/user/orders"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span v-if="orderStats.total > 0" class="text-2xl font-bold text-gray-900">{{ orderStats.total }}</span>
            </div>
            <div class="text-gray-600 font-medium">我的订单</div>
          </router-link>

          <router-link
            to="/user/passengers"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="text-gray-600 font-medium">常用旅客</div>
          </router-link>

          <router-link
            to="/user/messages"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <span v-if="unreadCount > 0" class="text-2xl font-bold text-gray-900">{{ unreadCount }}</span>
            </div>
            <div class="text-gray-600 font-medium">消息中心</div>
          </router-link>

          <router-link
            to="/user/settings"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div class="text-gray-600 font-medium">账号设置</div>
          </router-link>
          </div>

          <!-- 订单统计 -->
          <div v-if="activeTab === 'info'" class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">订单统计</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-orange-600 mb-1">{{ orderStats.pending }}</div>
              <div class="text-sm text-gray-600">待支付</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600 mb-1">{{ orderStats.paid }}</div>
              <div class="text-sm text-gray-600">已支付</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600 mb-1">{{ orderStats.completed }}</div>
              <div class="text-sm text-gray-600">已完成</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-gray-600 mb-1">{{ orderStats.cancelled }}</div>
              <div class="text-sm text-gray-600">已取消</div>
            </div>
          </div>
        </div>

          <!-- 最近订单 -->
          <div v-if="activeTab === 'info'" class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">最近订单</h3>
            <router-link to="/user/orders" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看全部 →
            </router-link>
          </div>

          <div v-if="recentOrders.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>暂无订单</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
              @click="router.push(`/orders/${order.id}`)"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-medium text-gray-900">订单号: {{ order.orderNumber }}</span>
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      order.status === 'paid' ? 'bg-green-100 text-green-700' :
                      order.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    ]"
                  >
                    {{ getOrderStatusText(order.status) }}
                  </span>
                </div>
                <span class="text-lg font-bold text-blue-600">¥{{ order.totalAmount }}</span>
              </div>
              <div class="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <span class="font-medium">{{ order.departureCity }}</span>
                  <svg class="w-4 h-4 inline mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span class="font-medium">{{ order.arrivalCity }}</span>
                  <span class="mx-2">|</span>
                  <span>{{ order.flightNo }}</span>
                </div>
                <span>{{ order.createTime }}</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '@/api/client'
import { orderApi } from '@/api/order'
import { useUserStore } from '@/stores/user'
import AppHeader from '@/components/AppHeader.vue'
import Toast from '@/components/Toast.vue'

const router = useRouter()
const userStore = useUserStore()

// 状态
const loading = ref(true)
const activeTab = ref('info') // 当前激活的标签页
const isEditing = ref(false) // 是否处于编辑模式
const userInfo = ref<any>({})
const orderStats = ref({
  total: 0,
  pending: 0,
  paid: 0,
  completed: 0,
  cancelled: 0
})
const recentOrders = ref<any[]>([])
const unreadCount = ref(0)

// Toast 通知状态
const toast = ref({
  show: false,
  message: '',
  type: 'info' as 'success' | 'error' | 'warning' | 'info'
})

// 显示提示消息
const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  toast.value = {
    show: true,
    message,
    type
  }
}

// 个人信息表单
const profileForm = ref({
  fullName: '',
  idCard: '',
  phone: '',
  email: '',
  gender: 'male',
  birthday: ''
})

// 原始数据备份（用于取消编辑时恢复）
const originalData = ref({
  fullName: '',
  idCard: '',
  phone: '',
  email: '',
  gender: 'male',
  birthday: ''
})

// 开始编辑
const startEdit = () => {
  isEditing.value = true
  // 备份当前数据
  originalData.value = { ...profileForm.value }
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  // 恢复原始数据
  profileForm.value = { ...originalData.value }
  showToast('已取消修改', 'info')
}

// 获取订单状态文本
const getOrderStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': '待支付',
    'paid': '已支付',
    'completed': '已完成',
    'cancelled': '已取消',
    'refunded': '已退款'
  }
  return statusMap[status] || '未知'
}

// 加载用户信息
const loadUserInfo = async () => {
  try {
    // 优先从 store 获取用户信息
    const storeUser = userStore.currentUser
    if (storeUser) {
      userInfo.value = storeUser
      // 填充表单
      const formData = {
        fullName: storeUser.fullName || '',
        idCard: storeUser.idCard || '',
        phone: storeUser.phone || '',
        email: storeUser.email || '',
        gender: (storeUser as any).gender || 'male',
        birthday: (storeUser as any).birthday || ''
      }
      profileForm.value = formData
      // 同时备份原始数据
      originalData.value = { ...formData }
      return
    }

    // 如果 store 中没有，才从 API 获取（这种情况应该很少发生）
    console.log('Store中没有用户信息，从API获取')
    const response = await request.get('/user/profile')
    if (response.success) {
      userInfo.value = response.data
      // 更新 store
      userStore.updateUser(response.data)
      // 填充表单
      const formData = {
        fullName: response.data.fullName || '',
        idCard: response.data.idCard || '',
        phone: response.data.phone || '',
        email: response.data.email || '',
        gender: response.data.gender || 'male',
        birthday: response.data.birthday || ''
      }
      profileForm.value = formData
      // 同时备份原始数据
      originalData.value = { ...formData }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 保存个人信息
const handleSaveProfile = async () => {
  try {
    const response = await request.put('/user/profile', profileForm.value)
    if (response.success) {
      // 使用后端返回的完整用户信息更新 store
      if (response.data) {
        userStore.updateUser(response.data)
        userInfo.value = response.data
      }
      isEditing.value = false // 退出编辑模式
      showToast('个人信息保存成功', 'success')
    } else {
      showToast(response.message || '保存失败', 'error')
    }
  } catch (error: any) {
    console.error('保存个人信息失败:', error)
    showToast(error.response?.data?.message || error.message || '网络错误', 'error')
  }
}

// 加载订单统计
const loadOrderStats = async () => {
  try {
    const response = await orderApi.getUserOrders()
    if (response.success) {
      const orders = response.data || []
      orderStats.value = {
        total: orders.length,
        pending: orders.filter((o: any) => o.status === 'pending').length,
        paid: orders.filter((o: any) => o.status === 'paid').length,
        completed: orders.filter((o: any) => o.status === 'completed').length,
        cancelled: orders.filter((o: any) => o.status === 'cancelled').length
      }
      // 获取最近3个订单
      recentOrders.value = orders.slice(0, 3)
    }
  } catch (error) {
    console.error('加载订单统计失败:', error)
  }
}

// 加载未读消息数
const loadUnreadCount = async () => {
  try {
    // 检查是否已登录
    const token = localStorage.getItem('token')
    if (!token) {
      unreadCount.value = 0
      return
    }
    
    const response = await request.get('/messages/unread-count')
    if (response.success) {
      unreadCount.value = response.data || 0
    }
  } catch (error) {
    console.error('加载未读消息数失败:', error)
    unreadCount.value = 0
  }
}

// 初始化
onMounted(async () => {
  await Promise.all([
    loadUserInfo(),
    loadOrderStats(),
    loadUnreadCount()
  ])
  loading.value = false
})
</script>
