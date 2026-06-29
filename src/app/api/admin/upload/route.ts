import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_BYTES = 6 * 1024 * 1024 // 6 MB

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided (field "file")' }, { status: 400 })
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 6 MB)' }, { status: 400 })
    }

    const ext = (file.name.split('.').pop() || 'png').toLowerCase().slice(0, 5)
    const name = `pb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'upload')
    await mkdir(uploadDir, { recursive: true })
    const fullPath = path.join(uploadDir, name)
    const bytes = await file.arrayBuffer()
    await writeFile(fullPath, Buffer.from(bytes))

    return NextResponse.json({ ok: true, url: `/upload/${name}`, name, size: file.size })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}
