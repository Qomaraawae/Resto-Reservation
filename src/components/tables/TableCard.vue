<template>
  <div
    :class="[
      'relative rounded-xl shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
      statusColor,
    ]"
    @click="$emit('click', table)"
  >
    <div class="p-4 sm:p-5 text-center">
      <div class="text-3xl sm:text-4xl mb-2">🪑</div>
      <h3
        class="text-xl sm:text-2xl font-semibold mb-1"
        :class="status === 'available' ? 'text-secondary-800 dark:text-white' : 'text-white'"
      >
        {{ sequentialNumber }}
      </h3>
      <p
        class="text-xs sm:text-sm"
        :class="
          status === 'available' ? 'text-secondary-500 dark:text-secondary-400' : 'text-white/80'
        "
      >
        Kapasitas: {{ table.capacity }} org
      </p>
      <span
        :class="[
          'inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium',
          status === 'available'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : status === 'reserved'
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              : status === 'occupied'
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-400',
        ]"
      >
        {{ statusText }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  table: {
    type: Object,
    required: true,
  },
  sequentialNumber: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['click'])

const status = computed(() => props.table.status)

const statusText = computed(() => {
  const texts = {
    available: 'Tersedia',
    reserved: 'Dipesan',
    occupied: 'Terisi',
    cleaning: 'Dibersihkan',
  }
  return texts[status.value] || status.value
})

const statusColor = computed(() => {
  const colors = {
    available:
      'bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700 hover:border-green-300 dark:hover:border-green-700',
    reserved: 'bg-yellow-500 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-700',
    occupied: 'bg-orange-500 dark:bg-orange-600 border-orange-600 dark:border-orange-700',
    cleaning:
      'bg-secondary-400 dark:bg-secondary-600 border-secondary-500 dark:border-secondary-700',
  }
  return colors[status.value] || 'bg-white dark:bg-secondary-800'
})
</script>
