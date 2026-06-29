import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeCategory } from '@/lib/serialize'

export const dynamic = 'force-dynamic'

export async function GET() {
  const categories = await db.category.findMany({ orderBy: { name: 'asc' } })
  const withCounts = await Promise.all(
    categories.map(async (c) => {
      const count = await db.product.count({ where: { categoryId: c.id } })
      return { ...serializeCategory(c), productCount: count }
    })
  )
  return NextResponse.json({ categories: withCounts })
}
