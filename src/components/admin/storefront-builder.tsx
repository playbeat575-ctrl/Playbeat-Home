'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Search, Crown, Flame, Sparkles, TrendingUp, Star, RefreshCw, Save } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ProductCover } from '@/components/product-cover'
import { useAdminProducts } from '@/lib/hooks'
import { useCurrency } from '@/lib/use-currency'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'

const FLAGS = [
  { key: 'featured', label: 'Featured', icon: Sparkles, color: 'text-violet-600' },
  { key: 'trending', label: 'Trending', icon: TrendingUp, color: 'text-blue-600' },
  { key: 'bestSeller', label: 'Best Seller', icon: Crown, color: 'text-amber-600' },
  { key: 'flashDeal', label: 'Flash Deal', icon: Flame, color: 'text-rose-600' },
  { key: 'newArrival', label: 'New Arrival', icon: Star, color: 'text-emerald-600' },
] as const

type FlagKey = (typeof FLAGS)[number]['key']

export function StorefrontBuilder() {
  const { data, isLoading } = useAdminProducts()
  const products = data?.products ?? []
  const { format: fmt } = useCurrency()
  const qc = useQueryClient()
  const [search, setSearch] = React.useState('')
  const [filter, setFilter] = React.useState<FlagKey | 'all'>('all')
  const [pending, setPending] = React.useState<Record<string, Partial<Record<FlagKey, boolean>>>>({})
  const [saving, setSaving] = React.useState('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === 'all' || p[filter])
  )

  const hasPending = Object.keys(pending).length > 0

  const toggleFlag = (id: string, key: FlagKey, current: boolean) => {
    const next = !current
    setPending((p) => {
      const cur = p[id] || {}
      const orig = products.find((x) => x.id === id)?.[key] ?? false
      // if next equals original, drop the pending change
      if (next === orig) {
        const { [key]: _drop, ...rest } = cur
        const cleaned = rest
        if (Object.keys(cleaned).length === 0) {
          const { [id]: _drop2, ...rest2 } = p
          return rest2
        }
        return { ...p, [id]: cleaned }
      }
      return { ...p, [id]: { ...cur, [key]: next } }
    })
  }

  const effectiveFlag = (p: Product, key: FlagKey) =>
    pending[p.id]?.[key] !== undefined ? pending[p.id]?.[key] : p[key]

  const saveOne = async (id: string) => {
    const changes = pending[id]
    if (!changes) return
    setSaving(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      })
      if (!res.ok) throw new Error('Update failed')
      setPending((p) => {
        const { [id]: _drop, ...rest } = p
        return rest
      })
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Storefront updated')
    } catch (e: any) {
      toast.error(e.message || 'Update failed')
    } finally {
      setSaving('')
    }
  }

  const saveAll = async () => {
    setSaving('all')
    let ok = 0, fail = 0
    for (const id of Object.keys(pending)) {
      try {
        const res = await fetch(`/api/admin/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pending[id]),
        })
        if (res.ok) ok++; else fail++
      } catch { fail++ }
    }
    setPending({})
    qc.invalidateQueries({ queryKey: ['admin-products'] })
    qc.invalidateQueries({ queryKey: ['products'] })
    setSaving('')
    if (fail === 0) toast.success(`Storefront updated`, { description: `${ok} product${ok === 1 ? '' : 's'} updated` })
    else toast.warning(`Saved ${ok}, ${fail} failed`)
  }

  // section counts
  const counts = FLAGS.reduce((acc, f) => {
    acc[f.key] = products.filter((p) => effectiveFlag(p, f.key)).length
    return acc
  }, {} as Record<FlagKey, number>)

  return (
    <div className="space-y-6">
      {/* summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {FLAGS.map((f) => (
          <Card key={f.key} className="p-4 shadow-card-soft">
            <div className="flex items-center justify-between">
              <f.icon className={cn('h-5 w-5', f.color)} />
              <span className="text-2xl font-bold">{counts[f.key]}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{f.label}</div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden shadow-card-soft">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-brand-yellow-foreground dark:text-brand-yellow" />
              Storefront curation
            </h3>
            <p className="text-xs text-muted-foreground">
              Toggle which products appear in each storefront section. Changes update the live home page rails.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-full pl-9 lg:w-56" />
            </div>
            <div className="flex flex-wrap gap-1">
              <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterChip>
              {FLAGS.map((f) => (
                <FilterChip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
                  <f.icon className="mr-1 h-3 w-3" />{f.label}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>

        {/* grid of products with flag toggles */}
        <div className="max-h-[640px] overflow-y-auto scrollbar-slim p-4">
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">No products match this filter.</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => {
                const isPending = !!pending[p.id]
                const isSavingThis = saving === p.id
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.2) }}
                    className={cn(
                      'rounded-xl border bg-card p-3 transition-all',
                      isPending && 'ring-2 ring-brand-yellow'
                    )}
                  >
                    <div className="flex gap-3">
                      <ProductCover gradient={p.coverGradient} icon={p.icon} coverImage={p.coverImage} alt={p.name} className="h-14 w-14 shrink-0 rounded-lg" showShine={false} />
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-1 text-sm font-semibold">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground">{p.brand} · {fmt(p.price)}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {FLAGS.filter((f) => effectiveFlag(p, f.key)).map((f) => (
                            <Badge key={f.key} variant="secondary" className="gap-1 text-[9px]">
                              <f.icon className="h-2.5 w-2.5" /> {f.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-5 gap-1">
                      {FLAGS.map((f) => {
                        const val = effectiveFlag(p, f.key)
                        const changed = pending[p.id]?.[f.key] !== undefined && pending[p.id]?.[f.key] !== p[f.key]
                        return (
                          <button
                            key={f.key}
                            onClick={() => toggleFlag(p.id, f.key, val)}
                            className={cn(
                              'flex flex-col items-center gap-1 rounded-lg border px-1 py-1.5 text-[10px] font-medium transition-all',
                              val
                                ? 'border-brand-yellow/40 bg-brand-yellow/10 text-foreground'
                                : 'text-muted-foreground hover:border-foreground/30',
                              changed && 'ring-1 ring-brand-yellow'
                            )}
                            title={f.label}
                          >
                            <f.icon className={cn('h-3.5 w-3.5', val && f.color)} />
                            <span className="hidden sm:inline">{f.label.split(' ')[0]}</span>
                          </button>
                        )
                      })}
                    </div>
                    {isPending && (
                      <Button
                        size="sm"
                        className="mt-2 w-full gap-1.5"
                        onClick={() => saveOne(p.id)}
                        disabled={isSavingThis}
                      >
                        {isSavingThis ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Save changes
                      </Button>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* sticky save-all bar */}
        {hasPending && (
          <div className="sticky bottom-0 flex items-center justify-between border-t bg-card/95 px-4 py-3 backdrop-blur">
            <span className="text-sm font-medium">
              {Object.keys(pending).length} product{Object.keys(pending).length === 1 ? '' : 's'} with unsaved changes
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPending({})}>Discard</Button>
              <Button size="sm" className="gap-1.5" onClick={saveAll} disabled={saving === 'all'}>
                {saving === 'all' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save all
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

function FilterChip({
  active, onClick, children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex h-9 items-center rounded-full border px-3 text-xs font-medium transition-colors',
        active ? 'border-brand-yellow bg-brand-yellow/10 text-foreground' : 'text-muted-foreground hover:border-foreground/30'
      )}
    >
      {children}
    </button>
  )
}
