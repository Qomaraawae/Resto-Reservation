<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <header
      class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
          Dashboard Restoran
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola reservasi dan pesanan dengan mudah
        </p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5"
        >
          <p class="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
            Total Meja
          </p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {{ tablesStore.tables.length }}
          </p>
        </div>
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5"
        >
          <p class="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
            Tersedia
          </p>
          <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-500 mt-2">
            {{ availableCount }}
          </p>
        </div>
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5"
        >
          <p class="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
            Dipesan
          </p>
          <p class="text-3xl font-bold text-amber-600 dark:text-amber-500 mt-2">
            {{ reservedCount }}
          </p>
        </div>
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5"
        >
          <p class="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
            Terisi
          </p>
          <p class="text-3xl font-bold text-orange-600 dark:text-orange-500 mt-2">
            {{ occupiedCount }}
          </p>
        </div>
      </div>

      <!-- Table Grid Section -->
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        <div
          class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">Layout Meja</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Klik meja untuk reservasi atau reset status
            </p>
          </div>
          <button
            @click="resetAllTables"
            class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
          Reset
          </button>
        </div>

        <div class="p-5">
          <div v-if="tablesStore.loading" class="text-center py-12">
            <div
              class="inline-block animate-spin rounded-full h-7 w-7 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300"
            ></div>
            <p class="text-gray-500 dark:text-gray-400 mt-3 text-sm">Memuat data meja...</p>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div
              v-for="(table, index) in tablesStore.tables"
              :key="table.id"
              class="relative group"
            >
              <div
                :class="[
                  'rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-sm',
                  getTableCardClass(table.status),
                ]"
                @click="openReservationForm(table)"
              >
                <div class="p-4 text-center">
                  <div class="text-2xl mb-2">🪑</div>
                  
                  <!-- Nomor Urut Meja -->
                  <h3
  class="text-base font-semibold mb-1"
  :class="
    table.status === 'available' ? 'text-gray-800 dark:text-white' : 'text-white'
  "
>
  {{ table.number }}
</h3>


                  <!-- Kapasitas -->
                  <p
                    class="text-xs"
                    :class="
                      table.status === 'available'
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-white/70'
                    "
                  >
                    {{ table.capacity }} org
                  </p>

                  <!-- INFORMASI SECTION -->
                  <p
                    v-if="table.section"
                    class="text-[10px] font-medium mt-1 uppercase tracking-wider"
                    :class="
                      table.status === 'available'
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-white/60'
                    "
                  >
                    📍 {{ table.section }}
                  </p>

                  <!-- Badge Status -->
                  <span
                    :class="[
                      'inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusBadgeClass(table.status),
                    ]"
                  >
                    {{ getStatusText(table.status) }}
                  </span>
                </div>
              </div>

              <!-- Reset Button on hover -->
              <button
                v-if="table.status !== 'available'"
                @click.stop="resetTable(table)"
                class="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                title="Reset meja menjadi tersedia"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5 text-gray-600 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <ReservationForm
      v-if="showReservationModal"
      :selected-table="selectedTable"
      :sequential-number="selectedTableSeqNumber"
      @submit="handleReservation"
      @close="showReservationModal = false"
    />

    <DialogCard
      :is-open="dialog.isOpen"
      :type="dialog.type"
      :title="dialog.title"
      :message="dialog.message"
      :confirm-text="dialog.confirmText"
      @confirm="dialog.onConfirm"
      @cancel="dialog.isOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTablesStore } from '../stores/tables'
import ReservationForm from '../components/reservation/ReservationForm.vue'
import DialogCard from '../components/common/DialogCard.vue'
import { reservationAPI, tableAPI } from '../services/api'

const tablesStore = useTablesStore()
const showReservationModal = ref(false)
const selectedTable = ref(null)
const selectedTableSeqNumber = ref(0)

const availableCount = computed(
  () => tablesStore.tables.filter((t) => t.status === 'available').length,
)
const reservedCount = computed(
  () => tablesStore.tables.filter((t) => t.status === 'reserved').length,
)
const occupiedCount = computed(
  () => tablesStore.tables.filter((t) => t.status === 'occupied').length,
)

const dialog = ref({
  isOpen: false,
  type: 'success',
  title: '',
  message: '',
  confirmText: 'OK',
  onConfirm: () => {},
})

const showDialog = (options) => {
  dialog.value = {
    isOpen: true,
    type: options.type || 'success',
    title: options.title || '',
    message: options.message || '',
    confirmText: options.confirmText || 'OK',
    onConfirm:
      options.onConfirm ||
      (() => {
        dialog.value.isOpen = false
      }),
  }
}

const formatTableNumber = (tableNumber) => {
  const idx = tablesStore.tables.findIndex((t) => t.number === tableNumber)
  return idx >= 0 ? idx + 1 : tableNumber?.replace(/[A-Za-z]/g, '') || tableNumber
}

const getTableCardClass = (status) => {
  const classes = {
    available:
      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
    reserved: 'bg-amber-500 border-amber-600',
    occupied: 'bg-orange-500 border-orange-600',
    cleaning: 'bg-gray-400 dark:bg-gray-600 border-gray-500 dark:border-gray-700',
  }
  return classes[status] || 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    available: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    reserved: 'bg-white/20 text-white',
    occupied: 'bg-white/20 text-white',
    cleaning: 'bg-white/20 text-white',
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}

const getStatusText = (status) => {
  const texts = {
    available: 'Tersedia',
    reserved: 'Dipesan',
    occupied: 'Terisi',
    cleaning: 'Dibersihkan',
  }
  return texts[status] || status
}

const resetTable = async (table) => {
  showDialog({
    type: 'confirm',
    title: 'Reset Meja',
    message: `Apakah Anda yakin ingin mereset meja ${formatTableNumber(table.number)} menjadi tersedia?`,
    confirmText: 'Ya, Reset',
    onConfirm: async () => {
      dialog.value.isOpen = false
      try {
        await tableAPI.updateStatus(table.id, 'available')
        if (table.currentOrderId) {
          await tableAPI.update(table.id, { currentOrderId: null })
        }
        await tablesStore.fetchTables()
        showDialog({
          type: 'success',
          title: 'Meja Berhasil Direset',
          message: `Meja ${formatTableNumber(table.number)} sekarang tersedia untuk dipesan.`,
          confirmText: 'OK',
        })
      } catch (error) {
        console.error('Error resetting table:', error)
        showDialog({
          type: 'error',
          title: 'Gagal Mereset Meja',
          message: 'Terjadi kesalahan. Silakan coba lagi.',
          confirmText: 'OK',
        })
      }
    },
  })
}

const resetAllTables = async () => {
  const nonAvailableCount = tablesStore.tables.filter((t) => t.status !== 'available').length

  if (nonAvailableCount === 0) {
    showDialog({
      type: 'info',
      title: 'Semua Meja Sudah Tersedia',
      message: 'Tidak ada meja yang perlu direset.',
      confirmText: 'OK',
    })
    return
  }

  showDialog({
    type: 'confirm',
    title: 'Reset Semua Meja',
    message: `Akan mereset ${nonAvailableCount} meja menjadi tersedia. Lanjutkan?`,
    confirmText: 'Ya, Reset Semua',
    onConfirm: async () => {
      dialog.value.isOpen = false
      try {
        for (const table of tablesStore.tables) {
          if (table.status !== 'available') {
            await tableAPI.updateStatus(table.id, 'available')
            if (table.currentOrderId) {
              await tableAPI.update(table.id, { currentOrderId: null })
            }
          }
        }
        await tablesStore.fetchTables()
        showDialog({
          type: 'success',
          title: 'Semua Meja Direset',
          message: `${nonAvailableCount} meja telah direset menjadi tersedia.`,
          confirmText: 'OK',
        })
      } catch (error) {
        console.error('Error resetting all tables:', error)
        showDialog({
          type: 'error',
          title: 'Gagal Mereset Meja',
          message: 'Terjadi kesalahan. Silakan coba lagi.',
          confirmText: 'OK',
        })
      }
    },
  })
}

onMounted(() => {
  tablesStore.fetchTables()
})

const openReservationForm = (table) => {
  if (table.status !== 'available') {
    showDialog({
      type: 'warning',
      title: 'Meja Tidak Tersedia',
      message: `Meja ${formatTableNumber(table.number)} sedang ${getStatusText(table.status)}`,
      confirmText: 'Mengerti',
    })
    return
  }
  selectedTable.value = table
  selectedTableSeqNumber.value = tablesStore.tables.findIndex((t) => t.id === table.id) + 1
  showReservationModal.value = true
}

const handleReservation = async (reservationData) => {
  try {
    await reservationAPI.create({
      ...reservationData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    })
    
    // Update status meja di store
    await tablesStore.updateTableStatus(selectedTable.value.id, 'reserved')
    
    showDialog({
      type: 'success',
      title: 'Reservasi Berhasil',
      message: `Meja ${selectedTable.value.number} berhasil direservasi untuk ${reservationData.name}`,
      confirmText: 'OK',
      onConfirm: () => {
        dialog.value.isOpen = false
      },
    })
    showReservationModal.value = false
   
  } catch (error) {
    console.error('Error creating reservation:', error)
    showDialog({
      type: 'error',
      title: 'Reservasi Gagal',
      message: 'Terjadi kesalahan saat membuat reservasi. Silakan coba lagi.',
      confirmText: 'OK',
    })
  }
}
</script>