import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const users = await db.user.findMany({ orderBy: { createdAt: 'desc' } })
  const orders = await db.order.findMany()
  const orderCountByUser: Record<string, number> = {}
  for (const o of orders) {
    if (o.userId) orderCountByUser[o.userId] = (orderCountByUser[o.userId] || 0) + 1
  }
  return NextResponse.json({
    customers: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      points: u.points,
      referralCode: u.referralCode,
      status: u.status,
      orderCount: orderCountByUser[u.id] || 0,
      createdAt: u.createdAt.toISOString(),
    })),
  })
}
