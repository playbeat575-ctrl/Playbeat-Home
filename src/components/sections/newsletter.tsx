'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle2, Sparkles, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const STATS = [
  { value: '2,000+', label: 'Digital products' },
  { value: '48K+', label: 'Happy customers' },
  { value: '4.8/5', label: 'Average rating' },
  { value: '99.9%', label: 'Uptime' },
]

export function StatsBand() {
  return (
    <section className="border-y bg-secondary/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="text-center"
          >
            <div className="text-2xl font-bold tracking-tight text-gradient-navy sm:text-3xl">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function Newsletter() {
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not subscribe')
        return
      }
      setDone(true)
      toast.success('Subscribed! Check your inbox for a welcome discount.')
      setEmail('')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="relative overflow-hidden rounded-3xl border bg-navy p-8 text-primary-foreground sm:p-12">
        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(50% 100% at 100% 0%, rgba(250,204,21,0.35), transparent 60%)' }} />
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-brand-yellow/20 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Gift className="h-3.5 w-3.5 text-brand-yellow" /> Get 10% off your first order
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Join the PlayBeat newsletter
            </h2>
            <p className="mt-2 max-w-md text-sm text-primary-foreground/70">
              Be first to know about new releases, exclusive deals, and creator drops. No spam, unsubscribe anytime.
            </p>
          </div>
          <div>
            {done ? (
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 backdrop-blur">
                <CheckCircle2 className="h-8 w-8 text-brand-yellow" />
                <div>
                  <div className="font-semibold">You are in!</div>
                  <div className="text-sm text-primary-foreground/70">Your welcome code is on its way.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/50" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@studio.com"
                    className="border-white/20 bg-white/10 pl-9 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                </div>
                <Button type="submit" size="lg" className="gap-1.5 bg-brand-yellow text-brand-yellow-foreground hover:bg-brand-yellow/90" disabled={loading}>
                  <Sparkles className="h-4 w-4" />
                  {loading ? 'Subscribing…' : 'Subscribe'}
                </Button>
              </form>
            )}
            <p className="mt-3 text-xs text-primary-foreground/50">
              By subscribing you agree to our Privacy Policy. We respect your inbox.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
