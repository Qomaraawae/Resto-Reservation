<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <header
      class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
              Laporan & Analitik
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Pantau kinerja dan pendapatan restoran Anda
            </p>
          </div>
          <button
            @click="exportReport"
            :disabled="loading || completedOrders.length === 0"
            class="bg-gray-900 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            📥 Export Laporan
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300"></div>
        <p class="text-gray-500 dark:text-gray-400 mt-3">Memuat data laporan...</p>
      </div>

      <template v-else>
        <!-- Filter Section -->
        <div
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 mb-6"
        >
          <div class="flex flex-col gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Periode
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="period in periods"
                  :key="period.value"
                  @click="selectedPeriod = period.value; fetchReport()"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none',
                    selectedPeriod === period.value
                      ? 'bg-gray-900 dark:bg-gray-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ period.label }}
                </button>
              </div>
            </div>

            <div v-if="selectedPeriod === 'custom'" class="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div class="flex-1">
                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Dari
                </label>
                <input
                  v-model="customStartDate"
                  type="date"
                  class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:border-gray-400 focus:outline-none"
                />
              </div>
              <div class="flex-1">
                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Sampai
                </label>
                <input
                  v-model="customEndDate"
                  type="date"
                  class="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:text-white focus:border-gray-400 focus:outline-none"
                />
              </div>
              <button
                @click="fetchReport()"
                class="bg-gray-900 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
            <p class="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
              Total Pendapatan
            </p>
            <p class="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-500 mt-2">
              Rp {{ formatCurrency(totalRevenue) }}
            </p>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
            <p class="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
              Total Pesanan
            </p>
            <p class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-500 mt-2">
              {{ totalOrders }}
            </p>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
            <p class="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
              Rata-rata per Pesanan
            </p>
            <p class="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-500 mt-2">
              Rp {{ formatCurrency(averageOrder) }}
            </p>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
            <p class="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
              Item Terjual
            </p>
            <p class="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-500 mt-2">
              {{ totalItems }}
            </p>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 mb-6">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">
            Grafik Penjualan (7 Hari Terakhir)
          </h3>
          <div v-if="chartData.length === 0" class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">Belum ada data penjualan</p>
          </div>
          <!-- Modifikasi: Menggunakan overflow-x-auto dan min-width agar grafik bisa di-scroll di HP -->
          <div v-else class="w-full overflow-x-auto pb-2">
            <div class="min-w-[500px] h-64 relative">
              <div class="flex items-end justify-between h-56 gap-2">
                <div
                  v-for="(item, index) in chartData"
                  :key="index"
                  class="flex-1 flex flex-col items-center group"
                >
                  <!-- Tooltip Harga (Disembunyikan secara default, muncul saat di-hover di desktop) -->
                  <div
                    class="w-full rounded-t-lg transition-all duration-500 relative"
                    :style="{
                      height: `${getBarHeight(item.total)}px`,
                      backgroundColor: getBarColor(index)
                    }"
                  >
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity text-center text-xs font-medium text-gray-800 dark:text-gray-200 bg-white/90 dark:bg-gray-800/90 shadow-sm rounded px-1 py-0.5 absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                      Rp {{ formatCurrency(item.total) }}
                    </div>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    {{ item.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Menu & Recent Orders -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">
              Menu Terlaris
            </h3>
            <div v-if="topMenus.length === 0" class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400">Belum ada data menu</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="(menu, index) in topMenus.slice(0, 5)"
                :key="menu.id"
                class="flex items-center gap-3"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  :class="[
                    index === 0 ? 'bg-amber-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-400' :
                    'bg-gray-300 dark:bg-gray-600'
                  ]"
                >
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 dark:text-white truncate">{{ menu.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ menu.totalSold }} terjual · Rp {{ formatCurrency(menu.totalRevenue) }}
                  </p>
                </div>
                <div class="w-16 sm:w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0 hidden sm:block">
                  <div
                    class="h-full bg-emerald-500 rounded-full"
                    :style="{ width: `${(menu.totalSold / topMenus[0]?.totalSold) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">
              Transaksi Terbaru
            </h3>
            <div v-if="recentOrders.length === 0" class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400">Belum ada transaksi</p>
            </div>
            <div v-else class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="order in recentOrders"
                :key="order.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <p class="text-sm font-medium text-gray-800 dark:text-white">
                    Meja {{ getTableNumber(order.tableId) }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(order.createdAt) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    Rp {{ formatCurrency(order.total) }}
                  </p>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full inline-block mt-1"
                    :class="
                      order.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    "
                  >
                    {{ order.status === 'completed' ? '✅ Selesai' : order.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detail Table -->
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div class="px-4 sm:px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white">
              Detail Transaksi
            </h3>
          </div>
          <!-- Overflow-x-auto memastikan tabel bisa digeser di HP -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm min-w-[600px]">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-3 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    #
                  </th>
                  <th class="px-3 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Meja
                  </th>
                  <th class="px-3 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th class="px-3 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th class="px-3 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-3 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="(order, index) in paginatedOrders"
                  :key="order.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td class="px-3 sm:px-5 py-3 text-gray-600 dark:text-gray-300">
                    {{ (currentPage - 1) * pageSize + index + 1 }}
                  </td>
                  <td class="px-3 sm:px-5 py-3 font-medium text-gray-800 dark:text-white whitespace-nowrap">
                    {{ getTableNumber(order.tableId) }}
                  </td>
                  <td class="px-3 sm:px-5 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {{ order.orderNumber }}
                  </td>
                  <td class="px-3 sm:px-5 py-3 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    Rp {{ formatCurrency(order.total) }}
                  </td>
                  <td class="px-3 sm:px-5 py-3 whitespace-nowrap">
                    <span
                      class="text-xs px-2 py-1 rounded-full"
                      :class="
                        order.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      "
                    >
                      {{ order.status === 'completed' ? '✅ Selesai' : order.status }}
                    </span>
                  </td>
                  <td class="px-3 sm:px-5 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {{ formatDate(order.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="completedOrders.length > 0" class="px-4 sm:px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
              Menampilkan {{ (currentPage - 1) * pageSize + 1 }} - 
              {{ Math.min(currentPage * pageSize, completedOrders.length) }} 
              dari {{ completedOrders.length }} transaksi
            </p>
            <div class="flex gap-2">
              <button
                @click="currentPage > 1 && currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                ←
              </button>
              <button
                @click="currentPage < totalPages && currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </template>
    </main>

    <DialogCard
      :is-open="dialog.isOpen"
      :type="dialog.type"
      :title="dialog.title"
      :message="dialog.message"
      :confirm-text="dialog.confirmText"
      @confirm="dialog.isOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import DialogCard from '../components/common/DialogCard.vue'

// ── State ──
const orders = ref([])
const orderItems = ref([])
const tables = ref([])
const loading = ref(false)

const selectedPeriod = ref('today')
const customStartDate = ref('')
const customEndDate = ref('')
const currentPage = ref(1)
const pageSize = 10

// Data dari API
const totalRevenue = ref(0)
const totalOrders = ref(0)
const totalItems = ref(0)
const averageOrder = ref(0)
const topMenus = ref([])
const chartData = ref([])
const completedOrders = ref([])

const dialog = ref({
  isOpen: false,
  type: 'success',
  title: '',
  message: '',
  confirmText: 'OK',
  onConfirm: () => {},
})

const periods = [
  { label: 'Hari Ini', value: 'today' },
  { label: 'Minggu Ini', value: 'week' },
  { label: 'Bulan Ini', value: 'month' },
  { label: 'Custom', value: 'custom' },
]

// ── Computed ──

const recentOrders = computed(() => {
  return [...completedOrders.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return [...completedOrders.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(completedOrders.value.length / pageSize)
})

// ── Helper Functions ──

const formatCurrency = (value) => {
  return value?.toLocaleString('id-ID') || '0'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTableNumber = (tableId) => {
  const table = tables.value.find(t => t.id === tableId)
  return table ? table.number : 'Unknown'
}

const getBarHeight = (value) => {
  const max = Math.max(...chartData.value.map(d => d.total), 1)
  return Math.max((value / max) * 200, 10)
}

const getBarColor = (index) => {
  const colors = [
    '#10B981', // emerald
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#F59E0B', // amber
    '#EF4444', // red
    '#06B6D4', // cyan
    '#EC4899', // pink
  ]
  return colors[index % colors.length]
}

// ── Fetch Functions ──

const fetchTables = async () => {
  try {
    const response = await api.get('/tables')
    tables.value = response.data
  } catch (error) {
    console.error('Error fetching tables:', error)
  }
}

const fetchReport = async () => {
  loading.value = true
  try {
    let params = {}
    
    if (selectedPeriod.value === 'custom') {
      params = {
        startDate: customStartDate.value,
        endDate: customEndDate.value
      }
    } else {
      params = { period: selectedPeriod.value }
    }
    
    const response = await api.get('/reports/summary', { params })
    const data = response.data
    
    totalRevenue.value = data.summary.totalRevenue
    totalOrders.value = data.summary.totalOrders
    totalItems.value = data.summary.totalItems
    averageOrder.value = data.summary.averageOrder
    topMenus.value = data.topMenus || []
    chartData.value = data.chartData || []
    completedOrders.value = data.orders || []
    
  } catch (error) {
    console.error('Error fetching report:', error)
    showDialog({
      type: 'error',
      title: 'Error',
      message: 'Gagal mengambil data laporan',
      confirmText: 'OK'
    })
  } finally {
    loading.value = false
  }
}

// ── Export ──

const exportReport = async () => {
  if (completedOrders.value.length === 0) {
    showDialog({
      type: 'warning',
      title: 'Tidak Ada Data',
      message: 'Belum ada transaksi yang selesai untuk diekspor.',
      confirmText: 'OK'
    })
    return
  }
  
  try {
    let params = {}
    
    if (selectedPeriod.value === 'custom') {
      params = {
        startDate: customStartDate.value,
        endDate: customEndDate.value
      }
    } else {
      params = { period: selectedPeriod.value }
    }
    
    const response = await api.get('/reports/export', {
      params,
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `laporan_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
  } catch (error) {
    console.error('Error exporting report:', error)
    showDialog({
      type: 'error',
      title: 'Error',
      message: 'Gagal mengekspor laporan',
      confirmText: 'OK'
    })
  }
}

// ── Dialog ──

const showDialog = (options) => {
  dialog.value = {
    isOpen: true,
    type: options.type || 'success',
    title: options.title || '',
    message: options.message || '',
    confirmText: options.confirmText || 'OK',
    onConfirm: () => { dialog.value.isOpen = false }
  }
}

// ── Lifecycle ──

onMounted(() => {
  // Set default custom dates
  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  customStartDate.value = weekAgo.toISOString().split('T')[0]
  customEndDate.value = today.toISOString().split('T')[0]
  
  fetchTables()
  fetchReport()
})
</script>