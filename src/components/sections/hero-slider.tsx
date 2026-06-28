'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Play, ShieldCheck, Zap, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/use-store'
import { useProducts } from '@/lib/hooks'
import { ProductCover } from '@/components/product-cover'
import { formatCompact } from '@/lib/format'
import { cn } from '@/lib/utils'

const SLIDES = [
  {
    eyebrow: 'Premium Digital Marketplace',
    title: 'Build faster with',
    titleAccent: 'premium digital products',
    desc: 'Software, plugins, templates, courses, and creative assets — delivered instantly with secure checkout, license keys, and lifetime updates.',
    cta: 'Explore marketplace',
    cta2: 'How it works',
    flag: 'featured' as const,
  },
  {
    eyebrow: 'Flash Deals · Limited time',
    title: 'Up to 40% off',
    titleAccent: 'this week only',
    desc: 'Grab curated flash deals on top-rated assets. Use code FLASH25 at checkout for an extra discount on orders over $50.',
    cta: 'Shop flash deals',
    cta2: 'View all deals',
    flag: 'flashDeal' as const,
  },
  {
    eyebrow: 'For teams & studios',
    title: 'One membership,',
    titleAccent: 'every product unlocked',
    desc: 'PlayBeat Pro gives you every current and future release, priority support, early beta access, and a commercial license — for one flat fee.',
    cta: 'Become a member',
    cta2: 'See plans',
    flag: 'bestSeller' as const,
  },
]

export function HeroSlider() {
  const [index, setIndex] = React.useState(0)
  const navigate = useStore((s) => s.navigate)
  const { data } = useProducts({ flag: SLIDES[index].flag, limit: 4 })
  const products = data?.products ?? []

  React.useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 7000)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[index]

  return (
    <section className="relative overflow-hidden bg-radial-glow">
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Badge className="mb-4 gap-1.5 rounded-full border-brand-yellow/30 bg-brand-yellow/10 text-brand-yellow-foreground hover:bg-brand-yellow/15 dark:text-brand-yellow">
                  <Sparkles className="h-3.5 w-3.5" />
                  {slide.eyebrow}
                </Badge>
                <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  {slide.title}{' '}
                  <span className="text-gradient-navy">{slide.titleAccent}</span>
                </h1>
                <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                  {slide.desc}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    className="gap-1.5 rounded-full"
                    onClick={() => navigate({ name: 'shop' })}
                  >
                    {slide.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-1.5 rounded-full"
                    onClick={() => navigate({ name: 'shop' })}
                  >
                    <Play className="h-4 w-4" />
                    {slide.cta2}
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Lemon Squeezy checkout
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-brand-yellow-foreground dark:text-brand-yellow" /> Instant delivery
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" /> 4.8 avg rating
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === index ? 'w-8 bg-navy dark:bg-brand-yellow' : 'w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/70'
                  )}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 rounded-[2rem] bg-brand-yellow/10 blur-2xl" />
              <div className="relative grid grid-cols-2 gap-4">
                {products.slice(0, 4).map((p, i) => (
                  <motion.button
                    key={p.id}
                    onClick={() => navigate({ name: 'product', slug: p.slug })}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className={cn(
                      'group relative overflow-hidden rounded-2xl border bg-card text-left shadow-card-soft transition-all hover:-translate-y-1',
                      i % 2 === 1 && 'mt-8'
                    )}
                  >
                    <ProductCover gradient={p.coverGradient} icon={p.icon} className="aspect-[4/3] w-full" />
                    <div className="p-3">
                      <div className="text-xs text-muted-foreground">{p.brand}</div>
                      <div className="line-clamp-1 text-sm font-semibold">{p.name}</div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm font-bold">${p.price}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
                          {p.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -right-2 top-1/2 hidden -translate-y-1/2 rounded-2xl border bg-card/90 p-3 shadow-xl backdrop-blur sm:block"
              >
                <div className="text-[11px] text-muted-foreground">Total downloads</div>
                <div className="text-2xl font-bold">{formatCompact(48200)}+</div>
                <div className="mt-1 flex -space-x-1.5">
                  {['A', 'B', 'C', 'D'].map((c) => (
                    <span key={c} className="grid h-6 w-6 place-items-center rounded-full bg-navy text-[10px] font-bold text-primary-foreground ring-2 ring-card">
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
