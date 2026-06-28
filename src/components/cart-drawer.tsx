'use client'

import * as React from 'react'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, X, ShieldCheck, Truck } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProductCover } from '@/components/product-cover'
import { useStore } from '@/store/use-store'
import { calcDiscount } from '@/lib/format'
import { useCurrency } from '@/lib/use-currency'
import { toast } from 'sonner'

export function CartDrawer() {
  const open = useStore((s) => s.cartOpen)
  const setOpen = useStore((s) => s.setCartOpen)
  const cart = useStore((s) => s.cart)
  const updateQuantity = useStore((s) => s.updateQuantity)
  const removeFromCart = useStore((s) => s.removeFromCart)
  const navigate = useStore((s) => s.navigate)
  const appliedCoupon = useStore((s) => s.appliedCoupon)
  const applyCoupon = useStore((s) => s.applyCoupon)
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const { format: fmt } = useCurrency()

  const subtotal = cart.reduce((n, i) => n + i.product.price * i.quantity, 0)
  const discount = calcDiscount(subtotal, appliedCoupon)
  const tax = Math.round(Math.max(0, subtotal - discount) * 0.08 * 100) / 100
  const total = Math.round((subtotal - discount + tax) * 100) / 100

  const applyCode = async () => {
    if (!code.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Invalid code')
        return
      }
      applyCoupon(data.coupon)
      toast.success(`Coupon ${data.coupon.code} applied`)
      setCode('')
    } catch {
      toast.error('Could not validate coupon')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-yellow-foreground dark:text-brand-yellow" />
            Your Cart
            <Badge variant="secondary" className="ml-1">
              {cart.reduce((n, i) => n + i.quantity, 0)} items
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-9 w-9 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Your cart is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">Discover premium digital products and start building.</p>
            </div>
            <Button
              onClick={() => {
                setOpen(false)
                navigate({ name: 'shop' })
              }}
              className="gap-1.5"
            >
              Browse products <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto scrollbar-slim p-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 rounded-xl border bg-card p-2.5">
                  <ProductCover
                    gradient={item.product.coverGradient}
                    icon={item.product.icon}
                    coverImage={item.product.coverImage}
                    alt={item.product.name}
                    className="h-16 w-16 shrink-0 rounded-lg"
                    showShine={false}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => {
                          setOpen(false)
                          navigate({ name: 'product', slug: item.product.slug })
                        }}
                        className="line-clamp-1 text-left text-sm font-semibold hover:underline"
                      >
                        {item.product.name}
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-l-full hover:bg-secondary"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="grid h-7 w-7 place-items-center rounded-r-full hover:bg-secondary"
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">{fmt(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* coupon */}
            <div className="border-t p-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Tag className="h-3.5 w-3.5 text-brand-yellow-foreground dark:text-brand-yellow" />
                    {appliedCoupon.code}
                    <span className="text-muted-foreground">· -{fmt(discount)}</span>
                  </span>
                  <button
                    onClick={() => {
                      applyCoupon(null)
                      toast('Coupon removed')
                    }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Remove coupon"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyCode()}
                    placeholder="Coupon code"
                    className="uppercase"
                  />
                  <Button variant="secondary" onClick={applyCode} disabled={loading}>
                    Apply
                  </Button>
                </div>
              )}
            </div>

            {/* summary */}
            <div className="space-y-3 border-t p-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span>-{fmt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium">{fmt(tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full gap-1.5"
                onClick={() => {
                  setOpen(false)
                  navigate({ name: 'checkout' })
                }}
              >
                Secure Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Secure</span>
                <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Instant delivery</span>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
