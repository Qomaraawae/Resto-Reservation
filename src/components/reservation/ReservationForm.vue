<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-secondary-800 rounded-2xl max-w-md w-full shadow-xl">
      <div class="border-b border-secondary-200 dark:border-secondary-700 p-6">
        <div class="flex justify-between items-center">
          <div>
            <div class="text-3xl mb-1">🪑</div>
            <h2 class="text-xl font-semibold text-secondary-900 dark:text-white">
              Reservasi Meja {{ sequentialNumber }}
            </h2>
            <p class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              Kapasitas {{ selectedTable?.capacity }} orang
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-secondary-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-secondary-700 dark:text-secondary-300 mb-2 text-sm font-medium"
            >Nama Pelanggan</label
          >
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full border border-secondary-300 dark:border-secondary-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 dark:bg-secondary-700 dark:text-white transition"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div>
          <label class="block text-secondary-700 dark:text-secondary-300 mb-2 text-sm font-medium"
            >Nomor Telepon</label
          >
          <input
            v-model="form.phone"
            type="tel"
            required
            class="w-full border border-secondary-300 dark:border-secondary-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 dark:bg-secondary-700 dark:text-white transition"
            placeholder="08123456789"
          />
        </div>

        <div>
          <label class="block text-secondary-700 dark:text-secondary-300 mb-2 text-sm font-medium"
            >Jumlah Orang</label
          >
          <input
            v-model.number="form.numberOfPeople"
            type="number"
            min="1"
            :max="selectedTable?.capacity"
            required
            class="w-full border border-secondary-300 dark:border-secondary-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 dark:bg-secondary-700 dark:text-white transition"
          />
          <p
            v-if="form.numberOfPeople > selectedTable?.capacity"
            class="text-red-500 text-sm mt-1 flex items-center gap-1"
          >
            Meja hanya muat {{ selectedTable?.capacity }} orang!
          </p>
          <p v-else class="text-secondary-500 dark:text-secondary-400 text-sm mt-1">
            Kapasitas meja: {{ selectedTable?.capacity }} orang
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-secondary-700 dark:text-secondary-300 mb-2 text-sm font-medium"
              >Tanggal</label
            >
            <input
              v-model="form.date"
              type="date"
              required
              :min="today"
              class="w-full border border-secondary-300 dark:border-secondary-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 dark:bg-secondary-700 dark:text-white transition"
            />
          </div>

          <div>
            <label class="block text-secondary-700 dark:text-secondary-300 mb-2 text-sm font-medium"
              >Jam</label
            >
            <select
              v-model="form.time"
              required
              class="w-full border border-secondary-300 dark:border-secondary-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 dark:bg-secondary-700 dark:text-white transition"
            >
              <option value="">Pilih jam</option>
              <option v-for="hour in businessHours" :key="hour" :value="hour">
                {{ hour }}:00 WIB
              </option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            :disabled="form.numberOfPeople > selectedTable?.capacity"
            class="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg transition disabled:opacity-50 font-medium"
          >
            Konfirmasi Reservasi
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 bg-secondary-200 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-200 py-2.5 rounded-lg hover:bg-secondary-300 dark:hover:bg-secondary-600 transition font-medium"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  selectedTable: {
    type: Object,
    required: true,
  },
  sequentialNumber: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['submit', 'close'])

const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

const businessHours = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21']

const form = ref({
  name: '',
  phone: '',
  numberOfPeople: 1,
  date: today.value,
  time: '',
})

const handleSubmit = () => {
  emit('submit', {
    ...form.value,
    tableId: props.selectedTable.id,
    tableNumber: props.selectedTable.number,
  })
}
</script>
