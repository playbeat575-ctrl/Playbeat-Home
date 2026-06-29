import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

function genOrderNumber() {
  return 'PB-' + Math.floor(100000 + Math.random() * 900000)
}

function genLicenseKey() {
  const seg = () => Math.random().toString(36).slice(2, 8).toUpperCase()
  return `PB-${seg()}-${seg()}-${seg()}`
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { items, customer, coupon, paymentMethod = 'card', currency = 'USD' } = body as {
    items: { id: string; name: string; price: number; quantity: number; licenseKey?: boolean }[]
    customer: { name: string; email: string }
    coupon?: { code: string; type: string; value: number } | null
    paymentMethod?: string
    currency?: string
  }

  if (!items?.length || !customer?.name || !customer?.email) {
    return NextResponse.json({ error: 'Missing order data' }, { status: 400 })
  }

  // Prices are stored in USD (base currency). The customer's display currency
  // is recorded on the order for reference.
  const subtotal = Math.round(items.reduce((n, i) => n + i.price * i.quantity, 0) * 100) / 100
  let discount = 0
  if (coupon) {
    if (coupon.type === 'percentage' || coupon.type === 'first_purchase' || coupon.type === 'referral') {
      discount = Math.round(subtotal * (coupon.value / 100) * 100) / 100
    } else {
      discount = Math.min(subtotal, coupon.value)
    }
  }
  const tax = Math.round(Math.max(0, subtotal - discount) * 0.08 * 100) / 100
  const total = Math.round((subtotal - discount + tax) * 100) / 100

  const order = await db.order.create({
    data: {
      number: genOrderNumber(),
      customerName: customer.name,
      customerEmail: customer.email,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod,
      subtotal,
      discount,
      tax,
      total,
      currency,
      couponCode: coupon?.code || null,
      items: {
        create: items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          licenseKey: i.licenseKey ? genLicenseKey() : null,
        })),
      },
    },
    include: { items: true },
  })

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    orderNumber: order.number,
    total: order.total,
    items: order.items.map((it) => ({
      name: it.name,
      price: it.price,
      quantity: it.quantity,
      licenseKey: it.licenseKey,
    })),
  })
}
