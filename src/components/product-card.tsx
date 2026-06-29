'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Download, ShoppingCart, Zap, Crown, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCover } from '@/components/product-cover'
import { useStore } from '@/store/use-store'
import { useCurrency } from '@/lib/use-currency'
import { formatCompact, discountPercent } from '@/lib/format'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const navigate = useStore((s) => s.navigate)
  const addToCart = useStore((s) => s.addToCart)
  const toggleWishlist = useStore((s) => s.toggleWishlist)
  const wishlisted = useStore((s) => s.wishlist.includes(product.id))
  const { format: fmt } = useCurrency()
  const discount = discountPercent(product.price, product.compareAtPrice)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft transition-all hover:-translate-y-1 hover:shadow-glow-yellow"
    >
      {/* cover */}
      <button
        onClick={() => navigate({ name: 'product', slug: product.slug })}
        className="relative block aspect-[16/10] w-full text-left"
        aria-label={`View ${product.name}`}
      >
        <ProductCover gradient={product.coverGradient} icon={product.icon} coverImage={product.coverImage} alt={product.name} className="h-full w-full" />

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.flashDeal && (
            <Badge className="bg-brand-yellow text-brand-yellow-foreground gap-1 shadow-sm">
              <Flame className="h-3 w-3" /> -{discount || 25}%
            </Badge>
          )}
          {product.bestSeller && (
            <Badge className="bg-navy text-primary-foreground gap-1 shadow-sm">
              <Crown className="h-3 w-3" /> Best Seller
            </Badge>
          )}
          {product.newArrival && !product.flashDeal && (
            <Badge className="bg-white/90 text-navy gap-1 shadow-sm">
              <Zap className="h-3 w-3" /> New
            </Badge>
          )}
          {product.isSubscription && (
            <Badge variant="outline" className="bg-black/40 text-white border-white/30 backdrop-blur">
              {product.subscriptionInterval}
            </Badge>
          )}
        </div>

        {/* wishlist */}
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            toggleWishlist(product.id)
            toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-navy backdrop-blur transition hover:scale-110 hover:bg-white"
        >
          <Heart className={cn('h-4 w-4', wishlisted && 'fill-rose-500 text-rose-500')} />
        </span>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
          <span className="rounded-md bg-black/35 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
            {product.brand}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-black/35 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
            <Download className="h-3 w-3" /> {formatCompact(product.salesCount)}
          </span>
        </div>
      </button>

      {/* body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {product.category?.name ?? 'Digital'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-brand-yellow text-brand-yellow" />
            {product.rating.toFixed(1)}
            <span className="text-muted-foreground">({formatCompact(product.reviewCount)})</span>
          </span>
        </div>

        <button
          onClick={() => navigate({ name: 'product', slug: product.slug })}
          className="text-left text-sm font-semibold leading-snug line-clamp-1 hover:text-brand-yellow-foreground hover:underline dark:hover:text-brand-yellow"
        >
          {product.name}
        </button>
        <p className="line-clamp-2 text-xs text-muted-foreground">{product.tagline}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">{fmt(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {fmt(product.compareAtPrice)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => {
              addToCart(product)
              toast.success('Added to cart', { description: product.name })
            }}
            className="gap-1.5 rounded-full"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
