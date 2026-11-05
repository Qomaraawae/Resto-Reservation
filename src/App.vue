<template>
  <div
    id="app"
    class="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-300"
  >
    <nav
      class="bg-white dark:bg-secondary-800 shadow-sm sticky top-0 z-40 transition-colors duration-300 border-b border-secondary-200 dark:border-secondary-700"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14">
          <div class="flex items-center space-x-3">
            <button
              @click="openSidebar"
              class="md:hidden inline-flex items-center justify-center p-2 rounded-lg transition-colors bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-200 hover:bg-secondary-200 dark:hover:bg-secondary-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
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

            <h1 class="text-base sm:text-xl font-semibold text-secondary-900 dark:text-white">
              RestoReserve
            </h1>
          </div>

          <div class="hidden md:flex md:space-x-6">
            <router-link
              to="/"
              class="px-3 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-200 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-500 transition"
              active-class="text-primary-600 dark:text-primary-400 border-primary-500"
            >Dashboard</router-link>
            <router-link
              to="/reservations"
              class="px-3 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-200 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-500 transition"
              active-class="text-primary-600 dark:text-primary-400 border-primary-500"
            >Reservasi</router-link>
            <router-link
              to="/orders"
              class="px-3 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-200 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-500 transition"
              active-class="text-primary-600 dark:text-primary-400 border-primary-500"
            >Pesanan</router-link>
            <router-link
              to="/kitchen"
              class="px-3 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-200 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-500 transition"
              active-class="text-primary-600 dark:text-primary-400 border-primary-500"
            >Dapur</router-link>
            <router-link
              to="/reports"
              class="px-3 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-200 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-500 transition"
              active-class="text-primary-600 dark:text-primary-400 border-primary-500"
            >Laporan</router-link>
          </div>

          <div class="flex items-center space-x-2">
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>

    <router-view />

    <Sidebar ref="sidebarRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DarkModeToggle from './components/common/DarkModeToggle.vue'
import Sidebar from './components/common/Sidebar.vue'

const sidebarRef = ref(null)
const openSidebar = () => sidebarRef.value?.openSidebar()
</script>