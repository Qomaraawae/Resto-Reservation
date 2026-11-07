<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <header
      class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
          Manajemen Reservasi
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Lihat dan kelola semua reservasi dengan mudah
        </p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        <!-- Header Card -->
        <div class="bg-gray-900 dark:bg-gray-800 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                Daftar Reservasi
              </h2>
              <p class="text-gray-400 text-sm mt-0.5">
                Total {{ reservations.length }} reservasi
              </p>
            </div>
            <span class="bg-white/10 text-white text-sm font-medium px-3 py-1 rounded-full">
              {{ reservations.length }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div v-if="reservations.length === 0" class="text-center py-16">
            <div class="text-5xl mb-3">📭</div>
            <p class="text-gray-500 dark:text-gray-400 font-medium">Belum ada reservasi</p>
            <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Klik meja di dashboard untuk membuat reservasi
            </p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="res in reservations"
              :key="res.id"
              class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200 overflow-hidden"
            >
              <!-- Card Header -->
              <div class="bg-gray-800 dark:bg-gray-700 px-5 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-3xl">{{ getTableIcon(getTableNumber(res.tableId)) }}</span>
                  <div>
                    <h3 class="text-lg font-semibold text-white">
                      Meja {{ formatTableNumber(getTableNumber(res.tableId)) }}
                    </h3>
                    <!-- INFORMASI KAPASITAS & SECTION DITAMPILKAN DI SINI -->
                    <p class="text-gray-400 text-xs">
                      Kapasitas: {{ getTableCapacity(res.tableId) }} orang
                      <span v-if="getTableSection(res.tableId)">
                        • 📍 {{ getTableSection(res.tableId) }}
                      </span>
                    </p>
                  </div>
                </div>
                <span
                  class="bg-amber-500/20 text-amber-400 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-500/30"
                >
                  {{ res.status === 'confirmed' ? '✓ Confirmed' : res.status }}
                </span>
              </div>

              <!-- Detail -->
              <div class="p-5 space-y-3">
                <div
                  class="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700"
                >
                  <span class="text-xl">👤</span>
                  <div>
                    <p class="font-medium text-gray-800 dark:text-white text-sm">
                      {{ res.customerName || res.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ res.customerPhone || res.phone }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <span class="text-lg">📅</span>
                  <div>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                      {{ formatDate(res.date) }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ res.time }} WIB</p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <span class="text-lg">👥</span>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ res.partySize || res.numberOfPeople || '?' }} orang
                  </p>
                </div>

                <button
                  @click="checkIn(res)"
                  class="w-full mt-2 bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  ✅ Check-in Pelanggan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

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
import { ref, onMounted } from 'vue'
import api from '../services/api'
import DialogCard from '../components/common/DialogCard.vue'

const reservations = ref([])
const tables = ref([])

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

const fetchTables = async () => {
  try {
    const response = await api.get('/tables')
    tables.value = response.data
    console.log('Tables loaded:', tables.value)
  } catch (error) {
    console.error('Error fetching tables:', error)
  }
}

const fetchReservations = async () => {
  try {
    const response = await api.get('/reservations')
    reservations.value = response.data
    console.log('Reservations loaded:', reservations.value)
  } catch (error) {
    console.error('Error fetching reservations:', error)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const getTableCapacity = (tableId) => {
  if (!tableId) return '?'
  const table = tables.value.find((t) => t.id === tableId)
  return table?.capacity || '?'
}

// FUNGSI BARU: Mengambil data section meja
const getTableSection = (tableId) => {
  if (!tableId) return null
  const table = tables.value.find((t) => t.id === tableId)
  return table?.section || null
}

const getTableNumber = (tableId) => {
  if (!tableId) return null
  const table = tables.value.find((t) => t.id === tableId)
  return table?.number || null
}

const formatTableNumber = (tableNumber) => {
  if (!tableNumber) return '?'
  return tableNumber
}

const getTableIcon = (tableNumber) => {
  if (!tableNumber) return '🍴'
  if (tableNumber.includes('A')) return '🍽️'
  if (tableNumber.includes('B')) return '🥘'
  if (tableNumber.includes('C')) return '🍜'
  if (tableNumber.includes('T')) return '🍴'
  return '🍴'
}

const checkIn = async (reservation) => {
  if (!reservation || !reservation.id || !reservation.tableId) {
    showDialog({
      type: 'error',
      title: 'Error',
      message: 'Data reservasi tidak lengkap',
      confirmText: 'OK',
    })
    return
  }

  const tableNumber = getTableNumber(reservation.tableId)
  
  showDialog({
    type: 'confirm',
    title: 'Konfirmasi Check-in',
    message: `Apakah Anda yakin ingin melakukan check-in untuk ${reservation.customerName || reservation.name} di meja ${formatTableNumber(tableNumber)}?`,
    confirmText: 'Ya, Check-in',
    onConfirm: async () => {
      dialog.value.isOpen = false
      try {
        await api.patch(`/tables/${reservation.tableId}`, { status: 'occupied' })
        await api.delete(`/reservations/${reservation.id}`)

        showDialog({
          type: 'success',
          title: '✅ Check-in Berhasil!',
          message: `${reservation.customerName || reservation.name} telah check-in ke meja ${formatTableNumber(tableNumber)}. Selamat menikmati!`,
          confirmText: 'OK',
        })

        await fetchReservations()
        await fetchTables()
      } catch (error) {
        console.error('Error checking in:', error)
        showDialog({
          type: 'error',
          title: 'Check-in Gagal',
          message: 'Terjadi kesalahan saat melakukan check-in. Silakan coba lagi.',
          confirmText: 'OK',
        })
      }
    },
  })
}

onMounted(() => {
  fetchTables()
  fetchReservations()
})
</script>