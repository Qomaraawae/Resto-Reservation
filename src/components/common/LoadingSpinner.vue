<template>
  <div
    :class="[
      'flex items-center justify-center',
      fullScreen ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : '',
    ]"
  >
    <div class="flex flex-col items-center">
      <div
        :class="[
          'animate-spin rounded-full border-4 border-gray-200',
          size === 'sm'
            ? 'h-6 w-6 border-t-2'
            : size === 'lg'
              ? 'h-12 w-12 border-t-4'
              : 'h-8 w-8 border-t-4',
          `border-t-${color}-500`,
        ]"
      ></div>
      <p v-if="text" class="mt-2 text-gray-600">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  color: {
    type: String,
    default: 'blue',
  },
  text: {
    type: String,
    default: '',
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
})
</script>
