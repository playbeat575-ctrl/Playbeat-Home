import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 86400000)

  const [orders, prevOrders, customers, prevCustomers, products, allOrders, allUsers] = await Promise.all([
    db.order.findMany({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.order.findMany({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    db.user.findMany({ where: { role: 'customer', createdAt: { gte: thirtyDaysAgo } } }),
    db.user.findMany({ where: { role: 'customer', createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    db.product.findMany(),
    db.order.findMany(),
    db.user.findMany({ where: { role: 'customer' } }),
  ])

  const revenue = orders.reduce((n, o) => n + o.total, 0)
  const prevRevenue = prevOrders.reduce((n, o) => n + o.total, 0)
  const revenueChange = prevRevenue ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : 100
  const ordersChange = prevOrders.length ? Math.round(((orders.length - prevOrders.length) / prevOrders.length) * 100) : 100
  const customersChange = prevCustomers.length ? Math.round(((customers.length - prevCustomers.length) / prevCustomers.length) * 100) : 100
  const conversion = allUsers.length ? Math.round((allOrders.length / allUsers.length) * 1000) / 10 : 0

  // Revenue series — last 12 months
  const months: { label: string; value: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const monthOrders = allOrders.filter((o) => o.createdAt >= d && o.createdAt < end)
    months.push({
      label: d.toLocaleString('en-US', { month: 'short' }),
      value: Math.round(monthOrders.reduce((n, o) => n + o.total, 0)),
    })
  }

  // Weekly series — last 8 weeks
  const weeks: { label: string; value: number }[] = []
  for (let i = 7; i >= 0; i--) {
    const start = new Date(now.getTime() - (i + 1) * 7 * 86400000)
    const end = new Date(now.getTime() - i * 7 * 86400000)
    const weekOrders = allOrders.filter((o) => o.createdAt >= start && o.createdAt < end)
    weeks.push({
      label: `W${8 - i}`,
      value: weekOrders.length,
    })
  }

  // Customer growth — cumulative by month (last 8 months)
  const growth: { label: string; value: number }[] = []
  let cumulative = 0
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const added = allUsers.filter((u) => u.createdAt >= d && u.createdAt < end).length
    cumulative += added
    growth.push({ label: d.toLocaleString('en-US', { month: 'short' }), value: cumulative })
  }

  // Top products by sales
  const top = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5).map((p) => ({
    name: p.name,
    sales: p.salesCount,
    revenue: Math.round(p.salesCount * p.price),
    gradient: p.coverGradient,
  }))

  // Status breakdown
  const statusList = ['completed', 'pending', 'processing', 'refunded', 'cancelled']
  const statusBreakdown = statusList.map((s) => ({
    name: s,
    value: allOrders.filter((o) => o.status === s).length,
  }))

  return NextResponse.json({
    revenue: Math.round(revenue),
    revenueChange,
    orders: orders.length,
    ordersChange,
    customers: allUsers.length,
    customersChange,
    conversion,
    conversionChange: 4,
    revenueSeries: months,
    weeklySeries: weeks,
    customerGrowth: growth,
    topProducts: top,
    statusBreakdown,
    productCount: products.length,
    aov: orders.length ? Math.round(revenue / orders.length) : 0,
    refundTotal: Math.round(allOrders.filter((o) => o.status === 'refunded').reduce((n, o) => n + o.total, 0)),
  })
}
