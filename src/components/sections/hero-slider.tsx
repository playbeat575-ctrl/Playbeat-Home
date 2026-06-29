'use client'

import * as React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, ShieldCheck, Star, TrendingUp, Layers, Code2, Palette, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/use-store'
import { useProducts } from '@/lib/hooks'
import { ProductCover } from '@/components/product-cover'
import { formatCompact } from '@/lib/format'
import { cn } from '@/lib/utils'

const STATS = [
  { value: 2000, suffix: '+', label: 'Digital products' },
  { value: 48, suffix: 'K+', label: 'Happy customers' },
  { value: 4.9, suffix: '/5', label: 'Avg rating', decimals: 1 },
  { value: 99.9, suffix: '%', label: 'Uptime', decimals: 1 },
]

const SERVICES = [
  { icon: Palette, label: 'Branding & Design' },
  { icon: Code2, label: 'Web Development' },
  { icon: TrendingUp, label: 'Digital Marketing' },
  { icon: Rocket, label: 'Product Strategy' },
]

export function HeroSlider() {
  const navigate = useStore((s) => s.navigate)
  const { data } = useProducts({ flag: 'featured', limit: 4 })
  const products = data?.products ?? []
  const heroRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yFloat = useTransform(scrollYProgress, [0, 1], [0, -60])
  const yFloatSlow = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-mesh">
      {/* ── Background effects ── */}
      <div className="absolute inset-0 bg-grid-fine opacity-50 mask-fade-b" />
      {/* animated blurred orbs */}
      <motion.div
        className="absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(47,128,255,0.35), transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-24 top-32 h-[24rem] w-[24rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.28), transparent 70%)' }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[20rem] w-[20rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.22), transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* silver light streak */}
      <div className="absolute -top-40 left-1/2 h-80 w-[140%] -translate-x-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-2xl" />

      <motion.div style={{ opacity }} className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          {/* ── Copy ── */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-5 gap-1.5 rounded-full border border-electric/30 bg-electric/10 text-azure backdrop-blur hover:bg-electric/15">
                <Sparkles className="h-3.5 w-3.5 text-cyan-glow" />
                Premium Digital Studio
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
            >
              <span className="block text-platinum">Design.</span>
              <span className="block text-platinum">Develop.</span>
              <span className="block text-gradient-blue">Dominate.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-steel sm:text-lg"
            >
              From strategy and branding to web development and digital marketing, we build
              exceptional digital experiences that turn visitors into loyal customers.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button
                size="lg"
                onClick={() => navigate({ name: 'shop' })}
                className="btn-gradient-primary gap-2 rounded-full border-0 px-7 text-base font-semibold text-white"
              >
                Explore marketplace
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ name: 'admin', section: 'dashboard' })}
                className="gap-2 rounded-full border-steel/30 bg-white/5 px-7 text-base font-semibold text-platinum backdrop-blur hover:border-electric/50 hover:bg-white/10 hover:text-white"
              >
                <Zap className="h-4 w-4 text-cyan-glow" />
                Admin dashboard
              </Button>
            </motion.div>

            {/* trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-steel/80"
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-cyan-glow" /> Secure Lemon Squeezy checkout
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-electric" /> Instant delivery
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-cyan-glow text-cyan-glow" /> 4.9 avg rating
              </span>
            </motion.div>

            {/* service pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {SERVICES.map((s) => (
                <span key={s.label} className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs font-medium text-steel backdrop-blur">
                  <s.icon className="h-3.5 w-3.5 text-electric" />
                  {s.label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Floating dashboard preview ── */}
          <div className="relative">
            <motion.div style={{ y: yFloat }} className="relative mx-auto max-w-md lg:max-w-none">
              {/* glow behind */}
              <div className="absolute -inset-6 rounded-[2rem] bg-electric/20 blur-3xl" />

              {/* main glass dashboard card */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotateX: 8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative rounded-[1.75rem] glass-strong p-5 shadow-glow-blue"
              >
                {/* card header */}
                <div className="flex items-center justify-between border-b border-white/8 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                  </div>
                  <span className="text-[11px] font-medium text-steel/70">playbeat.digital</span>
                </div>

                {/* revenue mini chart */}
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-[11px] text-steel/60">Revenue (30d)</div>
                    <div className="text-2xl font-bold text-platinum">$48,290</div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                    <TrendingUp className="h-3 w-3" /> +12.4%
                  </span>
                </div>
                {/* fake bars */}
                <div className="mt-3 flex h-20 items-end gap-1.5">
                  {[40, 65, 50, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.6, delay: 0.6 + i * 0.04 }}
                      className="flex-1 rounded-t bg-gradient-to-t from-electric/40 to-cyan-glow"
                    />
                  ))}
                </div>

                {/* mini stats */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { l: 'Orders', v: '1,284' },
                    { l: 'Customers', v: '948' },
                    { l: 'Conversion', v: '3.8%' },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-white/8 bg-white/5 p-2.5">
                      <div className="text-[10px] text-steel/60">{s.l}</div>
                      <div className="text-sm font-bold text-platinum">{s.v}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* floating product cards */}
              {products.slice(0, 2).map((p, i) => (
                <motion.button
                  key={p.id}
                  onClick={() => navigate({ name: 'product', slug: p.slug })}
                  style={{ y: i === 0 ? yFloat : yFloatSlow }}
                  initial={{ opacity: 0, scale: 0.9, x: i === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
                  className={cn(
                    'absolute hidden w-44 overflow-hidden rounded-2xl glass p-2.5 text-left shadow-elevate sm:block',
                    i === 0 ? '-left-8 top-16 animate-float' : '-right-6 bottom-12 animate-float-slow'
                  )}
                >
                  <ProductCover gradient={p.coverGradient} icon={p.icon} coverImage={p.coverImage} alt={p.name} className="aspect-[16/10] w-full rounded-lg" />
                  <div className="mt-2">
                    <div className="line-clamp-1 text-xs font-semibold text-platinum">{p.name}</div>
                    <div className="mt-0.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-glow">${p.price}</span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-steel/60">
                        <Star className="h-2.5 w-2.5 fill-cyan-glow text-cyan-glow" />
                        {p.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}

              {/* floating downloads badge */}
              <motion.div
                style={{ y: yFloatSlow }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute -right-4 top-1/3 hidden rounded-2xl glass px-3 py-2 shadow-elevate sm:block animate-float-slow"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric/20">
                    <Layers className="h-4 w-4 text-electric" />
                  </span>
                  <div>
                    <div className="text-[10px] text-steel/60">Total downloads</div>
                    <div className="text-sm font-bold text-platinum">{formatCompact(48200)}+</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── Stats row with counters ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-2 gap-4 border-t border-white/8 pt-8 sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <Counter key={s.label} {...s} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

function Counter({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [display, setDisplay] = React.useState(0)
  const inView = React.useRef(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView.current) {
          inView.current = true
          const duration = 1400
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setDisplay(value * eased)
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-center sm:text-left">
      <div className="text-3xl font-bold tracking-tight text-gradient-silver sm:text-4xl">
        {display.toFixed(decimals)}{suffix}
      </div>
      <div className="mt-1 text-xs text-steel/60 sm:text-sm">{label}</div>
    </div>
  )
}
