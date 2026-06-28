import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({
    coupons: coupons.map((c) => ({
      id: c.id,
      code: c.code,
      type: c.type,
      value: c.value,
      minSpend: c.minSpend,
      expiry: c.expiry ? c.expiry.toISOString() : null,
      usageLimit: c.usageLimit,
      usedCount: c.usedCount,
      active: c.active,
    })),
  })
}
