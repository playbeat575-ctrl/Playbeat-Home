'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { SectionHeader } from '@/components/sections/product-rail'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const REVIEWS = [
  { name: 'Maya Chen', role: 'Indie Game Dev', avatar: 'MC', rating: 5, text: 'PlayBeat has become my go-to marketplace. The quality is consistently excellent and delivery is instant. The license key system just works.' },
  { name: 'Daniel Park', role: 'Studio Founder', avatar: 'DP', rating: 5, text: 'We bought the CodeCraft boilerplate and shipped our SaaS in 11 days. The code quality is enterprise-grade and support is incredible.' },
  { name: 'Sofia Reyes', role: 'Product Designer', avatar: 'SR', rating: 5, text: 'The design resources are a steal. Brightside Icons alone saved me hours. Everything is well organized and beautifully crafted.' },
  { name: 'Liam Walsh', role: 'Freelance Developer', avatar: 'LW', rating: 4.5, text: 'Great selection and fair pricing. Flash deals are genuinely good, not just marketing. Checkout via Lemon Squeezy was smooth.' },
  { name: 'Aisha Khan', role: 'Content Creator', avatar: 'AK', rating: 5, text: 'The Pro membership pays for itself in a week. Getting every new release plus commercial licensing is unbeatable value.' },
  { name: 'Noah Bennett', role: 'Agency Owner', avatar: 'NB', rating: 5, text: 'I outfit my whole team through PlayBeat. Invoices, refunds, license keys — everything is handled. Best digital marketplace I have used.' },
]

export function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <SectionHeader
        eyebrow="Loved by creators"
        title="What our customers say"
        desc="Join 48,000+ creators, studios and agencies building with PlayBeat Digital products."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
            className="relative flex flex-col rounded-2xl border bg-card p-5 shadow-card-soft"
          >
            <Quote className="absolute right-4 top-4 h-8 w-8 text-brand-yellow/20" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={j < Math.floor(r.rating) ? 'h-4 w-4 fill-brand-yellow text-brand-yellow' : 'h-4 w-4 text-muted-foreground/30'}
                />
              ))}
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">"{r.text}"</p>
            <div className="mt-4 flex items-center gap-3">
              <Avatar className="h-9 w-9 border">
                <AvatarFallback className="bg-navy text-xs font-bold text-primary-foreground">{r.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
