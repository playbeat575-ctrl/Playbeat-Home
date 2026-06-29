import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct, serializeReview } from '@/lib/serialize'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true, reviews: { orderBy: { createdAt: 'desc' }, take: 12 } },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const related = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: { category: true },
    take: 6,
    orderBy: { salesCount: 'desc' },
  })

  return NextResponse.json({
    product: serializeProduct(product),
    reviews: product.reviews.map(serializeReview),
    related: related.map(serializeProduct),
  })
}
