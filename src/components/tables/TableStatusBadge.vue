<template>
  <span
    :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', badgeColor]"
  >
    <span class="w-1.5 h-1.5 rounded-full mr-1" :class="dotColor"></span>
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['available', 'reserved', 'occupied', 'cleaning'].includes(value),
  },
})

const statusText = computed(() => {
  const texts = {
    available: 'Tersedia',
    reserved: 'Dipesan',
    occupied: 'Terisi',
    cleaning: 'Dibersihkan',
  }
  return texts[props.status] || props.status
})

const badgeColor = computed(() => {
  const colors = {
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    occupied: 'bg-red-100 text-red-800',
    cleaning: 'bg-gray-100 text-gray-800',
  }
  return colors[props.status] || 'bg-gray-100 text-gray-800'
})

const dotColor = computed(() => {
  const colors = {
    available: 'bg-green-500',
    reserved: 'bg-yellow-500',
    occupied: 'bg-red-500',
    cleaning: 'bg-gray-500',
  }
  return colors[props.status] || 'bg-gray-500'
})
</script>
