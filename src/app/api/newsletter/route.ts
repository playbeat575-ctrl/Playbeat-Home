import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  const existing = await db.newsletter.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ ok: true, already: true })
  await db.newsletter.create({ data: { email } })
  return NextResponse.json({ ok: true })
}
