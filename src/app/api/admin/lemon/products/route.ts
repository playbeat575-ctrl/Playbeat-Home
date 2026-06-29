import { NextResponse } from 'next/server'
import { listProducts, listVariants } from '@lemonsqueezy/lemonsqueezy.js'
import { lemonConfig, setupLemon } from '@/lib/lemon'

export const dynamic = 'force-dynamic'

/** GET /api/admin/lemon/products — list all Lemon Squeezy products + variants. */
export async function GET() {
  const { apiKey, storeId } = lemonConfig()
  if (!apiKey || !storeId) {
    return NextResponse.json({ error: 'Lemon Squeezy not configured' }, { status: 400 })
  }
  setupLemon()
  try {
    const productsRes = await listProducts({ filter: { storeId: Number(storeId) } })
    const products = (productsRes as any)?.data?.data ?? []

    const withVariants = await Promise.all(
      products.map(async (p: any) => {
        const vRes = await listVariants({ filter: { productId: p.id } })
        const variants = ((vRes as any)?.data?.data ?? []).map((v: any) => ({
          id: String(v.id),
          name: v.attributes?.name || 'Default',
          price: v.attributes?.price ?? 0,
          status: v.attributes?.status,
          interval: v.attributes?.subscription_interval || null,
        }))
        return {
          id: String(p.id),
          name: p.attributes?.name || 'Untitled',
          status: p.attributes?.status,
          type: p.attributes?.type,
          url: p.attributes?.url,
          variants,
        }
      })
    )

    return NextResponse.json({ products: withVariants })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to list Lemon products' }, { status: 500 })
  }
}
