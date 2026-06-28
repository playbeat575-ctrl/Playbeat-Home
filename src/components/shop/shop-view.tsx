'use client'

import * as React from 'react'
import { SlidersHorizontal, X, Star, Search } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useProducts, useCategories } from '@/lib/hooks'
import { useStore } from '@/store/use-store'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

const SORTS = [
  { value: 'popular', label: 'Most popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const FLAGS = [
  { value: '', label: 'All products' },
  { value: 'featured', label: 'Featured' },
  { value: 'trending', label: 'Trending' },
  { value: 'bestSeller', label: 'Best sellers' },
  { value: 'flashDeal', label: 'Flash deals' },
  { value: 'newArrival', label: 'New arrivals' },
]

export function ShopView({ initialCategory }: { initialCategory?: string }) {
  const navigate = useStore((s) => s.navigate)
  const { data: catData } = useCategories()
  const categories = catData?.categories ?? []

  const [category, setCategory] = React.useState(initialCategory ?? 'all')
  const [flag, setFlag] = React.useState('')
  const [sort, setSort] = React.useState('popular')
  const [search, setSearch] = React.useState('')
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  React.useEffect(() => {
    if (initialCategory) setCategory(initialCategory)
  }, [initialCategory])

  const { data, isLoading } = useProducts({
    category: category === 'all' ? undefined : category,
    flag: flag || undefined,
    sort,
    q: search || undefined,
    limit: 60,
  })
  const products = data?.products ?? []

  const activeCategory = categories.find((c) => c.slug === category)

  const FiltersContent = (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</h4>
        <div className="space-y-1">
          <FilterBtn active={category === 'all'} onClick={() => setCategory('all')}>
            All categories
          </FilterBtn>
          {categories.map((c) => (
            <FilterBtn key={c.id} active={category === c.slug} onClick={() => setCategory(c.slug)}>
              <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
              {c.name}
              <Badge variant="secondary" className="ml-auto text-[10px]">{c.productCount}</Badge>
            </FilterBtn>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filter</h4>
        <div className="space-y-1">
          {FLAGS.map((f) => (
            <FilterBtn key={f.value} active={flag === f.value} onClick={() => setFlag(f.value)}>
              {f.label}
            </FilterBtn>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-2">Marketplace</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {activeCategory ? activeCategory.name : 'All products'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {activeCategory?.description || 'Browse the full PlayBeat Digital catalog of premium digital products.'}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">{FiltersContent}</div>
          </aside>

          {/* main */}
          <div>
            {/* toolbar */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search this catalog…"
                  className="h-10 w-full rounded-full border bg-card pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-10 w-[180px] rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-1.5 rounded-full lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">{FiltersContent}</div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="mb-4 text-sm text-muted-foreground">
              {isLoading ? 'Loading…' : `${products.length} product${products.length === 1 ? '' : 's'}`}
              {flag && <span> · {FLAGS.find((f) => f.value === flag)?.label}</span>}
            </div>

            {products.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-3 text-lg font-semibold">No products found</h3>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    setCategory('all')
                    setFlag('')
                    setSearch('')
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-[300px] animate-pulse rounded-2xl bg-muted" />
                    ))
                  : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Button variant="outline" onClick={() => navigate({ name: 'home' })}>
                Back to home
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
        active ? 'bg-secondary font-medium' : 'hover:bg-secondary/60'
      )}
    >
      {children}
    </button>
  )
}
