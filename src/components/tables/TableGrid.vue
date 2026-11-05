<template>
  <div
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4"
  >
    <TableCard
      v-for="(table, index) in tables"
      :key="table.id"
      :table="table"
      :sequential-number="index + 1"
      @click="onTableClick"
    />
  </div>
</template>

<script setup>
import TableCard from './TableCard.vue'

defineProps({
  tables: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['table-click'])

const onTableClick = (table) => {
  emit('table-click', table)
}
</script>
