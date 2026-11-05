<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <header
      class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
          Manajemen Pesanan
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola pesanan dan pembayaran pelanggan dengan mudah
        </p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sidebar: Daftar Meja Aktif -->
        <div class="lg:col-span-1">
          <div
            class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div class="bg-gray-900 dark:bg-gray-800 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 class="text-base font-semibold text-white flex items-center gap-2">
                Meja Aktif
                </h2>
                <p class="text-gray-400 text-xs mt-0.5">
                  {{ activeTables.length }} meja sedang makan
                </p>
              </div>
              <span class="bg-white/10 text-white text-sm font-medium px-2.5 py-1 rounded-full">
                {{ activeTables.length }}
              </span>
            </div>

            <div class="p-3 max-h-[calc(100vh-280px)] overflow-y-auto">
              <!-- State kosong -->
              <div v-if="activeTables.length === 0" class="text-center py-12">
                <div class="text-4xl mb-3">🍽️</div>
                <p class="text-gray-500 dark:text-gray-400 text-sm">Belum ada meja aktif</p>
                <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  Meja akan muncul setelah check-in dari halaman Reservasi
                </p>
              </div>

              <!-- Daftar meja aktif -->
              <div v-for="table in activeTables" :key="table.id" class="mb-2">
                <button
                  @click="selectTable(table)"
                  class="w-full text-left rounded-lg overflow-hidden"
                >
                  <div
                    :class="[
                      'p-4 rounded-lg transition-all duration-200',
                      selectedTable?.id === table.id
                        ? 'bg-gray-900 dark:bg-gray-700 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
                    ]"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="text-2xl">🪑</span>
                        <div>
                          <h3
                            class="font-semibold text-base"
                            :class="
                              selectedTable?.id === table.id
                                ? 'text-white'
                                : 'text-gray-800 dark:text-white'
                            "
                          >
                            Meja {{ formatTableNumber(table.number) }}
                          </h3>
                          <p
                            class="text-xs"
                            :class="
                              selectedTable?.id === table.id
                                ? 'text-gray-400'
                                : 'text-gray-500 dark:text-gray-400'
                            "
                          >
                            Kapasitas: {{ table.capacity }} org
                          </p>
                        </div>
                      </div>
                      
                      <!-- STATUS AKTIF / TIDAK AKTIF -->
                      <div class="flex items-center gap-1.5">
                        <template v-if="isTableActive(table)">
                          <span class="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                          <span
                            class="text-xs"
                            :class="
                              selectedTable?.id === table.id ? 'text-gray-400' : 'text-gray-500'
                            "
                            >Aktif</span
                          >
                        </template>
                        <template v-else>
                          <span class="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600 inline-block"></span>
                          <span
                            class="text-xs"
                            :class="
                              selectedTable?.id === table.id ? 'text-gray-400' : 'text-gray-500'
                            "
                            >Tidak Aktif</span
                          >
                        </template>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content: Detail Pesanan -->
        <div class="lg:col-span-2">
          <div v-if="selectedTable" class="space-y-4">
            <!-- Header Meja -->
            <div
              class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
            >
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-4">
                  <span class="text-4xl">🪑</span>
                  <div>
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
                      Meja {{ formatTableNumber(selectedTable.number) }}
                    </h2>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                      Kapasitas {{ selectedTable.capacity }} orang
                    </p>
                  </div>
                </div>
                
                <!-- BADGE STATUS DI HEADER -->
                <span
                  v-if="isTableActive(selectedTable)"
                  class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800"
                >
                  🟢 Aktif
                </span>
                <span
                  v-else
                  class="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700"
                >
                  ⚪ Tidak Aktif
                </span>
              </div>
            </div>

            <!-- ── SECTION 1: Verifikasi Pesanan (Draft Items) ── -->
            <div
              v-if="draftItems.length > 0"
              class="bg-white dark:bg-gray-900 rounded-xl border border-amber-200 dark:border-amber-800 overflow-hidden"
            >
              <!-- Header -->
              <div
                class="bg-amber-50 dark:bg-amber-900/20 px-5 py-4 border-b border-amber-200 dark:border-amber-800"
              >
                <div class="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3
                      class="text-base font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2"
                    >
                      ☑️ Verifikasi Pesanan
                    </h3>
                    <p class="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                      Bacakan setiap item ke pelanggan, centang jika sudah sesuai
                    </p>
                  </div>
                  <!-- Progress bar -->
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-amber-700 dark:text-amber-300">
                      {{ checkedCount }}/{{ draftItems.length }} diverifikasi
                    </span>
                    <div
                      class="w-24 h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden"
                    >
                      <div
                        class="h-full bg-amber-500 dark:bg-amber-400 rounded-full transition-all duration-300"
                        :style="{
                          width: `${draftItems.length > 0 ? (checkedCount / draftItems.length) * 100 : 0}%`,
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Checklist items -->
              <div class="p-5 space-y-2">
                <label
                  v-for="item in draftItems"
                  :key="item.id"
                  :class="[
                    'flex items-center gap-4 rounded-lg p-4 cursor-pointer transition-all duration-200 border',
                    checkedDraftItems[item.id]
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-300',
                  ]"
                >
                  <!-- Checkbox custom -->
                  <div class="flex-shrink-0" @click.prevent="toggleCheck(item.id)">
                    <div
                      :class="[
                        'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200',
                        checkedDraftItems[item.id]
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500',
                      ]"
                    >
                      <svg
                        v-if="checkedDraftItems[item.id]"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <!-- Item detail -->
                  <div
                    class="flex-1 flex items-center justify-between gap-3"
                    @click="toggleCheck(item.id)"
                  >
                    <div class="flex items-center gap-3">
                      <span class="text-xl">{{ getMenuIcon(item.menuName) }}</span>
                      <div>
                        <h4
                          :class="[
                            'font-medium text-sm transition-colors',
                            checkedDraftItems[item.id]
                              ? 'text-emerald-700 dark:text-emerald-400 line-through'
                              : 'text-gray-800 dark:text-white',
                          ]"
                        >
                          {{ item.menuName }}
                        </h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {{ item.quantity }} porsi × Rp {{ item.price.toLocaleString() }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <p
                        class="font-semibold text-sm"
                        :class="
                          checkedDraftItems[item.id]
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-800 dark:text-white'
                        "
                      >
                        Rp {{ (item.price * item.quantity).toLocaleString() }}
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              <!-- Tombol kirim ke dapur -->
              <div class="px-5 pb-5 flex gap-3">
                <button
                  @click="openMenuModal"
                  :disabled="!isTableActive(selectedTable)"
                  :class="[
                    'px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border',
                    isTableActive(selectedTable)
                      ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
                  ]"
                >
                  + Tambah
                </button>
                <button
                  @click="sendToKitchen"
                  :disabled="!allDraftChecked"
                  :class="[
                    'flex-1 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2',
                    allDraftChecked
                      ? 'bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed',
                  ]"
                >
                  <span>🔪</span>
                  <span v-if="allDraftChecked">Kirim ke Dapur ({{ draftItems.length }} item)</span>
                  <span v-else
                    >Centang semua dulu ({{ checkedCount }}/{{ draftItems.length }})</span
                  >
                </button>
              </div>
            </div>

            <!-- ── SECTION 2: Sudah di Dapur (non-draft) ── -->
            <div
              v-if="sentItems.length > 0"
              class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
            >
              <div class="flex items-center justify-between mb-4">
                <h3
                  class="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2"
                >
                  🔥 Sudah di Dapur
                  <span
                    class="text-xs font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full"
                  >
                    {{ sentItems.length }} item
                  </span>
                </h3>
                
                <!-- TOMBOL TAMBAH PESANAN (DIPERBARUI) -->
                <button
                  v-if="draftItems.length === 0"
                  @click="openMenuModal"
                  :disabled="!isTableActive(selectedTable)"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
                    isTableActive(selectedTable)
                      ? 'bg-gray-900 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  ]"
                >
                  + Tambah Pesanan
                </button>
              </div>

              <div class="space-y-2">
                <div
                  v-for="item in sentItems"
                  :key="item.id"
                  class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <span class="text-xl">{{ getMenuIcon(item.menuName) }}</span>
                      <div>
                        <h4 class="font-medium text-gray-800 dark:text-white text-sm">
                          {{ item.menuName }}
                        </h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {{ item.quantity }} porsi × Rp {{ item.price.toLocaleString() }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <p class="font-semibold text-gray-800 dark:text-white text-sm">
                        Rp {{ (item.price * item.quantity).toLocaleString() }}
                      </p>
                      <span
                        :class="getStatusBadgeClass(item.status)"
                        class="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                      >
                        {{ getStatusText(item.status) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Total & Bayar — hanya jika tidak ada draft item tersisa -->
              <div
                v-if="draftItems.length === 0"
                class="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
              >
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Total Tagihan</p>
                  <p class="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
                    Rp {{ totalAmount.toLocaleString() }}
                  </p>
                </div>
                <button
                  @click="processPayment"
                  class="bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                  💰 Bayar Sekarang
                </button>
              </div>
            </div>

            <!-- ── Empty state ── -->
            <div
              v-if="orderItems.length === 0"
              class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-gray-800 dark:text-white">
                  📋 Daftar Pesanan
                </h3>
                
                <!-- TOMBOL TAMBAH PESANAN (DIPERBARUI) -->
                <button
                  @click="openMenuModal"
                  :disabled="!isTableActive(selectedTable)"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
                    isTableActive(selectedTable)
                      ? 'bg-gray-900 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  ]"
                >
                  + Tambah Pesanan
                </button>
              </div>
              <div class="text-center py-8">
                <div class="text-4xl mb-3">🍽️</div>
                <p class="text-gray-500 dark:text-gray-400 text-sm">
                  {{ isTableActive(selectedTable) ? 'Belum ada pesanan' : 'Meja belum aktif, tidak dapat menambah pesanan' }}
                </p>
                <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  {{ isTableActive(selectedTable) ? 'Klik tombol di atas untuk menambah pesanan' : 'Silakan check-in pelanggan dari halaman Reservasi terlebih dahulu' }}
                </p>
              </div>
            </div>
          </div>

          <!-- No Table Selected -->
          <div v-else>
            <div
              class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center py-12 px-8"
            >
              <div class="text-5xl mb-4">🍽️</div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Belum Ada Meja Dipilih
              </h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                Pilih meja dari daftar di sebelah kiri untuk mulai mengelola pesanan
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Tambah Pesanan -->
    <div
      v-if="showMenuModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <div
          class="bg-gray-900 dark:bg-gray-800 rounded-t-xl px-5 py-4 sticky top-0 flex justify-between items-center"
        >
          <div>
            <h2 class="text-base font-semibold text-white">Tambah Pesanan</h2>
            <p class="text-gray-400 text-xs mt-0.5">
              Meja {{ formatTableNumber(selectedTable?.number) }}
            </p>
          </div>
          <button
            @click="closeModal"
            class="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-white"
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

        <div class="p-5">
          <div
            class="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700"
          >
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Item yang akan dipesan</p>
              <p class="text-lg font-bold text-gray-800 dark:text-white">
                {{ totalSelectedItems }} item
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="menu in menus"
              :key="menu.id"
              class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div class="flex items-start gap-3">
                <span class="text-2xl">{{ getMenuIcon(menu.name) }}</span>
                <div class="flex-1">
                  <h3 class="font-medium text-gray-800 dark:text-white text-sm">{{ menu.name }}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Rp {{ menu.price.toLocaleString() }}
                  </p>
                  <div class="mt-3">
                    <label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block"
                      >Jumlah</label
                    >
                    <input
                      v-model.number="orderQuantities[menu.id]"
                      type="number"
                      min="0"
                      class="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:border-gray-400 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 rounded-b-xl flex gap-3"
        >
          <button
            @click="closeModal"
            class="flex-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition text-sm font-medium"
          >
            Batal
          </button>
          <button
            @click="batchAddToOrder"
            :disabled="totalSelectedItems === 0"
            class="flex-1 bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            ✅ Tambahkan ({{ totalSelectedItems }} item)
          </button>
        </div>
      </div>
    </div>

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '../services/api'
import DialogCard from '../components/common/DialogCard.vue'

const activeTables = ref([])
const allTables = ref([])
const selectedTable = ref(null)
const orderItems = ref([])
const menus = ref([])
const showMenuModal = ref(false)
const orderQuantities = ref({})
const checkedDraftItems = ref({})

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

// ── Computed ──────────────────────────────────────────────────────────────────

const draftItems = computed(() => orderItems.value.filter((i) => i.status === 'draft'))
const sentItems = computed(() => orderItems.value.filter((i) => i.status !== 'draft'))

const checkedCount = computed(
  () => draftItems.value.filter((i) => checkedDraftItems.value[i.id]).length,
)
const allDraftChecked = computed(
  () => draftItems.value.length > 0 && checkedCount.value === draftItems.value.length,
)
const totalSelectedItems = computed(() =>
  Object.values(orderQuantities.value).reduce((sum, qty) => sum + (qty > 0 ? qty : 0), 0),
)
const totalAmount = computed(() =>
  orderItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

// ── Helpers ───────────────────────────────────────────────────────────────────

const isTableActive = (table) => {
  if (!table) return false
  return table.status === 'occupied' || !!table.currentOrderId
}

const formatTableNumber = (tableNumber) => {
  const idx = allTables.value.findIndex((t) => t.number === tableNumber)
  return idx >= 0 ? idx + 1 : tableNumber?.replace(/[A-Za-z]/g, '') || tableNumber
}

const getMenuIcon = (menuName) => {
  if (!menuName) return '🍽️'
  if (menuName.includes('Nasi') || menuName.includes('Mie')) return '🍚'
  if (menuName.includes('Ayam') || menuName.includes('Sate')) return '🍗'
  if (menuName.includes('Teh') || menuName.includes('Jeruk')) return '🥤'
  if (menuName.includes('Pisang')) return '🍌'
  return '🍽️'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    draft:
      'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600',
    pending:
      'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    cooking:
      'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
    ready:
      'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
    served:
      'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  }
  return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
}

const getStatusText = (status) => {
  const texts = {
    draft: 'Draft',
    pending: 'Menunggu',
    cooking: 'Dimasak',
    ready: 'Siap Antar',
    served: 'Telah Diantar',
  }
  return texts[status] || status
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

const fetchAllTables = async () => {
  try {
    allTables.value = (await api.get('/tables')).data
  } catch (e) {
    console.error(e)
  }
}

const fetchActiveTables = async () => {
  try {
    const response = await api.get('/tables?status=occupied')
    activeTables.value = response.data
    console.log('🟢 Active tables:', activeTables.value)
  } catch (e) {
    console.error('Error fetching active tables:', e)
    activeTables.value = []
  }
}

const fetchMenus = async () => {
  try {
    menus.value = (await api.get('/menus')).data
  } catch (e) {
    console.error(e)
  }
}

const fetchOrderItems = async (tableId) => {
  try {
    const ordersRes = await api.get(`/orders?tableId=${tableId}`)
    const activeOrder = ordersRes.data.find((o) =>
      ['draft', 'pending', 'cooking', 'ready'].includes(o.status),
    )

    if (activeOrder) {
      selectedTable.value.currentOrderId = activeOrder.id
      const items = (await api.get(`/orderItems?orderId=${activeOrder.id}`)).data
      const mapped = items.map((item) => ({
        ...item,
        menuName: menus.value.find((m) => m.id === item.menuId)?.name || 'Unknown',
      }))
      orderItems.value = mapped

      const existingIds = new Set(mapped.map((i) => i.id))
      mapped.forEach((item) => {
        if (item.status === 'draft' && checkedDraftItems.value[item.id] === undefined) {
          checkedDraftItems.value[item.id] = false
        }
      })
      Object.keys(checkedDraftItems.value).forEach((id) => {
        if (!existingIds.has(parseInt(id))) delete checkedDraftItems.value[id]
      })
    } else {
      orderItems.value = []
      checkedDraftItems.value = {}
      selectedTable.value.currentOrderId = null
    }
  } catch (e) {
    console.error('Error fetching order items:', e)
    orderItems.value = []
  }
}

const selectTable = async (table) => {
  selectedTable.value = { ...table }
  checkedDraftItems.value = {}
  await fetchOrderItems(table.id)
}

// ── Refresh Functions ────────────────────────────────────────────────────────

const refreshAllData = async () => {
  console.log('🔄 Refreshing orders data...')
  await fetchAllTables()
  await fetchActiveTables()
  if (selectedTable.value) {
    await fetchOrderItems(selectedTable.value.id)
  }
}

// ── Actions ───────────────────────────────────────────────────────────────────

const toggleCheck = (itemId) => {
  checkedDraftItems.value = {
    ...checkedDraftItems.value,
    [itemId]: !checkedDraftItems.value[itemId],
  }
}

const getOrCreateOrder = async () => {
  let orderId = selectedTable.value.currentOrderId
  if (!orderId) {
    const res = await api.post('/orders', {
      tableId: selectedTable.value.id,
      status: 'draft',
      orderTime: new Date().toISOString(),
      totalAmount: 0,
    })
    orderId = res.data.id
    selectedTable.value.currentOrderId = orderId
    await api.patch(`/tables/${selectedTable.value.id}`, { currentOrderId: orderId })
    await fetchActiveTables()
  }
  return orderId
}

const batchAddToOrder = async () => {
  const itemsToAdd = Object.entries(orderQuantities.value)
    .filter(([, qty]) => qty > 0)
    .map(([menuId, quantity]) => ({ menuId: parseInt(menuId), quantity }))
  if (itemsToAdd.length === 0) return

  try {
    const orderId = await getOrCreateOrder()
    for (const item of itemsToAdd) {
      const menu = menus.value.find((m) => m.id === item.menuId)
      if (!menu) continue
      await api.post('/orderItems', {
        orderId,
        menuId: item.menuId,
        quantity: item.quantity,
        price: menu.price,
        status: 'draft',
        notes: '',
      })
    }
    await fetchOrderItems(selectedTable.value.id)
    orderQuantities.value = {}
    closeModal()
    showDialog({
      type: 'success',
      title: '✅ Pesanan Ditambahkan!',
      message: `${itemsToAdd.length} menu ditambahkan. Verifikasi bersama pelanggan sebelum mengirim ke dapur.`,
      confirmText: 'OK',
    })
  } catch (e) {
    console.error(e)
    showDialog({
      type: 'error',
      title: 'Gagal',
      message: 'Terjadi kesalahan. Silakan coba lagi.',
      confirmText: 'OK',
    })
  }
}

const sendToKitchen = async () => {
  if (!allDraftChecked.value) return
  const count = draftItems.value.length
  showDialog({
    type: 'confirm',
    title: '🔪 Kirim ke Dapur?',
    message: `${count} item sudah diverifikasi bersama pelanggan dan siap dikirim ke dapur.`,
    confirmText: 'Ya, Kirim',
    onConfirm: async () => {
      dialog.value.isOpen = false
      try {
        for (const item of draftItems.value) {
          await api.patch(`/orderItems/${item.id}`, { status: 'pending' })
        }
        if (selectedTable.value.currentOrderId) {
          await api.patch(`/orders/${selectedTable.value.currentOrderId}`, { status: 'pending' })
        }
        checkedDraftItems.value = {}
        await fetchOrderItems(selectedTable.value.id)
        // Trigger event untuk Kitchen
        window.dispatchEvent(new CustomEvent('order-sent-to-kitchen'))
        showDialog({
          type: 'success',
          title: '✅ Pesanan Dikirim!',
          message: `${count} item berhasil dikirim ke dapur.`,
          confirmText: 'OK',
        })
      } catch (e) {
        console.error(e)
        showDialog({
          type: 'error',
          title: 'Gagal',
          message: 'Terjadi kesalahan. Silakan coba lagi.',
          confirmText: 'OK',
        })
      }
    },
  })
}

const openMenuModal = () => {
  // Proteksi tambahan: jangan buka modal jika meja tidak aktif
  if (!isTableActive(selectedTable.value)) {
    showDialog({
      type: 'warning',
      title: 'Meja Tidak Aktif',
      message: 'Meja ini belum di-check-in oleh pelanggan. Silakan check-in dari halaman Reservasi terlebih dahulu.',
      confirmText: 'Mengerti',
    })
    return
  }
  orderQuantities.value = {}
  showMenuModal.value = true
}

const closeModal = () => {
  orderQuantities.value = {}
  showMenuModal.value = false
}

const processPayment = async () => {
  showDialog({
    type: 'confirm',
    title: '💰 Konfirmasi Pembayaran',
    message: `Total tagihan: Rp ${totalAmount.value.toLocaleString()}\n\nLanjutkan pembayaran?`,
    confirmText: 'Ya, Bayar',
    onConfirm: async () => {
      dialog.value.isOpen = false
      try {
        await api.patch(`/orders/${selectedTable.value.currentOrderId}`, {
          status: 'completed',
          totalAmount: totalAmount.value,
          paymentTime: new Date().toISOString(),
        })
        await api.patch(`/tables/${selectedTable.value.id}`, {
          status: 'cleaning',
          currentOrderId: null,
        })
        showDialog({
          type: 'success',
          title: '✅ Pembayaran Berhasil!',
          message: `Pembayaran Rp ${totalAmount.value.toLocaleString()} diterima. Meja akan segera dibersihkan.`,
          confirmText: 'OK',
        })
        await fetchActiveTables()
        selectedTable.value = null
        orderItems.value = []
        checkedDraftItems.value = {}
      } catch (e) {
        console.error(e)
        showDialog({
          type: 'error',
          title: 'Pembayaran Gagal',
          message: 'Terjadi kesalahan. Silakan coba lagi.',
          confirmText: 'OK',
        })
      }
    },
  })
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(() => {
  fetchAllTables()
  fetchActiveTables()
  fetchMenus()
  
  // Listen untuk event dari Reservations.vue (check-in)
  window.addEventListener('order-created', refreshAllData)
})

onUnmounted(() => {
  window.removeEventListener('order-created', refreshAllData)
})
</script>