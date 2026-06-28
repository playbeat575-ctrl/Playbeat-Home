'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  LayoutDashboard,
  Sparkles,
  ChevronDown,
  Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { ThemeToggle } from '@/components/theme-toggle'
import { useStore } from '@/store/use-store'
import { useProducts, useCategories } from '@/lib/hooks'
import { ProductCover } from '@/components/product-cover'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'

export function Navbar() {
  const navigate = useStore((s) => s.navigate)
  const setCartOpen = useStore((s) => s.setCartOpen)
  const cartCount = useStore((s) => s.cart.reduce((n, i) => n + i.quantity, 0))
  const wishlistCount = useStore((s) => s.wishlist.length)
  const view = useStore((s) => s.view)
  const [open, setOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const { data: catData } = useCategories()
  const categories = catData?.categories ?? []
  const [searchTerm, setSearchTerm] = React.useState('')
  const { data: searchData } = useProducts(searchTerm ? { q: searchTerm, limit: 8 } : {})

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isActive = (name: string) => view.name === name

  const navItems = [
    { label: 'Home', action: () => navigate({ name: 'home' }), active: isActive('home') },
    { label: 'Shop', action: () => navigate({ name: 'shop' }), active: isActive('shop') },
    { label: 'Wishlist', action: () => navigate({ name: 'wishlist' }), active: isActive('wishlist') },
  ]

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled ? 'glass-nav shadow-sm' : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => navigate({ name: 'home' })}
            className="flex items-center gap-2"
            aria-label="PlayBeat Digital home"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-navy text-primary-foreground shadow-md">
              <Sparkles className="h-5 w-5 text-brand-yellow" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-yellow ring-2 ring-background" />
            </span>
            <span className="hidden text-base font-bold tracking-tight sm:block">
              PlayBeat<span className="text-brand-yellow-foreground dark:text-brand-yellow"> Digital</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="ml-2 hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                  item.active
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                )}
              >
                {item.label}
              </button>
            ))}
            {/* Categories dropdown */}
            <CategoriesMenu categories={categories} onPick={(slug) => navigate({ name: 'shop', category: slug })} />
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-full text-muted-foreground sm:flex"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search</span>
              <kbd className="ml-1 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
              onClick={() => navigate({ name: 'wishlist' })}
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-yellow px-1 text-[10px] font-bold text-brand-yellow-foreground">
                  {wishlistCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-navy px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>

            <Button
              size="sm"
              variant="default"
              className="hidden gap-1.5 rounded-full lg:flex"
              onClick={() => navigate({ name: 'admin', section: 'dashboard' })}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Button>

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy">
                      <Sparkles className="h-4 w-4 text-brand-yellow" />
                    </span>
                    PlayBeat Digital
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 flex flex-col gap-1">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action()
                        setOpen(false)
                      }}
                      className={cn(
                        'rounded-lg px-3 py-2 text-left text-sm font-medium',
                        item.active ? 'bg-secondary' : 'hover:bg-secondary/60'
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Categories
                  </div>
                  <div className="max-h-64 overflow-y-auto scrollbar-slim">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          navigate({ name: 'shop', category: c.slug })
                          setOpen(false)
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary/60"
                      >
                        <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                        {c.name}
                        <Badge variant="secondary" className="ml-auto text-[10px]">{c.productCount}</Badge>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 border-t pt-3">
                    <Button
                      className="w-full gap-1.5"
                      onClick={() => {
                        navigate({ name: 'admin', section: 'dashboard' })
                        setOpen(false)
                      }}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Announcement bar */}
        <AnimatePresence>
          {!scrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-navy text-primary-foreground"
            >
              <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-xs">
                <Tag className="h-3.5 w-3.5 text-brand-yellow" />
                <span>Flash deals live now — up to 40% off. Code </span>
                <code className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-brand-yellow">FLASH25</code>
                <span className="hidden sm:inline">at checkout.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search command */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search products, brands, categories…" value={searchTerm} onValueChange={setSearchTerm} />
        <CommandList>
          <CommandEmpty>{searchTerm ? 'No results found.' : 'Start typing to search…'}</CommandEmpty>
          {searchData?.products?.length ? (
            <CommandGroup heading="Products">
              {searchData.products.map((p) => (
                <CommandItem
                  key={p.id}
                  value={p.name}
                  onSelect={() => {
                    navigate({ name: 'product', slug: p.slug })
                    setSearchOpen(false)
                    setSearchTerm('')
                  }}
                  className="gap-3"
                >
                  <ProductCover gradient={p.coverGradient} icon={p.icon} className="h-9 w-9 rounded-md" showShine={false} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{p.brand} · {p.category?.name}</div>
                  </div>
                  <span className="text-sm font-semibold">{formatCurrency(p.price)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {!searchTerm && (
            <CommandGroup heading="Quick links">
              <CommandItem onSelect={() => { navigate({ name: 'shop' }); setSearchOpen(false) }}>
                <Search className="mr-2 h-4 w-4" /> Browse all products
              </CommandItem>
              <CommandItem onSelect={() => { navigate({ name: 'shop', category: 'games-assets' }); setSearchOpen(false) }}>
                <Sparkles className="mr-2 h-4 w-4" /> Games & Assets
              </CommandItem>
              <CommandItem onSelect={() => { navigate({ name: 'admin', section: 'dashboard' }); setSearchOpen(false) }}>
                <LayoutDashboard className="mr-2 h-4 w-4" /> Open admin dashboard
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

function CategoriesMenu({
  categories,
  onPick,
}: {
  categories: { id: string; name: string; slug: string; icon: string; color: string; productCount: number }[]
  onPick: (slug: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/60"
      >
        Categories
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 top-full z-50 mt-2 w-[340px] rounded-2xl border bg-popover p-2 shadow-xl"
          >
            <div className="grid grid-cols-2 gap-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onPick(c.slug)
                    setOpen(false)
                  }}
                  className="flex items-start gap-2 rounded-lg p-2 text-left transition-colors hover:bg-secondary"
                >
                  <span className="mt-0.5 h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-bold" style={{ background: `${c.color}22`, color: c.color }}>
                    {c.name[0]}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">{c.productCount} items</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
