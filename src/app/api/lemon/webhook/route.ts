import { NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/lemon'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

function genOrderNumber() {
  return 'PB-' + Math.floor(100000 + Math.random() * 900000)
}

function genLicenseKey() {
  const seg = () => Math.random().toString(36).slice(2, 8).toUpperCase()
  return `PB-${seg()}-${seg()}-${seg()}`
}

/**
 * POST /api/lemon/webhook
 * Verified Lemon Squeezy webhook receiver.
 * On `order_created` events, creates a matching order in the database with
 * license keys for digital products. Idempotent by order identifier.
 */
export async function POST(req: Request) {
  const raw = await req.text()
  const signature = req.headers.get('x-signature')

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: any
  try {
    event = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventName: string = event?.meta?.event_name || ''
  const attrs = event?.data?.attributes || {}

  if (eventName === 'order_created' || eventName === 'order_refunded') {
    const identifier: string = event?.data?.id || attrs?.identifier || ''
    const existing = await db.order.findFirst({ where: { number: { contains: identifier } } })

    if (eventName === 'order_created' && !existing) {
      const customerEmail: string = attrs?.user_email || ''
      const customerName: string = attrs?.user_name || customerEmail.split('@')[0] || 'Customer'
      const total = Number(attrs?.total ?? 0) / 100
      const subtotal = Number(attrs?.subtotal ?? 0) / 100
      const tax = Number(attrs?.tax ?? 0) / 100
      const discount = Number(attrs?.discount_total ?? 0) / 100

      const lineItems = (attrs?.first_order_item ? [attrs.first_order_item] : []) as any[]
      const items = (lineItems.length ? lineItems : (attrs?.order_items ?? [])).map((it: any) => ({
        name: it?.product_name || it?.name || 'Digital product',
        price: Number(it?.price || 0) / 100,
        quantity: Number(it?.quantity || 1),
      }))

      await db.order.create({
        data: {
          number: `LS-${identifier || genOrderNumber()}`,
          customerName,
          customerEmail,
          status: 'completed',
          paymentStatus: 'paid',
          paymentMethod: attrs?.card_type ? 'card' : 'lemonsqueezy',
          subtotal,
          discount,
          tax,
          total,
          couponCode: attrs?.discount_code || null,
          items: {
            create: items.map((it: any) => ({
              name: it.name,
              price: it.price,
              quantity: it.quantity,
              licenseKey: genLicenseKey(),
            })),
          },
        },
      })
    } else if (eventName === 'order_refunded' && existing) {
      await db.order.update({
        where: { id: existing.id },
        data: { status: 'refunded', paymentStatus: 'refunded' },
      })
    }
  }

  return NextResponse.json({ received: true, event: eventName })
}
