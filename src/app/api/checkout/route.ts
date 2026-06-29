import { NextResponse } from 'next/server'
import { createHostedCheckout, isLiveCheckoutEnabled, isLemonConfigured } from '@/lib/lemon'
import { calcDiscount } from '@/lib/format'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  licenseKey?: boolean
  lemonVariantId?: string | null
}

/**
 * POST /api/checkout
 * Body: { items, customer, coupon, paymentMethod }
 * - If Lemon Squeezy is fully configured (API key + store + default variant),
 *   creates a real hosted checkout and returns `{ url }` to redirect to.
 * - Per-product Lemon variant IDs (items[].lemonVariantId) take precedence;
 *   otherwise the LEMON_DEFAULT_VARIANT_ID is used with a custom price.
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

  // Resolve per-product Lemon variant IDs from the DB if the client didn't send them.
  const enrichedItems: CheckoutItem[] = await Promise.all(
    items.map(async (i) => {
      if (i.lemonVariantId) return i
      try {
        const p = await db.product.findUnique({ where: { id: i.id }, select: { lemonVariantId: true } })
        return { ...i, lemonVariantId: p?.lemonVariantId ?? null }
      } catch {
        return i
      }
    })
  )

  const subtotal = Math.round(enrichedItems.reduce((n, i) => n + i.price * i.quantity, 0) * 100) / 100
  const discount = calcDiscount(subtotal, coupon || null)
  const tax = Math.round(Math.max(0, subtotal - discount) * 0.08 * 100) / 100
  const total = Math.round((subtotal - discount + tax) * 100) / 100

  // The Lemon Squeezy store is configured in PKR. customPrice must be in the
  // store currency's smallest unit (paisa for PKR = PKR * 100).
  // USD base → PKR (rate 285) → paisa.
  const PKR_RATE = 285
  const pkrTotal = Math.round(total * PKR_RATE)
  const customPricePaisa = pkrTotal * 100

  // Choose a variant: prefer the first item's per-product variant, else default.
  const defaultVariantId = process.env.LEMON_DEFAULT_VARIANT_ID || ''
  const variantId = enrichedItems.find((i) => i.lemonVariantId)?.lemonVariantId || defaultVariantId
  // Use a custom price only when falling back to the default variant (mixed carts).
  // For a single product mapped to its own variant, let Lemon use the variant's own price
  // unless the cart quantity/discount differs — we still pass the computed total for accuracy.
  const useCustomPrice = enrichedItems.length > 1 || !enrichedItems[0]?.lemonVariantId

  const productNames = enrichedItems.map((i) => i.name).join(', ')

  try {
    const origin = new URL(req.url).origin
    const { url, checkoutId } = await createHostedCheckout({
      variantId,
      customPriceCents: useCustomPrice ? customPricePaisa : undefined,
      productName: enrichedItems.length === 1 ? enrichedItems[0].name : `PlayBeat Digital Order (${enrichedItems.length} items)`,
      productDescription: productNames,
      email: customer.email,
      name: customer.name,
      redirectUrl: `${origin}/?lemon_success=1`,
      receiptThankYouNote: 'Thanks for your purchase from PlayBeat Digital!',
    })

    return NextResponse.json({ url, checkoutId, total, pkrTotal, currency: 'PKR', variantId })
  } catch (e: any) {
    console.error('[checkout]', e)
    return NextResponse.json(
      { demo: true, reason: `Lemon Squeezy error: ${e?.message || 'unknown'}` },
      { status: 200 }
    )
  }
}
