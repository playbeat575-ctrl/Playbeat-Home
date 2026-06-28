'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck, Lock, CreditCard, Apple, Wallet, Check, ArrowLeft, Key, Download, Tag, X, Loader2, CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ProductCover } from '@/components/product-cover'
import { useStore } from '@/store/use-store'
import { calcDiscount } from '@/lib/format'
import { useCurrency } from '@/lib/use-currency'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Footer } from '@/components/footer'

type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'paypal'

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: any; desc: string }[] = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
  { id: 'apple_pay', label: 'Apple Pay', icon: Apple, desc: 'One-tap secure checkout' },
  { id: 'google_pay', label: 'Google Pay', icon: Wallet, desc: 'Pay with your Google account' },
  { id: 'paypal', label: 'PayPal', icon: Wallet, desc: 'Pay with your PayPal balance' },
]

export function CheckoutView() {
  const cart = useStore((s) => s.cart)
  const navigate = useStore((s) => s.navigate)
  const clearCart = useStore((s) => s.clearCart)
  const appliedCoupon = useStore((s) => s.appliedCoupon)
  const applyCoupon = useStore((s) => s.applyCoupon)

  const [email, setEmail] = React.useState('')
  const [name, setName] = React.useState('')
  const [method, setMethod] = React.useState<PaymentMethod>('card')
  const [card, setCard] = React.useState({ number: '', exp: '', cvc: '', name: '' })
  const [couponInput, setCouponInput] = React.useState('')
  const [couponLoading, setCouponLoading] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)
  const [success, setSuccess] = React.useState<null | { orderId: string; orderNumber: string; items: any[]; total: number; currency?: string; displayTotal?: number }>(null)
  const [lemonStatus, setLemonStatus] = React.useState<{ liveCheckout?: boolean; configured?: boolean; user?: { name: string } } | null>(null)

  React.useEffect(() => {
    fetch('/api/lemon/status')
      .then((r) => r.json())
      .then((d) => setLemonStatus(d))
      .catch(() => {})
  }, [])

  const { format: fmt, info: currencyInfo, convert } = useCurrency()

  const subtotal = cart.reduce((n, i) => n + i.product.price * i.quantity, 0)
  const discount = calcDiscount(subtotal, appliedCoupon)
  const tax = Math.round(Math.max(0, subtotal - discount) * 0.08 * 100) / 100
  const total = Math.round((subtotal - discount + tax) * 100) / 100

  const applyCouponCode = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Invalid code')
        return
      }
      applyCoupon(data.coupon)
      toast.success(`Coupon ${data.coupon.code} applied`)
      setCouponInput('')
    } catch {
      toast.error('Could not validate coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const pay = async () => {
    if (!email || !name) {
      toast.error('Please enter your name and email')
      return
    }
    if (method === 'card' && (!card.number || !card.exp || !card.cvc)) {
      toast.error('Please enter your card details')
      return
    }
    setProcessing(true)
    const checkoutItems = cart.map((i) => ({
      id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      licenseKey: i.product.hasLicenseKey,
    }))

    try {
      // Step 1 — ask the server to create a Lemon Squeezy hosted checkout.
      // If Lemon Squeezy isn't fully configured, the server returns { demo: true }
      // and we fall back to the in-app demo checkout that creates the order directly.
      const co = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: checkoutItems,
          customer: { name, email },
          coupon: appliedCoupon,
          paymentMethod: method,
        }),
      })
      const coData = await co.json()

      if (coData.url) {
        // Live Lemon Squeezy hosted checkout — redirect away.
        toast.success('Redirecting to Lemon Squeezy secure checkout…')
        window.location.href = coData.url
        return
      }

      // Demo fallback — create the order directly in the database.
      await new Promise((r) => setTimeout(r, 900))
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: checkoutItems,
          customer: { name, email },
          coupon: appliedCoupon,
          paymentMethod: method,
          currency: currencyInfo.code,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess({
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        items: data.items,
        total: data.total,
        currency: currencyInfo.code,
        displayTotal: convert(data.total),
      })
      clearCart()
      toast.success('Payment successful!')
    } catch (e: any) {
      toast.error(e.message || 'Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  if (cart.length === 0 && !success) {
    return (
      <>
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
            <ShieldCheck className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Add some products before checking out.</p>
          <Button className="mt-5 gap-1.5" onClick={() => navigate({ name: 'shop' })}>
            Browse products <ArrowLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>
        <Footer />
      </>
    )
  }

  if (success) {
    return (
      <>
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl border bg-card shadow-card-soft"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/20 backdrop-blur"
              >
                <Check className="h-8 w-8" />
              </motion.div>
              <h1 className="mt-4 text-2xl font-bold">Payment successful!</h1>
              <p className="mt-1 text-white/80">Your digital products are ready to download.</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm backdrop-blur">
                <span className="text-white/70">Order</span>
                <span className="font-mono font-semibold">{success.orderNumber}</span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-semibold">Your downloads</h3>
              <div className="mt-3 space-y-3">
                {success.items.map((it: any, i: number) => (
                  <div key={i} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{it.name}</span>
                      <span className="text-sm font-semibold">{fmt(it.price * it.quantity)}</span>
                    </div>
                    {it.licenseKey && (
                      <div className="mt-2 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                        <Key className="h-3.5 w-3.5 text-brand-yellow-foreground dark:text-brand-yellow" />
                        <span className="text-xs text-muted-foreground">License key:</span>
                        <code className="font-mono text-xs font-semibold">{it.licenseKey}</code>
                      </div>
                    )}
                    <Button size="sm" variant="outline" className="mt-2 w-full gap-1.5">
                      <Download className="h-3.5 w-3.5" /> Download ({it.quantity})
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary p-3 text-sm">
                <span className="text-muted-foreground">Total paid ({success.currency || 'USD'})</span>
                <span className="font-bold">{fmt(success.total)}</span>
              </div>

              <div className="mt-4 rounded-xl border border-dashed p-3 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> A receipt and download links were emailed to {email}.</p>
                <p className="mt-1 flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-brand-yellow-foreground dark:text-brand-yellow" /> Secured by Lemon Squeezy · Invoice #{success.orderNumber}</p>
              </div>

              <Button className="mt-4 w-full" onClick={() => navigate({ name: 'home' })}>
                Continue shopping
              </Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <button onClick={() => navigate({ name: 'shop' })} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </button>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Lock className="h-5 w-5 text-emerald-500" />
          <h1 className="text-2xl font-bold tracking-tight">Secure checkout</h1>
          <Badge variant="secondary" className="ml-1 gap-1">
            <ShieldCheck className="h-3 w-3" /> Lemon Squeezy
          </Badge>
          {lemonStatus?.liveCheckout ? (
            <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live checkout active
            </Badge>
          ) : lemonStatus?.configured ? (
            <Badge variant="outline" className="gap-1 text-amber-600 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> API connected · demo mode
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /> Demo mode
            </Badge>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* form */}
          <div className="space-y-6">
            <section className="rounded-2xl border bg-card p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-navy text-xs text-primary-foreground">1</span>
                Customer information
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email (for delivery)</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@studio.com" />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border bg-card p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-navy text-xs text-primary-foreground">2</span>
                Payment method
              </h2>
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentMethod)} className="grid gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    htmlFor={m.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all',
                      method === m.id ? 'border-brand-yellow ring-1 ring-brand-yellow' : 'hover:border-foreground/30'
                    )}
                  >
                    <RadioGroupItem value={m.id} id={m.id} />
                    <m.icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{m.label}</div>
                      <div className="text-xs text-muted-foreground">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              {method === 'card' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-3">
                  <div>
                    <Label htmlFor="card-number">Card number</Label>
                    <Input
                      id="card-number"
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      value={card.number}
                      onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="exp">Expiry</Label>
                      <Input id="exp" placeholder="MM / YY" value={card.exp} onChange={(e) => setCard((c) => ({ ...c, exp: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" value={card.cvc} onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="cname">Name on card</Label>
                      <Input id="cname" placeholder="JANE DOE" value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">This is a demo — no real payment is processed. Use any test card details.</p>
                </motion.div>
              )}

              {method !== 'card' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
                  You will be redirected to {PAYMENT_METHODS.find((m) => m.id === method)?.label} to complete your purchase securely.
                </motion.div>
              )}
            </section>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Payments are processed securely by Lemon Squeezy. We never store your card details.
            </div>
          </div>

          {/* summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border bg-card p-5 shadow-card-soft">
              <h2 className="text-sm font-semibold">Order summary</h2>
              <div className="mt-4 max-h-72 space-y-3 overflow-y-auto scrollbar-slim pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <ProductCover gradient={item.product.coverGradient} icon={item.product.icon} coverImage={item.product.coverImage} alt={item.product.name} className="h-12 w-12 shrink-0 rounded-lg" showShine={false} />
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-1 text-sm font-medium">{item.product.name}</div>
                      <div className="text-xs text-muted-foreground">Qty {item.quantity} · {item.variant ?? 'Personal'}</div>
                    </div>
                    <span className="text-sm font-semibold">{fmt(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* coupon */}
              {appliedCoupon ? (
                <div className="mb-3 flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Tag className="h-3.5 w-3.5 text-brand-yellow-foreground dark:text-brand-yellow" />
                    {appliedCoupon.code}
                  </span>
                  <button onClick={() => applyCoupon(null)} className="text-muted-foreground hover:text-foreground" aria-label="Remove coupon">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mb-3 flex gap-2">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyCouponCode()}
                    placeholder="Coupon code"
                    className="uppercase"
                  />
                  <Button variant="secondary" onClick={applyCouponCode} disabled={couponLoading}>
                    {couponLoading ? '…' : 'Apply'}
                  </Button>
                </div>
              )}

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span>-{fmt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>{fmt(tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total <span className="text-xs font-normal text-muted-foreground">({currencyInfo.code})</span></span>
                  <span>{fmt(total)}</span>
                </div>
                {currencyInfo.code !== 'USD' && (
                  <p className="text-[11px] text-muted-foreground">
                    ≈ ${total.toFixed(2)} USD base · checkout processed in USD via Lemon Squeezy.
                  </p>
                )}
              </div>

              <Button size="lg" className="mt-4 w-full gap-2" onClick={pay} disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Pay {fmt(total)}
                  </>
                )}
              </Button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <span className="rounded border px-1.5 py-0.5">VISA</span>
                <span className="rounded border px-1.5 py-0.5">MASTERCARD</span>
                <span className="rounded border px-1.5 py-0.5">AMEX</span>
                <span className="rounded border px-1.5 py-0.5">PAYPAL</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  )
}
