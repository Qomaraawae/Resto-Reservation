import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])
  const currentOrder = ref(null)
  const loading = ref(false)

  const fetchOrders = async () => {
    loading.value = true
    try {
      const response = await api.get('/orders')
      orders.value = response.data
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      loading.value = false
    }
  }

  const getDraftItems = async (orderId) => {
    try {
      const response = await api.get(`/orderItems?orderId=${orderId}&status=draft`)
      return response.data
    } catch (error) {
      console.error('Error fetching draft items:', error)
      return []
    }
  }

  const getPendingItems = async (orderId) => {
    try {
      const response = await api.get(`/orderItems?orderId=${orderId}&status=pending`)
      return response.data
    } catch (error) {
      console.error('Error fetching pending items:', error)
      return []
    }
  }

  const verifyItem = async (itemId, verified) => {
    try {
      // Update status dari draft ke pending setelah diverifikasi
      const response = await api.patch(`/orderItems/${itemId}`, { 
        status: 'pending',
        verifiedAt: new Date().toISOString()
    })
      return response.data
    } catch (error) {
      console.error('Error verifying item:', error)
      throw error
    }
  }

  const sendToKitchen = async (orderId, itemIds) => {
    try {
      // Batch update semua item dari draft ke pending
      const promises = itemIds.map(itemId => 
        api.patch(`/orderItems/${itemId}`, { 
          status: 'pending',
          sentToKitchenAt: new Date().toISOString()
      }))
      await Promise.all(promises)
    
      // Update order status jika perlu
      await api.patch(`/orders/${orderId}`, { 
        status: 'pending',
        lastUpdate: new Date().toISOString()
      })
    
      return true
    } catch (error) {
      console.error('Error sending to kitchen:', error)
      throw error
    }
  }

  const hasDraftItems = async (orderId) => {
    const draftItems = await getDraftItems(orderId)
    return draftItems.length > 0
  }

  const fetchOrderById = async (id) => {
    loading.value = true
    try {
      const response = await api.get(`/orders/${id}`)
      currentOrder.value = response.data
      return response.data
    } catch (error) {
      console.error('Error fetching order:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const createOrder = async (orderData) => {
    loading.value = true
    try {
      const response = await api.post('/orders', {
        ...orderData,
        orderTime: new Date().toISOString(),
        status: 'pending'
      })
      await fetchOrders()
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}`, { status })
      await fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getOrdersByTable = (tableId) => {
    return orders.value.filter(order => order.tableId === tableId && order.status !== 'completed')
  }

  const activeOrders = computed(() => {
    return orders.value.filter(order => ['pending', 'cooking', 'ready'].includes(order.status))
  })

  const pendingOrders = computed(() => {
    return orders.value.filter(order => order.status === 'pending')
  })

  const cookingOrders = computed(() => {
    return orders.value.filter(order => order.status === 'cooking')
  })

  const readyOrders = computed(() => {
    return orders.value.filter(order => order.status === 'ready')
  })

  return {
    orders,
    currentOrder,
    loading,
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    getOrdersByTable,
    activeOrders,
    pendingOrders,
    cookingOrders,
    readyOrders,
    getDraftItems,
    getPendingItems,
    verifyItem,
    sendToKitchen,
    hasDraftItems
  }
})
