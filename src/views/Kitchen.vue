<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <header
      class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">Dapur</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola pesanan yang masuk dari pelayan
        </p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeTab === tab.key
              ? 'bg-gray-900 dark:bg-gray-700 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          ]"
        >
          {{ tab.label }}
          <span
            class="ml-2 px-2 py-0.5 rounded-full text-xs"
            :class="[
              activeTab === tab.key
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300"></div>
        <p class="text-gray-500 dark:text-gray-400 mt-3">Memuat data...</p>
      </div>

      <template v-else>
        <!-- ─── MENUNGGU DIMASAK ─── -->
        <div v-if="activeTab === 'pending'">
          <div v-if="pendingItems.length === 0" class="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div class="text-4xl mb-3">🍳</div>
            <p class="text-gray-500 dark:text-gray-400 text-lg">Tidak ada item menunggu</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div
              v-for="(group, tableNumber) in groupedPendingItems"
              :key="tableNumber"
              class="bg-white dark:bg-gray-900 rounded-xl border border-amber-200 dark:border-amber-800 overflow-hidden shadow-sm"
            >
              <!-- Header Card -->
              <div class="bg-amber-50 dark:bg-amber-900/20 px-4 py-3 border-b border-amber-200 dark:border-amber-800 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xl">🪑</span>
                  <div>
                    <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-300">
                      Meja {{ tableNumber }}
                    </h3>
                    <p class="text-xs text-amber-600 dark:text-amber-400">
                      {{ group.length }} item
                    </p>
                  </div>
                </div>
                <button
                  @click="processAllItems(group.map(item => item.id))"
                  class="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                >
                  🍳 Proses Semua
                </button>
              </div>

              <!-- List Items -->
              <div class="divide-y divide-gray-100 dark:divide-gray-800 max-h-64 overflow-y-auto">
                <div
                  v-for="item in group"
                  :key="item.id"
                  class="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="text-lg flex-shrink-0">{{ getMenuIcon(item.menu?.name) }}</span>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {{ item.menu?.name || 'Unknown' }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ item.quantity }} porsi · {{ formatTime(item.createdAt) }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="updateItemStatus(item.id, 'cooking')"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ml-2"
                  >
                    🔥 Masak
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── SEDANG DIMASAK ─── -->
        <div v-if="activeTab === 'cooking'">
          <div v-if="cookingItems.length === 0" class="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div class="text-4xl mb-3">🔥</div>
            <p class="text-gray-500 dark:text-gray-400 text-lg">Tidak ada item sedang dimasak</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div
              v-for="(group, tableNumber) in groupedCookingItems"
              :key="tableNumber"
              class="bg-white dark:bg-gray-900 rounded-xl border border-orange-200 dark:border-orange-800 overflow-hidden shadow-sm"
            >
              <!-- Header Card -->
              <div class="bg-orange-50 dark:bg-orange-900/20 px-4 py-3 border-b border-orange-200 dark:border-orange-800 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xl">🪑</span>
                  <div>
                    <h3 class="text-sm font-semibold text-orange-800 dark:text-orange-300">
                      Meja {{ tableNumber }}
                    </h3>
                    <p class="text-xs text-orange-600 dark:text-orange-400">
                      {{ group.length }} item
                    </p>
                  </div>
                </div>
                <span class="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  🔥 Dimasak
                </span>
              </div>

              <!-- List Items -->
              <div class="divide-y divide-gray-100 dark:divide-gray-800 max-h-64 overflow-y-auto">
                <div
                  v-for="item in group"
                  :key="item.id"
                  class="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="text-lg flex-shrink-0">{{ getMenuIcon(item.menu?.name) }}</span>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {{ item.menu?.name || 'Unknown' }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ item.quantity }} porsi · {{ formatTime(item.createdAt) }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="updateItemStatus(item.id, 'ready')"
                    class="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ml-2"
                  >
                    ✅ Siap
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── SIAP DIANTAR ─── -->
        <div v-if="activeTab === 'ready'">
          <div v-if="readyItems.length === 0" class="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div class="text-4xl mb-3">✅</div>
            <p class="text-gray-500 dark:text-gray-400 text-lg">Tidak ada item siap diantar</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div
              v-for="(group, tableNumber) in groupedReadyItems"
              :key="tableNumber"
              class="bg-white dark:bg-gray-900 rounded-xl border border-emerald-200 dark:border-emerald-800 overflow-hidden shadow-sm"
            >
              <!-- Header Card -->
              <div class="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xl">🪑</span>
                  <div>
                    <h3 class="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      Meja {{ tableNumber }}
                    </h3>
                    <p class="text-xs text-emerald-600 dark:text-emerald-400">
                      {{ group.length }} item siap
                    </p>
                  </div>
                </div>
                <button
                  @click="deliverAllItems(group.map(item => item.id))"
                  class="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                >
                  🚚 Antar Semua
                </button>
              </div>

              <!-- List Items -->
              <div class="divide-y divide-gray-100 dark:divide-gray-800 max-h-64 overflow-y-auto">
                <div
                  v-for="item in group"
                  :key="item.id"
                  class="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="text-lg flex-shrink-0">{{ getMenuIcon(item.menu?.name) }}</span>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {{ item.menu?.name || 'Unknown' }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ item.quantity }} porsi · {{ formatTime(item.createdAt) }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="updateItemStatus(item.id, 'served')"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ml-2"
                  >
                    🚚 Antar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── RIWAYAT ─── -->
        <div v-if="activeTab === 'history'">
          <div v-if="completedItems.length === 0" class="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div class="text-4xl mb-3">📋</div>
            <p class="text-gray-500 dark:text-gray-400 text-lg">Belum ada riwayat pesanan</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div
              v-for="(group, tableNumber) in groupedCompletedItems"
              :key="tableNumber"
              class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
            >
              <!-- Header Card -->
              <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xl">🪑</span>
                  <div>
                    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Meja {{ tableNumber }}
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ group.length }} item selesai
                    </p>
                  </div>
                </div>
                <span class="text-xs text-gray-400">
                  ✅ Selesai
                </span>
              </div>

              <!-- List Items -->
              <div class="divide-y divide-gray-100 dark:divide-gray-800 max-h-64 overflow-y-auto">
                <div
                  v-for="item in group"
                  :key="item.id"
                  class="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="text-lg flex-shrink-0">{{ getMenuIcon(item.menu?.name) }}</span>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {{ item.menu?.name || 'Unknown' }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ item.quantity }} porsi · {{ formatTime(item.updatedAt) }}
                      </p>
                    </div>
                  </div>
                  <span class="text-xs text-emerald-600 dark:text-emerald-400 flex-shrink-0 ml-2">
                    ✅ Selesai
                  </span>
                </div>
              </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '../services/api'
import DialogCard from '../components/common/DialogCard.vue'

// ── State ──
const orders = ref([])
const orderItems = ref([])
const tables = ref([])
const menus = ref([])
const loading = ref(false)
const activeTab = ref('pending')

const dialog = ref({
  isOpen: false,
  type: 'success',
  title: '',
  message: '',
  confirmText: 'OK',
  onConfirm: () => {},
})

// ── Tabs ──
const tabs = computed(() => [
  { key: 'pending', label: 'Menunggu', count: pendingItems.value.length },
  { key: 'cooking', label: 'Dimasak', count: cookingItems.value.length },
  { key: 'ready', label: 'Siap', count: readyItems.value.length },
  { key: 'history', label: 'Riwayat', count: completedItems.value.length },
])

// ── Computed: Filter berdasarkan status item ──

const pendingItems = computed(() => {
  return orderItems.value.filter((item) => item.status === 'pending')
})

const cookingItems = computed(() => {
  return orderItems.value.filter((item) => item.status === 'cooking')
})

const readyItems = computed(() => {
  return orderItems.value.filter((item) => item.status === 'ready')
})

const completedItems = computed(() => {
  return orderItems.value.filter((item) => item.status === 'served' || item.status === 'completed')
})

// ── Grouped Items by Table ──

const groupedPendingItems = computed(() => {
  return groupItemsByTable(pendingItems.value)
})

const groupedCookingItems = computed(() => {
  return groupItemsByTable(cookingItems.value)
})

const groupedReadyItems = computed(() => {
  return groupItemsByTable(readyItems.value)
})

const groupedCompletedItems = computed(() => {
  return groupItemsByTable(completedItems.value)
})

const groupItemsByTable = (items) => {
  const groups = {}
  items.forEach(item => {
    const tableId = item.order?.tableId || item.orderId
    const tableNumber = getTableNumber(tableId)
    if (!groups[tableNumber]) {
      groups[tableNumber] = []
    }
    groups[tableNumber].push(item)
  })
  // Sort by table number
  return Object.fromEntries(
    Object.entries(groups).sort((a, b) => {
      const numA = parseInt(a[0].replace(/\D/g, '')) || 0
      const numB = parseInt(b[0].replace(/\D/g, '')) || 0
      return numA - numB
    })
  )
}

// ── Helper Functions ──

const showDialog = (options) => {
  dialog.value = {
    isOpen: true,
    type: options.type || 'success',
    title: options.title || '',
    message: options.message || '',
    confirmText: options.confirmText || 'OK',
    onConfirm: options.onConfirm || (() => { dialog.value.isOpen = false }),
  }
}

const getMenuIcon = (menuName) => {
  if (!menuName) return '🍽️'
  if (menuName.includes('Nasi') || menuName.includes('Mie')) return '🍚'
  if (menuName.includes('Ayam') || menuName.includes('Sate')) return '🍗'
  if (menuName.includes('Teh') || menuName.includes('Jeruk') || menuName.includes('Kopi')) return '🥤'
  if (menuName.includes('Pisang') || menuName.includes('Campur')) return '🍌'
  if (menuName.includes('Sop')) return '🍜'
  return '🍽️'
}

const getItemStatusText = (status) => {
  const texts = {
    pending: '⏳ menunggu',
    cooking: '🔥 dimasak',
    ready: '✅ siap',
    served: '🚚 diantar',
    completed: '✅ selesai',
  }
  return texts[status] || status
}

const getTableNumber = (tableId) => {
  const table = tables.value.find((t) => t.id === tableId)
  return table ? table.number : 'Unknown'
}

const formatTime = (timeString) => {
  if (!timeString) return '-'
  const date = new Date(timeString)
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

// ── Fetch Functions ──

const fetchOrders = async () => {
  try {
    const response = await api.get('/orders?status_ne=completed,draft')
    orders.value = response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
}

const fetchOrderItems = async () => {
  try {
    const response = await api.get('/orderItems?status_ne=completed,draft')
    // Enrich with menu data
    const items = response.data.map(item => ({
      ...item,
      menu: menus.value.find(m => m.id === item.menuId)
    }))
    orderItems.value = items
  } catch (error) {
    console.error('Error fetching order items:', error)
  }
}

const fetchTables = async () => {
  try {
    const response = await api.get('/tables')
    tables.value = response.data
  } catch (error) {
    console.error('Error fetching tables:', error)
  }
}

const fetchMenus = async () => {
  try {
    const response = await api.get('/menus')
    menus.value = response.data
  } catch (error) {
    console.error('Error fetching menus:', error)
  }
}

const fetchAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchOrders(),
      fetchTables(),
      fetchMenus()
    ])
    await fetchOrderItems()
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

// ── Update Status ──

const updateItemStatus = async (itemId, status) => {
  try {
    await api.patch(`/orderItems/${itemId}`, { status })
    
    if (status === 'served') {
      const updatedItem = orderItems.value.find(item => item.id === itemId)
      if (updatedItem) {
        const orderId = updatedItem.orderId
        const allItemsInOrder = orderItems.value.filter(item => item.orderId === orderId)
        const allServed = allItemsInOrder.every(item => 
          item.status === 'served' || item.status === 'completed' || item.id === itemId
        )
        
        if (allServed) {
          await api.patch(`/orders/${orderId}`, { status: 'served' })
          showDialog({
            type: 'success',
            title: '✅ Semua Siap!',
            message: `Semua pesanan untuk meja ${getTableNumber(updatedItem.order?.tableId || updatedItem.orderId)} sudah siap diantar.`,
            confirmText: 'OK',
          })
        }
      }
    }
    
    await fetchAllData()
    
    showDialog({
      type: 'success',
      title: 'Status Diperbarui',
      message: `Item berhasil diupdate menjadi ${getItemStatusText(status)}`,
      confirmText: 'OK',
    })
  } catch (error) {
    console.error('Error updating item status:', error)
    showDialog({
      type: 'error',
      title: 'Gagal',
      message: 'Terjadi kesalahan saat mengupdate status',
      confirmText: 'OK',
    })
  }
}

// ── Bulk Actions ──

const processAllItems = async (itemIds) => {
  try {
    for (const id of itemIds) {
      await api.patch(`/orderItems/${id}`, { status: 'cooking' })
    }
    await fetchAllData()
    showDialog({
      type: 'success',
      title: '✅ Semua Diproses!',
      message: `${itemIds.length} item mulai dimasak.`,
      confirmText: 'OK',
    })
  } catch (error) {
    console.error('Error processing all items:', error)
    showDialog({
      type: 'error',
      title: 'Gagal',
      message: 'Terjadi kesalahan saat memproses item',
      confirmText: 'OK',
    })
  }
}

const deliverAllItems = async (itemIds) => {
  try {
    for (const id of itemIds) {
      await api.patch(`/orderItems/${id}`, { status: 'served' })
    }
    await fetchAllData()
    showDialog({
      type: 'success',
      title: '✅ Semua Diantar!',
      message: `${itemIds.length} item berhasil diantar.`,
      confirmText: 'OK',
    })
  } catch (error) {
    console.error('Error delivering all items:', error)
    showDialog({
      type: 'error',
      title: 'Gagal',
      message: 'Terjadi kesalahan saat mengantar item',
      confirmText: 'OK',
    })
  }
}

// ── Refresh ──

const refreshData = () => {
  fetchAllData()
}

// ── Lifecycle ──

onMounted(() => {
  fetchAllData()
  window.addEventListener('order-sent-to-kitchen', refreshData)
  window.addEventListener('order-created', refreshData)
})

onUnmounted(() => {
  window.removeEventListener('order-sent-to-kitchen', refreshData)
  window.removeEventListener('order-created', refreshData)
})
</script>