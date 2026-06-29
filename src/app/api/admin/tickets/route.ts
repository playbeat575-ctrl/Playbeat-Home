import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const tickets = await db.ticket.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({
    tickets: tickets.map((t) => ({
      id: t.id,
      number: t.number,
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      status: t.status,
      message: t.message,
      createdAt: t.createdAt.toISOString(),
    })),
  })
}
