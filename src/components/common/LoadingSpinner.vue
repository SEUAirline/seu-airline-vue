<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="spinner border-primary"
      :style="{ width: size + 'px', height: size + 'px' }"
    ></div>
    <span v-if="text" class="ml-3 text-gray-600">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: number
  text?: string
  containerClass?: string
}

withDefaults(defineProps<Props>(), {
  size: 32,
  text: '',
  containerClass: 'py-8'
})
</script>
