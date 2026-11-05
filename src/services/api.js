import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000
})

export default api

// Table APIs
export const tableAPI = {
  getAll: () => api.get('/tables'),
  getById: (id) => api.get(`/tables/${id}`),
  update: (id, data) => api.patch(`/tables/${id}`, data),
  updateStatus: (id, status) => api.patch(`/tables/${id}`, { status })
}

// Reservation APIs
export const reservationAPI = {
  getAll: () => api.get('/reservations'),
  create: (data) => api.post('/reservations', data),
  update: (id, data) => api.patch(`/reservations/${id}`, data),
  delete: (id) => api.delete(`/reservations/${id}`)
}

// Menu APIs
export const menuAPI = {
  getAll: () => api.get('/menus'),
  getByCategory: (category) => api.get(`/menus?category=${category}`)
}

// Order APIs
export const orderAPI = {
  getAll: () => api.get('/orders'),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.patch(`/orders/${id}`, data),
  getItems: (orderId) => api.get(`/orderItems?orderId=${orderId}`),
  addItem: (data) => api.post('/orderItems', data),
  // Fungsi baru untuk batch update
  updateMultipleItems: (updates) => {
    // Karena json-server tidak support batch update, kita lakukan sequential
    const promises = updates.map(update => 
      api.patch(`/orderItems/${update.id}`, update.data)
    )
    return Promise.all(promises)
  },
  // Fungsi untuk update status item
  updateItemStatus: (itemId, status) => 
    api.patch(`/orderItems/${itemId}`, { status })
}
