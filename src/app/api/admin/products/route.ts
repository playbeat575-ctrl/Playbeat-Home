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

const GRADIENTS = [
  'from-blue-600 via-indigo-600 to-violet-700',
  'from-amber-400 via-orange-500 to-rose-500',
  'from-emerald-400 via-teal-500 to-cyan-600',
  'from-fuchsia-500 via-purple-600 to-indigo-700',
  'from-sky-400 via-blue-500 to-indigo-600',
  'from-rose-400 via-pink-500 to-fuchsia-600',
  'from-lime-400 via-green-500 to-emerald-600',
  'from-slate-600 via-slate-700 to-slate-900',
]

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const {
    name, tagline, description, categoryId, brand, price, compareAtPrice,
    coverImage, icon, tags, coverGradient, lemonVariantId,
    featured, trending, bestSeller, flashDeal, newArrival,
    hasLicenseKey, isSubscription, subscriptionInterval,
  } = body

  if (!name || !categoryId || price == null) {
    return NextResponse.json({ error: 'Missing required fields (name, category, price)' }, { status: 400 })
  }

  // ensure unique slug
  let slug = slugify(name)
  const existing = await db.product.findUnique({ where: { slug } })
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`

  const product = await db.product.create({
    data: {
      name,
      slug,
      tagline: tagline || '',
      description: description || '',
      categoryId,
      brand: brand || 'PlayBeat Studios',
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      coverImage: coverImage || null,
      lemonVariantId: lemonVariantId || null,
      icon: icon || 'Sparkles',
      coverGradient: coverGradient || GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
      tags: Array.isArray(tags) ? tags.join(',') : (typeof tags === 'string' ? tags : ''),
      featured: !!featured,
      trending: !!trending,
      bestSeller: !!bestSeller,
      flashDeal: !!flashDeal,
      newArrival: !!newArrival,
      hasLicenseKey: !!hasLicenseKey,
      isSubscription: !!isSubscription,
      subscriptionInterval: isSubscription ? (subscriptionInterval || 'monthly') : null,
      fileName: slug + '-v1.zip',
      fileSize: (Math.floor(Math.random() * 400) + 20) + ' MB',
    },
    include: { category: true },
  })

  return NextResponse.json({ ok: true, product: serializeProduct(product) })
}
