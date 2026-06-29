'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore } from '@/store/use-store'
import { toast } from 'sonner'

export function AdminLogin() {
  const signInAdmin = useStore((s) => s.signInAdmin)
  const navigate = useStore((s) => s.navigate)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [show, setShow] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Enter your email and password')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const ok = signInAdmin(email, password)
      setLoading(false)
      if (ok) {
        toast.success('Welcome back, Founder', {
          description: 'Signed in to PlayBeat Digital admin.',
        })
      } else {
        setError('Invalid credentials. Use founder@playbeat.digital / Playbeat123')
        toast.error('Sign-in failed', { description: 'Invalid email or password.' })
      }
    }, 700)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4 py-12">
      {/* ambient glow */}
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-brand-yellow/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-brand-yellow/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl border-white/15 p-8 shadow-2xl">
          {/* logo */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="relative mb-3">
              <img src="/favicon.svg" alt="" className="h-14 w-14 rounded-2xl shadow-lg" width={56} height={56} />
              <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-brand-yellow text-navy">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
            </div>
            <h1 className="text-2xl font-bold text-primary-foreground">PlayBeat Admin</h1>
            <p className="mt-1 text-sm text-primary-foreground/60">
              Sign in to manage your digital marketplace
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-primary-foreground/80">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/40" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@playbeat.digital"
                  className="border-white/15 bg-white/10 pl-9 text-primary-foreground placeholder:text-primary-foreground/40"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-primary-foreground/80">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/40" />
                <Input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="border-white/15 bg-white/10 px-9 text-primary-foreground placeholder:text-primary-foreground/40"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/40 hover:text-primary-foreground/70"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-rose-400/30 bg-rose-500/15 px-3 py-2 text-sm text-rose-200"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 bg-brand-yellow text-brand-yellow-foreground hover:bg-brand-yellow/90"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-yellow-foreground/30 border-t-brand-yellow-foreground" />
                  Signing in…
                </span>
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* demo credentials hint */}
          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-primary-foreground/60">
            <div className="mb-1 flex items-center gap-1.5 font-medium text-primary-foreground/80">
              <Sparkles className="h-3.5 w-3.5 text-brand-yellow" /> Founder access
            </div>
            <div className="font-mono">founder@playbeat.digital</div>
            <div className="font-mono">Playbeat123</div>
          </div>

          <button
            onClick={() => navigate({ name: 'home' })}
            className="mt-5 flex w-full items-center justify-center gap-1.5 text-xs text-primary-foreground/50 transition-colors hover:text-primary-foreground/80"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to storefront
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] text-primary-foreground/40">
          © {new Date().getFullYear()} PlayBeat Digital · Secured admin area
        </p>
      </motion.div>
    </div>
  )
}
