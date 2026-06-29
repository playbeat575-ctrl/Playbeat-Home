import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const code = String(body.code || '').trim().toUpperCase()
  const subtotal = Number(body.subtotal || 0)
  if (!code) return NextResponse.json({ error: 'Enter a code' }, { status: 400 })

  const coupon = await db.coupon.findUnique({ where: { code } })
  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: 'Invalid or inactive code' }, { status: 404 })
  }
  if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
    return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ error: 'Usage limit reached' }, { status: 400 })
  }
  if (subtotal < coupon.minSpend) {
    return NextResponse.json({
      error: `Requires a minimum spend of $${coupon.minSpend.toFixed(2)}`,
    }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
    },
  })
}
