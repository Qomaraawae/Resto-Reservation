import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Gunakan ref agar reactive
  const isDark = ref(false)

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
    console.log('Theme initialized:', isDark.value ? 'dark' : 'light') // Debug
  }

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      console.log('Applied dark mode') // Debug
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      console.log('Applied light mode') // Debug
    }
  }

  const toggleDarkMode = () => {
    console.log('Toggling from:', isDark.value ? 'dark' : 'light') // Debug
    isDark.value = !isDark.value
    console.log('Toggled to:', isDark.value ? 'dark' : 'light') // Debug
    applyTheme()
  }

  // Watch untuk memastikan perubahan
  watch(isDark, (newValue) => {
    console.log('isDark changed to:', newValue ? 'dark' : 'light')
    applyTheme()
  })

  return {
    isDark,
    initTheme,
    toggleDarkMode
  }
})
