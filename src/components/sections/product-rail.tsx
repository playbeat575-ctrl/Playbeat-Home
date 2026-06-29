'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { useProducts } from '@/lib/hooks'
import { useStore } from '@/store/use-store'
import { cn } from '@/lib/utils'

export function SectionHeader({
  eyebrow,
  title,
  desc,
  action,
}: {
  eyebrow?: string
  title: string
  desc?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-yellow-foreground dark:text-brand-yellow">
            {eyebrow}
          </div>
        )}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {desc && <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{desc}</p>}
      </div>
      {action}
    </div>
  )
}

export function ProductRail({
  flag,
  eyebrow,
  title,
  desc,
  limit = 10,
}: {
  flag: 'featured' | 'trending' | 'bestSeller' | 'flashDeal' | 'newArrival'
  eyebrow: string
  title: string
  desc?: string
  limit?: number
}) {
  const { data, isLoading } = useProducts({ flag, limit })
  const products = data?.products ?? []
  const navigate = useStore((s) => s.navigate)
  const railRef = React.useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    railRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        desc={desc}
        action={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate({ name: 'shop' })}>
              View all <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="hidden gap-1 sm:flex">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => scrollBy(-1)} aria-label="Previous">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => scrollBy(1)} aria-label="Next">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        }
      />

      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-slim mask-fade-r"
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[260px] shrink-0 snap-start">
                <div className="h-[260px] animate-pulse rounded-2xl bg-muted" />
              </div>
            ))
          : products.map((p, i) => (
              <div key={p.id} className="w-[260px] shrink-0 snap-start sm:w-[280px]">
                <ProductCard product={p} index={i} />
              </div>
            ))}
      </div>
    </section>
  )
}

export function ProductGridSection({
  flag,
  eyebrow,
  title,
  desc,
  limit = 8,
}: {
  flag: 'featured' | 'trending' | 'bestSeller' | 'flashDeal' | 'newArrival'
  eyebrow: string
  title: string
  desc?: string
  limit?: number
}) {
  const { data, isLoading } = useProducts({ flag, limit })
  const products = data?.products ?? []
  const navigate = useStore((s) => s.navigate)

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        desc={desc}
        action={
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate({ name: 'shop' })}>
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="h-[300px] animate-pulse rounded-2xl bg-muted" />
            ))
          : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  )
}
