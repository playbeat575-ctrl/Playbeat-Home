import { NextResponse } from 'next/server'
import { getLemonStatus, isLiveCheckoutEnabled } from '@/lib/lemon'

export const dynamic = 'force-dynamic'

/** GET /api/lemon/status — reports Lemon Squeezy configuration & API key validity. */
export async function GET() {
  try {
    const status = await getLemonStatus()
    return NextResponse.json({ ...status, liveCheckout: isLiveCheckoutEnabled() })
  } catch (e: any) {
    return NextResponse.json({ configured: false, reason: e?.message || 'Request failed' })
  }
}
