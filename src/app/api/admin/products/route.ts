import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'

export const dynamic = 'force-dynamic'

export async function GET() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { salesCount: 'desc' },
  })
  return NextResponse.json({ products: products.map(serializeProduct) })
}
