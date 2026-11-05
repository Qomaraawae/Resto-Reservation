import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useReservationsStore = defineStore('reservations', () => {
  const reservations = ref([])
  const loading = ref(false)

  const fetchReservations = async () => {
    loading.value = true
    try {
      const response = await api.get('/reservations')
      reservations.value = response.data
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      loading.value = false
    }
  }

  const createReservation = async (reservationData) => {
    loading.value = true
    try {
      const response = await api.post('/reservations', {
        ...reservationData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      })
      await fetchReservations()
      return response.data
    } catch (error) {
      console.error('Error creating reservation:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateReservation = async (id, data) => {
    try {
      await api.patch(`/reservations/${id}`, data)
      await fetchReservations()
    } catch (error) {
      console.error('Error updating reservation:', error)
    }
  }

  const deleteReservation = async (id) => {
    try {
      await api.delete(`/reservations/${id}`)
      await fetchReservations()
    } catch (error) {
      console.error('Error deleting reservation:', error)
    }
  }

  const checkIn = async (reservation) => {
    try {
      // Update table status to occupied
      await api.patch(`/tables/${reservation.tableId}`, {
        status: 'occupied'
      })
      
      // Delete reservation
      await deleteReservation(reservation.id)
      
      return true
    } catch (error) {
      console.error('Error checking in:', error)
      throw error
    }
  }

  const getReservationsByDate = (date) => {
    return reservations.value.filter(res => res.date === date)
  }

  const getReservationsByTable = (tableId) => {
    return reservations.value.filter(res => res.tableId === tableId)
  }

  return {
    reservations,
    loading,
    fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    checkIn,
    getReservationsByDate,
    getReservationsByTable
  }
})
