import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/serialize'

export const dynamic = 'force-dynamic'

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const {
    name, tagline, description, categoryId, brand, price, compareAtPrice,
    coverImage, icon, tags, coverGradient,
    featured, trending, bestSeller, flashDeal, newArrival,
    hasLicenseKey, isSubscription, subscriptionInterval,
  } = body

  const existing = await db.product.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // recompute slug only if name changed
  let slug = existing.slug
  if (name && name !== existing.name) {
    slug = slugify(name)
    const clash = await db.product.findUnique({ where: { slug } })
    if (clash && clash.id !== id) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
  }

  const product = await db.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== existing.slug && { slug }),
      ...(tagline !== undefined && { tagline }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { categoryId }),
      ...(brand !== undefined && { brand }),
      ...(price !== undefined && { price: Number(price) }),
      ...(compareAtPrice !== undefined && { compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null }),
      ...(coverImage !== undefined && { coverImage: coverImage || null }),
      ...(icon !== undefined && { icon }),
      ...(coverGradient !== undefined && { coverGradient }),
      ...(tags !== undefined && { tags: Array.isArray(tags) ? tags.join(',') : String(tags) }),
      ...(featured !== undefined && { featured: !!featured }),
      ...(trending !== undefined && { trending: !!trending }),
      ...(bestSeller !== undefined && { bestSeller: !!bestSeller }),
      ...(flashDeal !== undefined && { flashDeal: !!flashDeal }),
      ...(newArrival !== undefined && { newArrival: !!newArrival }),
      ...(hasLicenseKey !== undefined && { hasLicenseKey: !!hasLicenseKey }),
      ...(isSubscription !== undefined && { isSubscription: !!isSubscription }),
      ...(subscriptionInterval !== undefined && { subscriptionInterval: isSubscription ? (subscriptionInterval || 'monthly') : null }),
    },
    include: { category: true },
  })

  return NextResponse.json({ ok: true, product: serializeProduct(product) })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const existing = await db.product.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await db.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
