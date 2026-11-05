// Format currency to IDR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Format date to Indonesian format
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Format time
export const formatTime = (timeString) => {
  const date = new Date(timeString)
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format datetime
export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString)
  return `${formatDate(dateTimeString)} ${formatTime(dateTimeString)}`
}

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    available: 'green',
    reserved: 'yellow',
    occupied: 'red',
    cleaning: 'gray',
    draft: 'gray',
    pending: 'yellow',
    cooking: 'orange',
    ready: 'green',
    served: 'blue',
    completed: 'gray'
  }
  return colors[status] || 'gray'
}

// Get status text
export const getStatusText = (status) => {
  const texts = {
    available: 'Tersedia',
    reserved: 'Dipesan',
    occupied: 'Terisi',
    cleaning: 'Dibersihkan',
    draft: 'Draft',
    pending: 'Menunggu',
    cooking: 'Dimasak',
    ready: 'Siap Antar',
    served: 'Telah Diantar',
    completed: 'Selesai'
  }
  return texts[status] || status
}

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

// Calculate total from items
export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}

// Group by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key]
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {})
}
