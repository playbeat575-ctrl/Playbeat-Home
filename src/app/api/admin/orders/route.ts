import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200)

  const where: any = {}
  if (status && status !== 'all') where.status = status

  const orders = await db.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      number: o.number,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      status: o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      subtotal: o.subtotal,
      discount: o.discount,
      tax: o.tax,
      total: o.total,
      couponCode: o.couponCode,
      items: o.items.map((it) => ({
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        licenseKey: it.licenseKey,
      })),
      createdAt: o.createdAt.toISOString(),
    })),
  })
}
