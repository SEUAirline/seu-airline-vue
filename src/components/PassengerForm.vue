<template>
  <div class="passenger-form">
    <!-- 表单头部 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <h3 class="text-lg font-semibold text-gray-900">
          乘客 {{ index + 1 }}
          <span v-if="passenger.passengerType === 'child'" class="text-sm text-blue-600 ml-2"
            >(儿童)</span
          >
          <span v-if="passenger.passengerType === 'infant'" class="text-sm text-green-600 ml-2"
            >(婴儿)</span
          >
        </h3>
      </div>
      <button
        v-if="showDelete"
        @click="$emit('delete')"
        type="button"
        class="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
      >
        删除
      </button>
    </div>

    <div class="space-y-4">
      <!-- 第一行: 姓名 + 证件类型 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            姓名 <span class="text-red-500">*</span>
          </label>
          <input
            :value="passenger.name"
            @input="updateField('name', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="请输入乘客姓名"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
              errors.name ? 'border-red-500' : 'border-gray-300'
            ]"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-500">
            {{ errors.name }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            证件类型 <span class="text-red-500">*</span>
          </label>
          <select
            :value="passenger.idType"
            @change="updateField('idType', ($event.target as HTMLSelectElement).value)"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
              errors.idType ? 'border-red-500' : 'border-gray-300'
            ]"
          >
            <option value="idCard">身份证</option>
            <option value="passport">护照</option>
            <option value="other">其他</option>
          </select>
          <p v-if="errors.idType" class="mt-1 text-sm text-red-500">
            {{ errors.idType }}
          </p>
        </div>
      </div>

      <!-- 第二行: 证件号码 + 手机号 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            证件号码 <span class="text-red-500">*</span>
          </label>
          <input
            :value="passenger.idCard"
            @input="updateField('idCard', ($event.target as HTMLInputElement).value)"
            type="text"
            :placeholder="getIdCardPlaceholder"
            :maxlength="passenger.idType === 'idCard' ? 18 : 30"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
              errors.idCard ? 'border-red-500' : 'border-gray-300'
            ]"
          />
          <p v-if="errors.idCard" class="mt-1 text-sm text-red-500">
            {{ errors.idCard }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            手机号 <span class="text-red-500">*</span>
          </label>
          <input
            :value="passenger.phone"
            @input="updateField('phone', ($event.target as HTMLInputElement).value)"
            type="tel"
            placeholder="请输入手机号"
            maxlength="11"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
              errors.phone ? 'border-red-500' : 'border-gray-300'
            ]"
          />
          <p v-if="errors.phone" class="mt-1 text-sm text-red-500">
            {{ errors.phone }}
          </p>
        </div>
      </div>

      <!-- 第三行: 乘客类型 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          乘客类型 <span class="text-red-500">*</span>
        </label>
        <div class="flex gap-4">
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              :name="`passengerType-${index}`"
              value="adult"
              :checked="passenger.passengerType === 'adult'"
              @change="updateField('passengerType', 'adult')"
              class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">成人 (12岁以上)</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              :name="`passengerType-${index}`"
              value="child"
              :checked="passenger.passengerType === 'child'"
              @change="updateField('passengerType', 'child')"
              class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">儿童 (2-12岁)</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              :name="`passengerType-${index}`"
              value="infant"
              :checked="passenger.passengerType === 'infant'"
              @change="updateField('passengerType', 'infant')"
              class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">婴儿 (0-2岁)</span>
          </label>
        </div>
        <p v-if="errors.passengerType" class="mt-1 text-sm text-red-500">
          {{ errors.passengerType }}
        </p>
      </div>

      <!-- 常用乘客快速选择 (可选功能) -->
      <div v-if="showFrequentPassengers && frequentPassengers.length > 0" class="pt-2">
        <button
          @click="showFrequentList = !showFrequentList"
          type="button"
          class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {{ showFrequentList ? '隐藏' : '从常用乘客中选择' }}
        </button>
        <div v-if="showFrequentList" class="mt-3 space-y-2">
          <div
            v-for="fp in frequentPassengers"
            :key="fp.id"
            @click="fillFromFrequent(fp)"
            class="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="font-medium text-gray-900">{{ fp.name }}</span>
                <span class="ml-3 text-sm text-gray-600">{{ fp.idCard }}</span>
              </div>
              <svg
                class="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 类型定义
interface Passenger {
  name: string
  idType: 'idCard' | 'passport' | 'other'
  idCard: string
  phone: string
  passengerType: 'adult' | 'child' | 'infant'
}

interface FrequentPassenger {
  id: string
  name: string
  idCard: string
  phone: string
  idType: 'idCard' | 'passport' | 'other'
}

interface Props {
  passenger: Passenger
  index: number
  errors?: Record<string, string>
  showDelete?: boolean
  showFrequentPassengers?: boolean
  frequentPassengers?: FrequentPassenger[]
}

// Props
const props = withDefaults(defineProps<Props>(), {
  errors: () => ({}),
  showDelete: false,
  showFrequentPassengers: false,
  frequentPassengers: () => []
})

// Emits
const emit = defineEmits<{
  update: [field: keyof Passenger, value: string]
  delete: []
}>()

// 状态
const showFrequentList = ref(false)

// 计算属性
const getIdCardPlaceholder = computed(() => {
  const placeholders = {
    idCard: '请输入18位身份证号',
    passport: '请输入护照号码',
    other: '请输入证件号码'
  }
  return placeholders[props.passenger.idType]
})

// 方法
const updateField = (field: keyof Passenger, value: string) => {
  emit('update', field, value)
}

const fillFromFrequent = (fp: FrequentPassenger) => {
  emit('update', 'name', fp.name)
  emit('update', 'idCard', fp.idCard)
  emit('update', 'phone', fp.phone)
  emit('update', 'idType', fp.idType)
  showFrequentList.value = false
}
</script>

<style scoped>
/* 可以添加一些自定义样式 */
.passenger-form {
  @apply bg-white rounded-lg border border-gray-200 p-6;
}
</style>
