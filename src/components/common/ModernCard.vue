<template>
  <div
    class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    :class="[clickable ? 'cursor-pointer' : '', customClass]"
    @click="clickable ? $emit('click') : null"
  >
    <div
      class="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/10 group-hover:to-blue-500/5 transition-all duration-500"
    ></div>

    <div class="relative" :class="customClass.includes('p-0') ? '' : 'p-4 sm:p-6'">
      <slot></slot>
    </div>

    <div
      class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  clickable: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: '',
  },
})

defineEmits(['click'])
</script>
