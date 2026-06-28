'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Product, View, AdminSection, Role } from '@/lib/types'
import type { CurrencyCode } from '@/lib/format'
import { DEFAULT_CURRENCY } from '@/lib/format'

interface StoreState {
  // Navigation
  view: View
  navigate: (view: View) => void

  // Currency
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => void

  // Cart
  cart: CartItem[]
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  addToCart: (product: Product, quantity?: number, variant?: string) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartCount: () => number
  cartSubtotal: () => number

  // Wishlist
  wishlist: string[] // product ids
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean

  // Recently viewed
  recentlyViewed: string[]

  // Coupon
  appliedCoupon: { code: string; type: string; value: number } | null
  applyCoupon: (c: { code: string; type: string; value: number } | null) => void

  // Auth (mock)
  user: { name: string; email: string; role: Role } | null
  signIn: (email: string, role?: Role) => void
  signOut: () => void

  // Search
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      view: { name: 'home' },
      navigate: (view) => {
        set({ view })
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      },

      currency: DEFAULT_CURRENCY,
      setCurrency: (c) => set({ currency: c }),

      cart: [],
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),
      addToCart: (product, quantity = 1, variant) =>
        set((s) => {
          const existing = s.cart.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              cart: s.cart.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
              cartOpen: true,
            }
          }
          return { cart: [...s.cart, { product, quantity, variant }], cartOpen: true }
        }),
      removeFromCart: (productId) =>
        set((s) => ({ cart: s.cart.filter((i) => i.product.id !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((s) => ({
          cart:
            quantity <= 0
              ? s.cart.filter((i) => i.product.id !== productId)
              : s.cart.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ cart: [], appliedCoupon: null }),
      cartCount: () => get().cart.reduce((n, i) => n + i.quantity, 0),
      cartSubtotal: () => get().cart.reduce((n, i) => n + i.product.price * i.quantity, 0),

      wishlist: [],
      toggleWishlist: (productId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(productId)
            ? s.wishlist.filter((id) => id !== productId)
            : [...s.wishlist, productId],
        })),
      isWishlisted: (productId) => get().wishlist.includes(productId),

      recentlyViewed: [],

      appliedCoupon: null,
      applyCoupon: (c) => set({ appliedCoupon: c }),

      user: null,
      signIn: (email, role = 'customer') =>
        set({
          user: {
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
            email,
            role,
          },
        }),
      signOut: () => set({ user: null }),

      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),
    }),
    {
      name: 'playbeat-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        cart: s.cart,
        wishlist: s.wishlist,
        recentlyViewed: s.recentlyViewed,
        appliedCoupon: s.appliedCoupon,
        user: s.user,
        currency: s.currency,
      }),
    }
  )
)

// Helper hook for marking a product as recently viewed
export function useRecentlyViewed() {
  return {
    add: (productId: string) =>
      useStore.setState((s) => ({
        recentlyViewed: [productId, ...s.recentlyViewed.filter((id) => id !== productId)].slice(0, 8),
      })),
    list: () => useStore.getState().recentlyViewed,
  }
}

export function goToAdmin(section: AdminSection = 'dashboard') {
  useStore.getState().navigate({ name: 'admin', section })
}
