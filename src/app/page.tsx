'use client'

import * as React from 'react'
import { QueryProvider } from '@/components/query-provider'
import { Navbar } from '@/components/navbar'
import { CartDrawer } from '@/components/cart-drawer'
import { HomeView } from '@/components/shop/home-view'
import { ShopView } from '@/components/shop/shop-view'
import { ProductDetailView } from '@/components/shop/product-detail-view'
import { WishlistView } from '@/components/shop/wishlist-view'
import { CheckoutView } from '@/components/shop/checkout-view'
import { AdminView } from '@/components/admin/admin-view'
import { useStore } from '@/store/use-store'

export default function Home() {
  return (
    <QueryProvider>
      <App />
    </QueryProvider>
  )
}

function App() {
  const view = useStore((s) => s.view)
  const isAdmin = view.name === 'admin'

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdmin && <Navbar />}
      <main className="flex flex-1 flex-col">
        <ViewRouter />
      </main>
      {!isAdmin && <CartDrawer />}
    </div>
  )
}

function ViewRouter() {
  const view = useStore((s) => s.view)

  switch (view.name) {
    case 'home':
      return <HomeView />
    case 'shop':
      return <ShopView initialCategory={view.category} />
    case 'product':
      return <ProductDetailView slug={view.slug} />
    case 'wishlist':
      return <WishlistView />
    case 'checkout':
      return <CheckoutView />
    case 'admin':
      return <AdminView section={view.section} />
    default:
      return <HomeView />
  }
}
