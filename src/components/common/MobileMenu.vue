<template>
  <div class="relative">
    <!-- Hamburger Button -->
    <button
      @click="isOpen = !isOpen"
      class="inline-flex items-center justify-center p-2 rounded-lg transition-colors bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
      aria-label="Menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Mobile Menu Dropdown - Full Width Overlay -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed top-14 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 border-b border-gray-200 dark:border-gray-700"
      >
        <div class="py-2">
          <router-link
            to="/"
            @click="isOpen = false"
            class="flex items-center px-6 py-4 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            active-class="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
          >
            <span class="text-xl mr-3">🏠</span>
            <span class="font-medium">Dashboard</span>
          </router-link>

          <router-link
            to="/reservations"
            @click="isOpen = false"
            class="flex items-center px-6 py-4 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            active-class="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
          >
            <span class="text-xl mr-3">📅</span>
            <span class="font-medium">Reservasi</span>
          </router-link>

          <router-link
            to="/orders"
            @click="isOpen = false"
            class="flex items-center px-6 py-4 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            active-class="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
          >
            <span class="text-xl mr-3">🛒</span>
            <span class="font-medium">Pesanan</span>
          </router-link>

          <router-link
            to="/kitchen"
            @click="isOpen = false"
            class="flex items-center px-6 py-4 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            active-class="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
          >
            <span class="text-xl mr-3">🔥</span>
            <span class="font-medium">Dapur</span>
          </router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const isOpen = ref(false)

// Tutup menu saat klik di luar (opsional)
const handleClickOutside = (event) => {
  if (isOpen.value && !event.target.closest('.relative')) {
    isOpen.value = false
  }
}

watch(isOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>
