import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { productId, userName, rating, title, comment } = body
  if (!productId || !userName || !rating || !title || !comment) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const r = await db.review.create({
    data: {
      productId,
      userName: String(userName).slice(0, 80),
      rating: Math.max(1, Math.min(5, Number(rating))),
      title: String(title).slice(0, 120),
      comment: String(comment).slice(0, 1000),
      verified: false,
    },
  })
  const agg = await db.review.aggregate({ where: { productId }, _avg: { rating: true }, _count: true })
  await db.product.update({
    where: { id: productId },
    data: { rating: Math.round((agg._avg.rating || 0) * 10) / 10, reviewCount: agg._count },
  })
  return NextResponse.json({ ok: true, id: r.id })
}
