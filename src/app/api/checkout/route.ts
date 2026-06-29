import { NextResponse } from 'next/server'
import { createHostedCheckout, isLiveCheckoutEnabled, isLemonConfigured } from '@/lib/lemon'
import { calcDiscount } from '@/lib/format'

export const dynamic = 'force-dynamic'

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  licenseKey?: boolean
}

/**
 * POST /api/checkout
 * Body: { items, customer, coupon, paymentMethod }
 * - If Lemon Squeezy is fully configured (API key + store + default variant),
 *   creates a real hosted checkout and returns `{ url }` to redirect to.
 * - Otherwise returns `{ demo: true }` so the client falls back to the
 *   in-app demo checkout (POST /api/orders).
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { items, customer, coupon } = body as {
    items: CheckoutItem[]
    customer: { name: string; email: string }
    coupon?: { code: string; type: string; value: number } | null
  }

  if (!items?.length || !customer?.email) {
    return NextResponse.json({ error: 'Missing checkout data' }, { status: 400 })
  }

  // Fallback to demo mode when Lemon Squeezy isn't fully configured.
  if (!isLiveCheckoutEnabled()) {
    return NextResponse.json({
      demo: true,
      reason: !isLemonConfigured()
        ? 'Lemon Squeezy API key / store not configured'
        : 'No default variant ID set (LEMON_DEFAULT_VARIANT_ID)',
    })
  }

  const subtotal = Math.round(items.reduce((n, i) => n + i.price * i.quantity, 0) * 100) / 100
  const discount = calcDiscount(subtotal, coupon || null)
  const tax = Math.round(Math.max(0, subtotal - discount) * 0.08 * 100) / 100
  const total = Math.round((subtotal - discount + tax) * 100) / 100
  const totalCents = Math.round(total * 100)

  const productNames = items.map((i) => i.name).join(', ')

  try {
    const origin = new URL(req.url).origin
    const { url, checkoutId } = await createHostedCheckout({
      customPriceCents: totalCents,
      productName: items.length === 1 ? items[0].name : `PlayBeat Digital Order (${items.length} items)`,
      productDescription: productNames,
      email: customer.email,
      name: customer.name,
      redirectUrl: `${origin}/?lemon_success=1`,
      receiptThankYouNote: 'Thanks for your purchase from PlayBeat Digital!',
    })

    return NextResponse.json({ url, checkoutId, total })
  } catch (e: any) {
    console.error('[checkout]', e)
    return NextResponse.json(
      { demo: true, reason: `Lemon Squeezy error: ${e?.message || 'unknown'}` },
      { status: 200 }
    )
  }
}
