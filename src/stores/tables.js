import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useTablesStore = defineStore('tables', () => {
  const tables = ref([])
  const loading = ref(false)

  const fetchTables = async () => {
    loading.value = true
    try {
      const response = await api.get('/tables')
      tables.value = response.data
    } catch (error) {
      console.error('Error fetching tables:', error)
    } finally {
      loading.value = false
    }
  }

  const updateTableStatus = async (tableId, newStatus) => {
    try {
      // Panggil API terlebih dahulu
      const response = await api.patch(`/tables/${tableId}`, { status: newStatus })
      
      // Update state lokal dengan data terbaru dari API
      const tableIndex = tables.value.findIndex(t => t.id === tableId)
      if (tableIndex !== -1) {
        tables.value[tableIndex].status = newStatus
      }
      
      return response.data
    } catch (error) {
      console.error('Error updating table status:', error)
      throw error
    }
  }

  const getTableStatusColor = (status) => {
    const colors = {
      available: 'bg-green-500 hover:bg-green-600',
      reserved: 'bg-yellow-500 hover:bg-yellow-600',
      occupied: 'bg-red-500 hover:bg-red-600',
      cleaning: 'bg-gray-400 hover:bg-gray-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getTableStatusText = (status) => {
    const texts = {
      available: 'Tersedia',
      reserved: 'Dipesan',
      occupied: 'Terisi',
      cleaning: 'Dibersihkan'
    }
    return texts[status] || status
  }

  return {
    tables,
    loading,
    fetchTables,
    updateTableStatus,
    getTableStatusColor,
    getTableStatusText
  }
})