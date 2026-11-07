import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ 
    error: err.message,
    stack: err.stack 
  })
})

// ============ HELPER FUNCTIONS ============
// Filter field yang diizinkan untuk Table
const filterTableFields = (data) => {
  const allowedFields = ['number', 'capacity', 'status', 'section', 'notes', 'currentOrderId']
  const filtered = {}
  Object.keys(data).forEach(key => {
    if (allowedFields.includes(key)) {
      filtered[key] = data[key]
    }
  })
  return filtered
}

// Helper function untuk menangani status_ne filter
const buildStatusFilter = (status_ne) => {
  if (!status_ne) return {}
  
  // Jika status_ne adalah array
  if (Array.isArray(status_ne)) {
    return { status: { notIn: status_ne } }
  }
  
  // Jika status_ne adalah string dengan koma
  if (status_ne.includes(',')) {
    const statuses = status_ne.split(',').map(s => s.trim())
    return { status: { notIn: statuses } }
  }
  
  // Jika status_ne adalah string tunggal
  return { status: { not: status_ne } }
}

// ============ TABLES ROUTES ============
app.get('/tables', async (req, res) => {
  try {
    const tables = await prisma.table.findMany()
    res.json(tables)
  } catch (error) {
    console.error('GET /tables error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.get('/tables/:id', async (req, res) => {
  try {
    const table = await prisma.table.findUnique({
      where: { id: Number(req.params.id) }
    })
    if (!table) return res.status(404).json({ error: 'Table not found' })
    res.json(table)
  } catch (error) {
    console.error('GET /tables/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/tables', async (req, res) => {
  try {
    const filteredData = filterTableFields(req.body)
    const table = await prisma.table.create({
      data: filteredData
    })
    res.status(201).json(table)
  } catch (error) {
    console.error('POST /tables error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.put('/tables/:id', async (req, res) => {
  try {
    const filteredData = filterTableFields(req.body)
    const table = await prisma.table.update({
      where: { id: Number(req.params.id) },
      data: filteredData
    })
    res.json(table)
  } catch (error) {
    console.error('PUT /tables/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.patch('/tables/:id', async (req, res) => {
  try {
    const filteredData = filterTableFields(req.body)
    const table = await prisma.table.update({
      where: { id: Number(req.params.id) },
      data: filteredData
    })
    res.json(table)
  } catch (error) {
    console.error('PATCH /tables/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.delete('/tables/:id', async (req, res) => {
  try {
    await prisma.table.delete({
      where: { id: Number(req.params.id) }
    })
    res.status(204).send()
  } catch (error) {
    console.error('DELETE /tables/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============ RESERVATIONS ROUTES ============
app.get('/reservations', async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { table: true },
      orderBy: { date: 'desc' }
    })
    res.json(reservations)
  } catch (error) {
    console.error('GET /reservations error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.get('/reservations/:id', async (req, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(req.params.id) },
      include: { table: true }
    })
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' })
    res.json(reservation)
  } catch (error) {
    console.error('GET /reservations/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/reservations', async (req, res) => {
  try {
    console.log('Received reservation data:', req.body)
    
    const {
      name,
      phone,
      numberOfPeople,
      date,
      time,
      tableId,
      status,
      notes,
      customerEmail
    } = req.body
    
    if (!tableId || !name || !date || !time || !numberOfPeople) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['tableId', 'name', 'date', 'time', 'numberOfPeople'],
        received: req.body
      })
    }

    let formattedTime = time
    if (time && !time.includes(':')) {
      formattedTime = `${time}:00`
    }

    const reservation = await prisma.reservation.create({
      data: {
        tableId: Number(tableId),
        customerName: name,
        customerPhone: phone || null,
        customerEmail: customerEmail || null,
        date: new Date(date),
        time: formattedTime,
        partySize: Number(numberOfPeople),
        status: status || 'pending',
        notes: notes || null
      },
      include: { table: true }
    })
    res.status(201).json(reservation)
  } catch (error) {
    console.error('POST /reservations error:', error)
    res.status(500).json({ 
      error: error.message,
      details: error.meta || 'No additional details'
    })
  }
})

app.put('/reservations/:id', async (req, res) => {
  try {
    const reservation = await prisma.reservation.update({
      where: { id: Number(req.params.id) },
      data: {
        ...req.body,
        tableId: req.body.tableId ? Number(req.body.tableId) : undefined,
        partySize: req.body.partySize ? Number(req.body.partySize) : undefined
      },
      include: { table: true }
    })
    res.json(reservation)
  } catch (error) {
    console.error('PUT /reservations/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.patch('/reservations/:id', async (req, res) => {
  try {
    const reservation = await prisma.reservation.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: { table: true }
    })
    res.json(reservation)
  } catch (error) {
    console.error('PATCH /reservations/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.delete('/reservations/:id', async (req, res) => {
  try {
    await prisma.reservation.delete({
      where: { id: Number(req.params.id) }
    })
    res.status(204).send()
  } catch (error) {
    console.error('DELETE /reservations/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============ ORDERS ROUTES ============
app.get('/orders', async (req, res) => {
  try {
    const { status_ne, tableId } = req.query
    const where = {}
    
    // Gunakan helper function untuk status filter
    const statusFilter = buildStatusFilter(status_ne)
    Object.assign(where, statusFilter)
    
    if (tableId) {
      where.tableId = Number(tableId)
    }
    
    const orders = await prisma.order.findMany({
      where,
      include: {
        table: true,
        orderItems: {
          include: { menu: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(orders)
  } catch (error) {
    console.error('GET /orders error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Endpoint optimal: Ambil pesanan aktif + item + menu sekaligus
app.get('/orders/active/:tableId', async (req, res) => {
  try {
    const tableId = Number(req.params.tableId)
    
    const activeOrder = await prisma.order.findFirst({
      where: {
        tableId: tableId,
        status: { in: ['draft', 'pending', 'cooking', 'ready'] }
      },
      include: {
        table: true,
        orderItems: {
          include: {
            menu: true
          }
        }
      }
    })

    if (!activeOrder) {
      return res.json({ order: null, items: [] })
    }

    res.json({ 
      order: activeOrder, 
      items: activeOrder.orderItems 
    })
  } catch (error) {
    console.error('GET /orders/active/:tableId error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.get('/orders/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        table: true,
        orderItems: {
          include: { menu: true }
        }
      }
    })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (error) {
    console.error('GET /orders/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/orders', async (req, res) => {
  try {
    console.log('Received order data:', req.body)
    
    const { 
      tableId, 
      status, 
      totalAmount, 
      orderTime, 
      orderNumber,
      notes
    } = req.body
    
    if (!tableId) {
      return res.status(400).json({ error: 'Missing required field: tableId' })
    }

    const finalOrderNumber = orderNumber || `ORD-${Date.now()}`

    // Buat order
    const order = await prisma.order.create({
      data: {
        tableId: Number(tableId),
        orderNumber: finalOrderNumber,
        status: status || 'draft',
        total: Number(totalAmount) || 0,
        subtotal: Number(totalAmount) || 0,
        tax: 0,
        discount: 0,
        notes: notes || null
      },
      include: {
        table: true,
        orderItems: {
          include: { menu: true }
        }
      }
    })

    // Update table status ke occupied dan simpan currentOrderId
    await prisma.table.update({
      where: { id: Number(tableId) },
      data: { 
        status: 'occupied',
        currentOrderId: order.id 
      }
    })

    res.status(201).json(order)
  } catch (error) {
    console.error('POST /orders error:', error)
    res.status(500).json({ 
      error: error.message,
      details: error.meta || 'No additional details'
    })
  }
})

app.put('/orders/:id', async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: {
        ...req.body,
        tableId: req.body.tableId ? Number(req.body.tableId) : undefined
      },
      include: {
        table: true,
        orderItems: {
          include: { menu: true }
        }
      }
    })
    res.json(order)
  } catch (error) {
    console.error('PUT /orders/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.patch('/orders/:id', async (req, res) => {
  try {
    console.log('PATCH order data:', req.body)
    
    const { status, totalAmount, notes } = req.body
    const data = {}
    
    if (status !== undefined) data.status = status
    if (totalAmount !== undefined) data.total = Number(totalAmount)
    if (notes !== undefined) data.notes = notes
    
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data,
      include: {
        table: true,
        orderItems: {
          include: { menu: true }
        }
      }
    })
    res.json(order)
  } catch (error) {
    console.error('PATCH /orders/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.delete('/orders/:id', async (req, res) => {
  try {
    await prisma.order.delete({
      where: { id: Number(req.params.id) }
    })
    res.status(204).send()
  } catch (error) {
    console.error('DELETE /orders/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============ MENUS ROUTES ============
app.get('/menus', async (req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(menus)
  } catch (error) {
    console.error('GET /menus error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.get('/menus/:id', async (req, res) => {
  try {
    const menu = await prisma.menu.findUnique({
      where: { id: Number(req.params.id) }
    })
    if (!menu) return res.status(404).json({ error: 'Menu not found' })
    res.json(menu)
  } catch (error) {
    console.error('GET /menus/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/menus', async (req, res) => {
  try {
    const menu = await prisma.menu.create({
      data: req.body
    })
    res.status(201).json(menu)
  } catch (error) {
    console.error('POST /menus error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.put('/menus/:id', async (req, res) => {
  try {
    const menu = await prisma.menu.update({
      where: { id: Number(req.params.id) },
      data: req.body
    })
    res.json(menu)
  } catch (error) {
    console.error('PUT /menus/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.patch('/menus/:id', async (req, res) => {
  try {
    const menu = await prisma.menu.update({
      where: { id: Number(req.params.id) },
      data: req.body
    })
    res.json(menu)
  } catch (error) {
    console.error('PATCH /menus/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.delete('/menus/:id', async (req, res) => {
  try {
    await prisma.menu.delete({
      where: { id: Number(req.params.id) }
    })
    res.status(204).send()
  } catch (error) {
    console.error('DELETE /menus/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============ ORDER ITEMS ROUTES ============
app.get('/orderItems', async (req, res) => {
  try {
    const { status_ne, orderId } = req.query
    const where = {}
    
    // Gunakan helper function untuk status filter
    const statusFilter = buildStatusFilter(status_ne)
    Object.assign(where, statusFilter)
    
    if (orderId) {
      where.orderId = Number(orderId)
    }
    
    const orderItems = await prisma.orderItem.findMany({
      where,
      include: {
        order: true,
        menu: true
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(orderItems)
  } catch (error) {
    console.error('GET /orderItems error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.get('/orderItems/:id', async (req, res) => {
  try {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        order: true,
        menu: true
      }
    })
    if (!orderItem) return res.status(404).json({ error: 'Order item not found' })
    res.json(orderItem)
  } catch (error) {
    console.error('GET /orderItems/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/orderItems', async (req, res) => {
  try {
    console.log('Received orderItem data:', req.body)
    
    const { orderId, menuId, quantity, price, status, notes } = req.body
    
    // Validasi required fields
    if (!orderId || !menuId || !quantity || price === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['orderId', 'menuId', 'quantity', 'price'],
        received: req.body
      })
    }

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: Number(orderId),
        menuId: Number(menuId),
        quantity: Number(quantity),
        price: Number(price),
        subtotal: Number(quantity) * Number(price),
        status: status || 'pending',
        notes: notes || null
      },
      include: {
        order: true,
        menu: true
      }
    })
    res.status(201).json(orderItem)
  } catch (error) {
    console.error('POST /orderItems error:', error)
    res.status(500).json({ 
      error: error.message,
      details: error.meta || 'No additional details'
    })
  }
})

app.patch('/orderItems/:id', async (req, res) => {
  try {
    console.log('PATCH orderItem data:', req.body)
    
    const { status, notes, quantity, price, subtotal } = req.body
    const data = {}
    
    if (status !== undefined) data.status = status
    if (notes !== undefined) data.notes = notes
    if (quantity !== undefined) data.quantity = Number(quantity)
    if (price !== undefined) data.price = Number(price)
    if (subtotal !== undefined) data.subtotal = Number(subtotal)
    
    const orderItem = await prisma.orderItem.update({
      where: { id: Number(req.params.id) },
      data,
      include: {
        order: true,
        menu: true
      }
    })
    res.json(orderItem)
  } catch (error) {
    console.error('PATCH /orderItems/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.delete('/orderItems/:id', async (req, res) => {
  try {
    await prisma.orderItem.delete({
      where: { id: Number(req.params.id) }
    })
    res.status(204).send()
  } catch (error) {
    console.error('DELETE /orderItems/:id error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============ REPORT ROUTES ============
app.get('/reports/summary', async (req, res) => {
  try {
    const { startDate, endDate, period } = req.query
    
    let dateFilter = {}
    
    // Filter berdasarkan periode
    if (period === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      dateFilter = {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    } else if (period === 'week') {
      const today = new Date()
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      dateFilter = {
        createdAt: {
          gte: weekAgo,
          lte: today
        }
      }
    } else if (period === 'month') {
      const today = new Date()
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      dateFilter = {
        createdAt: {
          gte: monthAgo,
          lte: today
        }
      }
    } else if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }
    }
    
    // Ambil orders yang sudah selesai (completed atau served)
    const where = {
      status: { in: ['completed', 'served'] },
      ...dateFilter
    }
    
    const orders = await prisma.order.findMany({
      where,
      include: {
        table: true,
        orderItems: {
          include: { menu: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Hitung statistik
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const totalOrders = orders.length
    const totalItems = orders.reduce((sum, o) => {
      return sum + o.orderItems.reduce((s, i) => s + i.quantity, 0)
    }, 0)
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    // Hitung top menu
    const menuSales = {}
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (!menuSales[item.menuId]) {
          menuSales[item.menuId] = {
            id: item.menuId,
            name: item.menu?.name || 'Unknown',
            totalSold: 0,
            totalRevenue: 0
          }
        }
        menuSales[item.menuId].totalSold += item.quantity
        menuSales[item.menuId].totalRevenue += item.price * item.quantity
      })
    })
    
    const topMenus = Object.values(menuSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10)
    
    // Chart data per hari (7 hari terakhir)
    const chartData = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const nextD = new Date(d)
      nextD.setDate(nextD.getDate() + 1)
      
      const dayOrders = orders.filter(o => {
        const oDate = new Date(o.createdAt)
        return oDate >= d && oDate < nextD
      })
      
      const dayTotal = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      const dayCount = dayOrders.length
      
      chartData.push({
        label: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        total: dayTotal,
        count: dayCount,
        date: d.toISOString().split('T')[0]
      })
    }
    
    res.json({
      summary: {
        totalRevenue,
        totalOrders,
        totalItems,
        averageOrder
      },
      topMenus,
      chartData,
      orders: orders.slice(0, 100) // batasi 100 data terakhir
    })
    
  } catch (error) {
    console.error('GET /reports/summary error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Endpoint untuk export CSV
app.get('/reports/export', async (req, res) => {
  try {
    const { startDate, endDate, period } = req.query
    
    let dateFilter = {}
    
    if (period === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      dateFilter = {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    } else if (period === 'week') {
      const today = new Date()
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      dateFilter = {
        createdAt: {
          gte: weekAgo,
          lte: today
        }
      }
    } else if (period === 'month') {
      const today = new Date()
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      dateFilter = {
        createdAt: {
          gte: monthAgo,
          lte: today
        }
      }
    } else if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }
    }
    
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ['completed', 'served'] },
        ...dateFilter
      },
      include: {
        table: true,
        orderItems: {
          include: { menu: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Format CSV
    let csv = 'No,Order ID,Meja,Total Items,Total Harga,Status,Tanggal\n'
    orders.forEach((order, index) => {
      const totalItems = order.orderItems.reduce((s, i) => s + i.quantity, 0)
      csv += `${index + 1},${order.orderNumber},${order.table?.number || 'Unknown'},${totalItems},${order.total},${order.status},${new Date(order.createdAt).toLocaleString()}\n`
    })
    
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename=laporan_${new Date().toISOString().split('T')[0]}.csv`)
    res.send(csv)
    
  } catch (error) {
    console.error('GET /reports/export error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============ EXPORT FOR VERCEL ============
export default app

// ============ START SERVER (LOKAL ONLY) ============
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📊 Prisma Studio: npx prisma studio`)
  })
}