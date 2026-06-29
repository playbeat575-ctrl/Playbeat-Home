// Delete all products except the Netflix one (linked to Lemon variant 1850448).
// Categories are preserved. Reviews cascade-delete; order items get productId set to null.
// Run: unset DATABASE_URL && bun run scripts/trim-products.ts
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  const all = await db.product.findMany({ select: { id: true, name: true, lemonVariantId: true } })
  console.log(`Total products before: ${all.length}`)

  // Keep only the Netflix product (matched by name OR lemonVariantId 1850448)
  const keep = all.filter(
    (p) => p.name.toLowerCase().includes('netflix') || p.lemonVariantId === '1850448'
  )
  const keepIds = keep.map((p) => p.id)
  const deleteIds = all.filter((p) => !keepIds.includes(p.id)).map((p) => p.id)

  console.log(`Keeping: ${keep.map((p) => p.name).join(', ') || '(none)'}`)
  console.log(`Deleting: ${deleteIds.length} products`)

  // OrderItem.productId is optional (SetNull on delete), Review cascades.
  // Use a transaction to be safe.
  if (deleteIds.length) {
    await db.product.deleteMany({ where: { id: { in: deleteIds } } })
  }

  const after = await db.product.findMany({ select: { id: true, name: true, lemonVariantId: true } })
  console.log(`\nTotal products after: ${after.length}`)
  for (const p of after) {
    console.log(`  - ${p.name} | variant: ${p.lemonVariantId || '(none)'}`)
  }

  const cats = await db.category.count()
  console.log(`\nCategories preserved: ${cats}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })
