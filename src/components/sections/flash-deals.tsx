'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Flame, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/use-store'
import { useProducts } from '@/lib/hooks'
import { useCurrency } from '@/lib/use-currency'
import { ProductCover } from '@/components/product-cover'
import { discountPercent } from '@/lib/format'
import { Star, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

function useCountdown(hoursFromNow: number) {
  const [target] = React.useState(() => Date.now() + hoursFromNow * 3600000)
  const [now, setNow] = React.useState(Date.now())
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, target - now)
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { h, m, s }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function FlashDeals() {
  const navigate = useStore((s) => s.navigate)
  const addToCart = useStore((s) => s.addToCart)
  const { data, isLoading } = useProducts({ flag: 'flashDeal', limit: 4 })
  const products = data?.products ?? []
  const { h, m, s } = useCountdown(11)
  const { format: fmt } = useCurrency()

  return (
    <section className="relative overflow-hidden bg-navy py-12 text-primary-foreground lg:py-16">
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(60% 80% at 80% 0%, rgba(250,204,21,0.35), transparent 60%)' }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge className="mb-3 gap-1.5 bg-brand-yellow text-brand-yellow-foreground hover:bg-brand-yellow">
              <Flame className="h-3.5 w-3.5" /> Flash Deals
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Deals ending soon</h2>
            <p className="mt-1.5 text-sm text-primary-foreground/70">
              Hand-picked discounts on best-selling digital products. Grab them before the timer hits zero.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
              <Clock className="h-4 w-4 text-brand-yellow" />
              <div className="flex items-center gap-1 font-mono text-lg font-bold tabular-nums">
                <span className="rounded bg-black/30 px-1.5 py-0.5">{pad(h)}</span>:
                <span className="rounded bg-black/30 px-1.5 py-0.5">{pad(m)}</span>:
                <span className="rounded bg-black/30 px-1.5 py-0.5">{pad(s)}</span>
              </div>
            </div>
            <Button variant="secondary" className="gap-1.5" onClick={() => navigate({ name: 'shop' })}>
              All deals <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/10" />
              ))
            : products.map((p, i) => {
                const discount = discountPercent(p.price, p.compareAtPrice) || 25
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur transition-all hover:bg-white/10"
                  >
                    <button
                      onClick={() => navigate({ name: 'product', slug: p.slug })}
                      className="relative aspect-[16/10] w-full"
                    >
                      <ProductCover gradient={p.coverGradient} icon={p.icon} coverImage={p.coverImage} alt={p.name} className="h-full w-full" />
                      <span className="absolute left-3 top-3 rounded-md bg-brand-yellow px-2 py-1 text-xs font-bold text-brand-yellow-foreground">
                        -{discount}%
                      </span>
                    </button>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <div className="text-[11px] uppercase tracking-wide text-primary-foreground/60">{p.brand}</div>
                      <button
                        onClick={() => navigate({ name: 'product', slug: p.slug })}
                        className="line-clamp-1 text-left text-sm font-semibold hover:underline"
                      >
                        {p.name}
                      </button>
                      <div className="flex items-center gap-1 text-xs text-primary-foreground/70">
                        <Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
                        {p.rating.toFixed(1)} · {p.reviewCount} reviews
                      </div>
                      <div className="mt-auto flex items-end justify-between pt-2">
                        <div>
                          <div className="text-lg font-bold">{fmt(p.price)}</div>
                          {p.compareAtPrice && (
                            <div className="text-xs text-primary-foreground/50 line-through">{fmt(p.compareAtPrice)}</div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="gap-1.5 bg-brand-yellow text-brand-yellow-foreground hover:bg-brand-yellow/90"
                          onClick={() => {
                            addToCart(p)
                            toast.success('Added to cart', { description: p.name })
                          }}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
        </div>
      </div>
    </section>
  )
}
