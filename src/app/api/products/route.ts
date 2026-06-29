import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('q')
  const flag = searchParams.get('flag') // featured|trending|bestSeller|flashDeal|newArrival
  const sort = searchParams.get('sort') || 'popular'
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100)

  const where: any = {}
  if (category && category !== 'all') where.category = { slug: category }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { tagline: { contains: search } },
      { description: { contains: search } },
      { brand: { contains: search } },
      { tags: { contains: search } },
    ]
  }
  if (flag && ['featured', 'trending', 'bestSeller', 'flashDeal', 'newArrival'].includes(flag)) {
    where[flag] = true
  }

  let orderBy: any = { salesCount: 'desc' }
  if (sort === 'price-asc') orderBy = { price: 'asc' }
  else if (sort === 'price-desc') orderBy = { price: 'desc' }
  else if (sort === 'rating') orderBy = { rating: 'desc' }
  else if (sort === 'newest') orderBy = { createdAt: 'desc' }

  const products = await db.product.findMany({
    where,
    include: { category: true },
    orderBy,
    take: limit,
  })

  return NextResponse.json({ products: products.map(serializeProduct) })
}
