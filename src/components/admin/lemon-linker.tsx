'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink, RefreshCw, Search, Save, Link2, Unlink, AlertCircle, CheckCircle2,
  Sparkles, Plus, ShoppingCart,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductCover } from '@/components/product-cover'
import { useAdminProducts, useLemonProducts } from '@/lib/hooks'
import { useCurrency } from '@/lib/use-currency'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const DASHBOARD_URL = 'https://app.lemonsqueezy.com/products'

export function LemonLinker() {
  const { data: prodData, isLoading: prodLoading } = useAdminProducts()
  const { data: lemonData, isLoading: lemonLoading, refetch, isFetching } = useLemonProducts()
  const products = prodData?.products ?? []
  const lemonProducts = lemonData?.products ?? []
  const { format: fmt } = useCurrency()
  const qc = useQueryClient()
  const [search, setSearch] = React.useState('')
  const [assignments, setAssignments] = React.useState<Record<string, string>>({}) // productId -> variantId
  const [saving, setSaving] = React.useState(false)

  // flatten variants for the dropdown
  const allVariants = React.useMemo(() => {
    const list: { id: string; label: string; productName: string; price: number; status: string }[] = []
    for (const lp of lemonProducts) {
      for (const v of lp.variants) {
        list.push({
          id: v.id,
          label: `${lp.name} — ${v.name}`,
          productName: lp.name,
          price: v.price,
          status: v.status,
        })
      }
    }
    return list
  }, [lemonProducts])

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const linkedCount = products.filter((p) => p.lemonVariantId).length
  const pendingCount = Object.keys(assignments).length

  const setAssignment = (productId: string, variantId: string) => {
    setAssignments((a) => {
      const next = { ...a }
      if (variantId === '__clear__') {
        next[productId] = ''
      } else if (variantId === '__keep__') {
        delete next[productId]
      } else {
        next[productId] = variantId
      }
      return next
    })
  }

  const effectiveVariant = (p: { id: string; lemonVariantId: string | null }) =>
    assignments[p.id] !== undefined ? assignments[p.id] : (p.lemonVariantId || '')

  const saveAll = async () => {
    setSaving(true)
    let ok = 0, fail = 0
    for (const [pid, vid] of Object.entries(assignments)) {
      try {
        const res = await fetch(`/api/admin/products/${pid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lemonVariantId: vid || null }),
        })
        if (res.ok) ok++; else fail++
      } catch { fail++ }
    }
    setAssignments({})
    qc.invalidateQueries({ queryKey: ['admin-products'] })
    qc.invalidateQueries({ queryKey: ['products'] })
    setSaving(false)
    if (fail === 0) toast.success(`Lemon variants linked`, { description: `${ok} product${ok === 1 ? '' : 's'} updated` })
    else toast.warning(`Saved ${ok}, ${fail} failed`)
  }

  return (
    <div className="space-y-6">
      {/* status banner */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-navy to-navy-soft p-6 text-primary-foreground shadow-card-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-5 w-5 text-brand-yellow" /> Lemon Squeezy Linker
            </h2>
            <p className="mt-1 max-w-xl text-sm text-primary-foreground/70">
              Connect each PlayBeat product to a Lemon Squeezy variant for live hosted checkout. Products &amp; variants are created in the Lemon dashboard — then linked here.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
              <div className="text-2xl font-bold">{linkedCount}/{products.length}</div>
              <div className="text-[11px] text-primary-foreground/60">products linked</div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
              <div className="text-2xl font-bold">{lemonProducts.length}</div>
              <div className="text-[11px] text-primary-foreground/60">Lemon products</div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
              <div className="text-2xl font-bold">{allVariants.length}</div>
              <div className="text-[11px] text-primary-foreground/60">variants available</div>
            </div>
          </div>
        </div>
      </Card>

      {/* info banner about API limitation */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-300/40 bg-amber-50 p-4 dark:bg-amber-950/30">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="text-sm">
          <p className="font-medium text-amber-900 dark:text-amber-200">Lemon Squeezy doesn't allow creating products via the API</p>
          <p className="mt-0.5 text-amber-800/80 dark:text-amber-300/70">
            Create products &amp; variants in the Lemon dashboard first, click <strong>Refresh</strong> below to load them, then assign each to a PlayBeat product.
          </p>
        </div>
        <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700">
          <Plus className="h-3.5 w-3.5" /> New product <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <Card className="overflow-hidden shadow-card-soft">
        {/* toolbar */}
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search PlayBeat products…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} /> Refresh variants
            </Button>
            {pendingCount > 0 && (
              <Button size="sm" className="gap-1.5" onClick={saveAll} disabled={saving}>
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save {pendingCount} link{pendingCount === 1 ? '' : 's'}
              </Button>
            )}
          </div>
        </div>

        {/* empty state when no lemon products */}
        {!lemonLoading && lemonProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary">
              <ShoppingCart className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-3 text-lg font-semibold">No Lemon Squeezy products found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create your first product in the Lemon Squeezy dashboard, then click <strong>Refresh variants</strong>.
            </p>
            <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-primary-foreground">
              <Plus className="h-4 w-4" /> Create product on Lemon Squeezy <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {/* product list */}
        {lemonProducts.length > 0 && (
          <div className="max-h-[640px] overflow-y-auto scrollbar-slim">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="sticky top-0 bg-secondary/80 backdrop-blur">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">PlayBeat product</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Lemon Squeezy variant</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {prodLoading && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Loading products…</td></tr>
                )}
                {filtered.map((p) => {
                  const cur = effectiveVariant(p)
                  const changed = assignments[p.id] !== undefined
                  const isLinked = !!cur
                  const variantInfo = allVariants.find((v) => v.id === cur)
                  return (
                    <tr key={p.id} className={cn('border-b last:border-0 transition-colors hover:bg-secondary/30', changed && 'bg-brand-yellow/5')}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProductCover gradient={p.coverGradient} icon={p.icon} coverImage={p.coverImage} alt={p.name} className="h-10 w-10 shrink-0 rounded-lg" showShine={false} />
                          <div className="min-w-0">
                            <div className="line-clamp-1 text-sm font-medium">{p.name}</div>
                            <div className="text-[11px] text-muted-foreground">{p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold">{fmt(p.price)}</td>
                      <td className="px-4 py-3">
                        <Select value={cur || '__none__'} onValueChange={(v) => setAssignment(p.id, v === '__none__' ? '__clear__' : v === '__keep__' ? '__keep__' : v)}>
                          <SelectTrigger className="h-9 w-full min-w-[220px]">
                            <SelectValue placeholder="Not linked" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none__">— Not linked —</SelectItem>
                            {allVariants.map((v) => (
                              <SelectItem key={v.id} value={v.id}>
                                {v.label} · ${(v.price / 100).toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        {isLinked ? (
                          <div className="flex items-center gap-2">
                            <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" /> Live
                            </Badge>
                            {variantInfo && (
                              <span className="text-[11px] text-muted-foreground">
                                {variantInfo.status === 'published' ? 'published' : 'pending'}
                              </span>
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline" className="gap-1 text-muted-foreground">
                            <Unlink className="h-3 w-3" /> Demo
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* sticky save bar */}
        {pendingCount > 0 && (
          <div className="sticky bottom-0 flex items-center justify-between border-t bg-card/95 px-4 py-3 backdrop-blur">
            <span className="text-sm font-medium">
              {pendingCount} unsaved link{pendingCount === 1 ? '' : 's'}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAssignments({})}>Discard</Button>
              <Button size="sm" className="gap-1.5" onClick={saveAll} disabled={saving}>
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save all links
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Lemon products reference */}
      {lemonProducts.length > 0 && (
        <Card className="p-5 shadow-card-soft">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Link2 className="h-4 w-4 text-brand-yellow-foreground dark:text-brand-yellow" />
            Your Lemon Squeezy products ({lemonProducts.length})
          </h3>
          <p className="text-xs text-muted-foreground">Reference of products &amp; variants available to link above.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lemonProducts.map((lp) => (
              <div key={lp.id} className="rounded-xl border bg-card p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="line-clamp-1 text-sm font-semibold">{lp.name}</div>
                    <div className="text-[11px] text-muted-foreground">Product #{lp.id}</div>
                  </div>
                  <Badge variant={lp.status === 'published' ? 'default' : 'outline'} className="text-[10px]">{lp.status}</Badge>
                </div>
                <div className="mt-2 space-y-1">
                  {lp.variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between rounded-md bg-secondary/50 px-2 py-1 text-[11px]">
                      <span className="font-mono">{v.id}</span>
                      <span className="text-muted-foreground">{v.name} · ${(v.price / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                {lp.url && (
                  <a href={lp.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] text-brand-yellow-foreground hover:underline dark:text-brand-yellow">
                    View on Lemon <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
