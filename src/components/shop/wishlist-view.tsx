'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCover } from '@/components/product-cover'
import { useProducts } from '@/lib/hooks'
import { useStore } from '@/store/use-store'
import { useCurrency } from '@/lib/use-currency'
import { toast } from 'sonner'
import { Footer } from '@/components/footer'

export function WishlistView() {
  const wishlist = useStore((s) => s.wishlist)
  const toggleWishlist = useStore((s) => s.toggleWishlist)
  const addToCart = useStore((s) => s.addToCart)
  const navigate = useStore((s) => s.navigate)
  const { data } = useProducts({ limit: 60 })
  const { format: fmt } = useCurrency()
  const items = (data?.products ?? []).filter((p) => wishlist.includes(p.id))

  return (
    <>
      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-2 gap-1">
            <Heart className="h-3 w-3" /> Wishlist
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your wishlist</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {items.length === 0 ? 'Save products you love for later.' : `${items.length} saved product${items.length === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
              <Heart className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mt-3 text-lg font-semibold">Your wishlist is empty</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Tap the heart on any product to save it here for later.
            </p>
            <Button className="mt-4 gap-1.5" onClick={() => navigate({ name: 'shop' })}>
              Discover products <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {items.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card-soft"
                >
                  <button
                    onClick={() => navigate({ name: 'product', slug: p.slug })}
                    className="relative aspect-[16/10] w-full"
                  >
                    <ProductCover gradient={p.coverGradient} icon={p.icon} coverImage={p.coverImage} alt={p.name} className="h-full w-full" />
                  </button>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{p.brand}</span>
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
                        {p.rating.toFixed(1)}
                      </span>
                    </div>
                    <button onClick={() => navigate({ name: 'product', slug: p.slug })} className="text-left text-sm font-semibold hover:underline">
                      {p.name}
                    </button>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="text-lg font-bold">{fmt(p.price)}</span>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            toggleWishlist(p.id)
                            toast('Removed from wishlist')
                          }}
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="gap-1.5"
                          onClick={() => {
                            addToCart(p)
                            toast.success('Added to cart', { description: p.name })
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" /> Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
