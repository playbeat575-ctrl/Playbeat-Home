'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Star, Heart, ShoppingCart, Download, ShieldCheck, Key, RefreshCw, Check, ArrowLeft,
  Share2, ChevronRight, ThumbsUp, BadgeCheck, FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ProductCover, Icon } from '@/components/product-cover'
import { ProductCard } from '@/components/product-card'
import { useProduct } from '@/lib/hooks'
import { useStore, useRecentlyViewed } from '@/store/use-store'
import { formatCompact, discountPercent, formatDate } from '@/lib/format'
import { useCurrency } from '@/lib/use-currency'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Footer } from '@/components/footer'

const SPECS: Record<string, { label: string; value: string }[]> = {
  default: [
    { label: 'Format', value: 'ZIP + source files' },
    { label: 'Compatibility', value: 'Universal · Cross-platform' },
    { label: 'License', value: 'Commercial · Unlimited projects' },
    { label: 'Updates', value: 'Lifetime free updates' },
    { label: 'Support', value: '6 months priority support' },
    { label: 'Delivery', value: 'Instant digital download' },
  ],
}

const VARIANTS = ['Personal', 'Team (5 seats)', 'Studio (unlimited)']

export function ProductDetailView({ slug }: { slug: string }) {
  const { data, isLoading } = useProduct(slug)
  const navigate = useStore((s) => s.navigate)
  const addToCart = useStore((s) => s.addToCart)
  const setCartOpen = useStore((s) => s.setCartOpen)
  const toggleWishlist = useStore((s) => s.toggleWishlist)
  const wishlisted = useStore((s) => (data ? s.wishlist.includes(data.product.id) : false))
  const { format: fmt, info: currencyInfo } = useCurrency()
  const recentlyViewed = useRecentlyViewed()
  const [variant, setVariant] = React.useState(VARIANTS[0])
  const [qty, setQty] = React.useState(1)

  React.useEffect(() => {
    if (data?.product.id) recentlyViewed.add(data.product.id)
  }, [data?.product.id])

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-3xl bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-24 w-full animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  const { product, reviews, related } = data
  const discount = discountPercent(product.price, product.compareAtPrice)
  const specs = SPECS.default

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length
    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0
    return { star, count, pct }
  })

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <button onClick={() => navigate({ name: 'home' })} className="hover:text-foreground">Home</button>
          <ChevronRight className="h-3.5 w-3.5" />
          <button onClick={() => navigate({ name: 'shop', category: product.category?.slug })} className="hover:text-foreground">
            {product.category?.name ?? 'Shop'}
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="line-clamp-1 text-foreground">{product.name}</span>
        </nav>

        <button
          onClick={() => navigate({ name: 'shop', category: product.category?.slug })}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {product.category?.name ?? 'products'}
        </button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* gallery */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[4/3] overflow-hidden rounded-3xl border shadow-card-soft"
            >
              <ProductCover gradient={product.coverGradient} icon={product.icon} coverImage={product.coverImage} alt={product.name} className="h-full w-full" />
              {discount > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-brand-yellow px-3 py-1 text-sm font-bold text-brand-yellow-foreground shadow">
                  -{discount}%
                </span>
              )}
            </motion.div>
            {/* thumbnail strip (decorative variants of cover) */}
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-xl border transition',
                    i === 0 ? 'ring-2 ring-brand-yellow' : 'opacity-70 hover:opacity-100'
                  )}
                >
                  <ProductCover gradient={product.coverGradient} icon={product.icon} coverImage={product.coverImage} alt={product.name} className="h-full w-full" showShine={false} />
                </div>
              ))}
            </div>

            {/* trust badges */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                { icon: Download, label: 'Instant download' },
                { icon: Key, label: product.hasLicenseKey ? 'License key included' : 'Lifetime access' },
                { icon: RefreshCw, label: 'Free updates' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1.5 rounded-xl border bg-card p-3 text-center">
                  <b.icon className="h-5 w-5 text-brand-yellow-foreground dark:text-brand-yellow" />
                  <span className="text-[11px] text-muted-foreground">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* info */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Icon name={product.category?.icon ?? 'Boxes'} className="h-3 w-3" />
                {product.category?.name ?? 'Digital'}
              </Badge>
              {product.bestSeller && <Badge className="bg-navy text-primary-foreground gap-1"><BadgeCheck className="h-3 w-3" /> Best Seller</Badge>}
              {product.isSubscription && <Badge variant="outline" className="capitalize">{product.subscriptionInterval} subscription</Badge>}
              <span className="text-xs text-muted-foreground">by {product.brand}</span>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-base text-muted-foreground">{product.tagline}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('h-4 w-4', i < Math.round(product.rating) ? 'fill-brand-yellow text-brand-yellow' : 'text-muted-foreground/30')} />
                  ))}
                </div>
                <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">· {product.reviewCount} reviews</span>
              </div>
              <span className="text-sm text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <Download className="h-4 w-4" /> {formatCompact(product.salesCount)} sales
              </span>
            </div>

            {/* price */}
            <div className="mt-6 flex items-end gap-3">
              <span className="text-4xl font-bold">{fmt(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="mb-1 text-lg text-muted-foreground line-through">{fmt(product.compareAtPrice)}</span>
              )}
              {discount > 0 && (
                <span className="mb-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Save {fmt((product.compareAtPrice ?? 0) - product.price)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">VAT included · Prices in {currencyInfo.code} · {product.fileSize ?? 'Instant delivery'}</p>

            {/* variants */}
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium">License type</div>
              <div className="flex flex-wrap gap-2">
                {VARIANTS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={cn(
                      'rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                      variant === v
                        ? 'border-brand-yellow bg-brand-yellow/10 text-foreground ring-1 ring-brand-yellow'
                        : 'hover:border-foreground/30'
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* qty + actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center rounded-l-full hover:bg-secondary" aria-label="Decrease">
                  –
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-11 w-11 place-items-center rounded-r-full hover:bg-secondary" aria-label="Increase">
                  +
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1 gap-2 sm:flex-none sm:px-8"
                onClick={() => {
                  addToCart(product, qty, variant)
                  toast.success('Added to cart', { description: `${qty} × ${product.name}` })
                }}
              >
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => {
                  addToCart(product, qty, variant)
                  navigate({ name: 'checkout' })
                }}
              >
                Buy now
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-11 w-11 rounded-full"
                onClick={() => {
                  toggleWishlist(product.id)
                  toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
                }}
                aria-label="Wishlist"
              >
                <Heart className={cn('h-5 w-5', wishlisted && 'fill-rose-500 text-rose-500')} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-11 w-11 rounded-full"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                  toast.success('Link copied to clipboard')
                }}
                aria-label="Share"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* stock / delivery */}
            <div className="mt-5 space-y-2 rounded-2xl border bg-card p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Availability</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" /> In stock · Digital
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Secure checkout</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="h-4 w-4 text-brand-yellow-foreground dark:text-brand-yellow" /> Lemon Squeezy
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment options</span>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="rounded border px-1.5 py-0.5">Card</span>
                  <span className="rounded border px-1.5 py-0.5">Apple Pay</span>
                  <span className="rounded border px-1.5 py-0.5">PayPal</span>
                </div>
              </div>
            </div>

            {/* tags */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {product.tags.map((t) => (
                <button
                  key={t}
                  onClick={() => navigate({ name: 'shop' })}
                  className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brand-yellow hover:text-foreground"
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* tabs: description / specs / reviews */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl bg-secondary/60 p-1">
              <TabsTrigger value="description" className="rounded-lg">Description</TabsTrigger>
              <TabsTrigger value="specs" className="rounded-lg">Specifications</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="support" className="rounded-lg">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <p className="text-base leading-relaxed text-foreground/90">{product.description}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      'Production-ready and battle-tested',
                      'Clean, documented and typed source',
                      'Commercial license for unlimited use',
                      'Free lifetime updates & patches',
                    ].map((f) => (
                      <div key={f} className="flex items-start gap-2 rounded-xl border bg-card p-3">
                        <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                        <span className="text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-brand-yellow-foreground dark:text-brand-yellow" />
                    <h4 className="text-sm font-semibold">Package contents</h4>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>· {product.fileName ?? 'Source archive'}</li>
                    <li>· Documentation & quickstart</li>
                    <li>· {product.fileSize ?? 'N/A'} total size</li>
                    <li>· {product.hasLicenseKey ? 'Activation license key' : 'No activation required'}</li>
                    <li>· Changelog & version history</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
              <div className="overflow-hidden rounded-2xl border">
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((s, i) => (
                      <tr key={s.label} className={cn(i % 2 === 0 ? 'bg-card' : 'bg-secondary/30')}>
                        <td className="w-1/3 px-4 py-3 font-medium text-muted-foreground">{s.label}</td>
                        <td className="px-4 py-3">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="grid gap-8 lg:grid-cols-3">
                {/* summary */}
                <div className="rounded-2xl border bg-card p-5">
                  <div className="text-center">
                    <div className="text-5xl font-bold">{product.rating.toFixed(1)}</div>
                    <div className="mt-2 flex justify-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn('h-4 w-4', i < Math.round(product.rating) ? 'fill-brand-yellow text-brand-yellow' : 'text-muted-foreground/30')} />
                      ))}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{product.reviewCount} reviews</div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    {ratingBreakdown.map((r) => (
                      <div key={r.star} className="flex items-center gap-2 text-xs">
                        <span className="w-3">{r.star}</span>
                        <Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-brand-yellow" style={{ width: `${r.pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-muted-foreground">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* list + form */}
                <div className="lg:col-span-2">
                  <ReviewForm productId={product.id} />
                  <div className="mt-6 space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="rounded-2xl border bg-card p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border">
                              <AvatarFallback className="bg-navy text-xs font-bold text-primary-foreground">{r.userAvatar || r.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1.5 text-sm font-semibold">
                                {r.userName}
                                {r.verified && <BadgeCheck className="h-3.5 w-3.5 text-brand-yellow-foreground dark:text-brand-yellow" />}
                              </div>
                              <div className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</div>
                            </div>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={cn('h-3.5 w-3.5', i < r.rating ? 'fill-brand-yellow text-brand-yellow' : 'text-muted-foreground/30')} />
                            ))}
                          </div>
                        </div>
                        <h4 className="mt-3 text-sm font-semibold">{r.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <button className="inline-flex items-center gap-1 hover:text-foreground"><ThumbsUp className="h-3.5 w-3.5" /> Helpful</button>
                          {r.verified && <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Check className="h-3.5 w-3.5" /> Verified purchase</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="support" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: RefreshCw, title: 'Free updates', desc: 'Receive all future updates and patches at no extra cost.' },
                  { icon: ShieldCheck, title: '6 months support', desc: 'Priority email support from the PlayBeat team.' },
                  { icon: Download, title: 'Re-download anytime', desc: 'Access your files from your account whenever you need.' },
                ].map((s) => (
                  <div key={s.title} className="rounded-2xl border bg-card p-5">
                    <s.icon className="h-6 w-6 text-brand-yellow-foreground dark:text-brand-yellow" />
                    <h4 className="mt-3 text-sm font-semibold">{s.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* related */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-6 text-2xl font-bold tracking-tight">You might also like</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

function ReviewForm({ productId }: { productId: string }) {
  const [name, setName] = React.useState('')
  const [rating, setRating] = React.useState(5)
  const [title, setTitle] = React.useState('')
  const [comment, setComment] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !title || !comment) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userName: name, rating, title, comment }),
      })
      if (!res.ok) throw new Error()
      toast.success('Review submitted! It will appear after moderation.')
      setName('')
      setTitle('')
      setComment('')
      setRating(5)
    } catch {
      toast.error('Could not submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-card p-5">
      <h4 className="text-sm font-semibold">Write a review</h4>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rating</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <button type="button" key={i} onClick={() => setRating(i + 1)} aria-label={`${i + 1} stars`}>
                <Star className={cn('h-5 w-5', i < rating ? 'fill-brand-yellow text-brand-yellow' : 'text-muted-foreground/30')} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <Input className="mt-3" placeholder="Review title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea className="mt-3" placeholder="Share your experience…" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button type="submit" className="mt-3" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit review'}
      </Button>
    </form>
  )
}
