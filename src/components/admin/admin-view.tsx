'use client'

import * as React from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminLogin } from '@/components/admin/admin-login'
import { AdminDashboard } from '@/components/admin/dashboard'
import { ProductsTable, OrdersTable, CustomersTable, CouponsTable, TicketsTable } from '@/components/admin/admin-tables'
import { AnalyticsView, SettingsView } from '@/components/admin/admin-views'
import { StorefrontBuilder } from '@/components/admin/storefront-builder'
import { LemonLinker } from '@/components/admin/lemon-linker'
import { ProductForm } from '@/components/admin/product-form'
import { useStore } from '@/store/use-store'
import type { AdminSection } from '@/lib/types'

const META: Record<AdminSection, { title: string; description: string }> = {
  dashboard: { title: 'Dashboard', description: 'Revenue, sales and customer insights at a glance.' },
  analytics: { title: 'Analytics', description: 'Deep-dive into traffic, conversion and product performance.' },
  'add-product': { title: 'Add Product', description: 'Create a new digital product with price, image and details.' },
  products: { title: 'Product Manager', description: 'Manage your digital catalog — edit, duplicate or delete products.' },
  storefront: { title: 'Storefront Builder', description: 'Curate which products appear in each section of your home page.' },
  lemon: { title: 'Lemon Squeezy', description: 'Link PlayBeat products to Lemon Squeezy variants for live hosted checkout.' },
  orders: { title: 'Orders', description: 'Track and fulfill customer orders, refunds and invoices.' },
  customers: { title: 'Customers', description: 'View customer profiles, points and referral activity.' },
  coupons: { title: 'Coupons', description: 'Create and manage discount codes and promotions.' },
  tickets: { title: 'Support Tickets', description: 'Resolve customer support requests and issues.' },
  categories: { title: 'Categories', description: 'Organize your catalog with categories.' },
  reviews: { title: 'Reviews', description: 'Moderate product reviews and ratings.' },
  settings: { title: 'Settings', description: 'Store configuration, roles, permissions and security.' },
}

export function AdminView({ section = 'dashboard' }: { section?: AdminSection }) {
  const adminAuthed = useStore((s) => s.adminAuthed)
  const navigate = useStore((s) => s.navigate)
  const [formOpen, setFormOpen] = React.useState(false)

  // Login gate
  if (!adminAuthed) {
    return <AdminLogin />
  }

  const meta = META[section] ?? META.dashboard

  return (
    <AdminShell section={section} title={meta.title} description={meta.description}>
      {section === 'dashboard' && <AdminDashboard />}
      {section === 'analytics' && <AnalyticsView />}
      {section === 'add-product' && (
        <AddProductLanding onOpenForm={() => setFormOpen(true)} onGoToProducts={() => navigate({ name: 'admin', section: 'products' })} />
      )}
      {section === 'products' && <ProductsTable />}
      {section === 'storefront' && <StorefrontBuilder />}
      {section === 'lemon' && <LemonLinker />}
      {section === 'orders' && <OrdersTable />}
      {section === 'customers' && <CustomersTable />}
      {section === 'coupons' && <CouponsTable />}
      {section === 'tickets' && <TicketsTable />}
      {(section === 'categories' || section === 'reviews') && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
          <h3 className="text-lg font-semibold capitalize">{meta.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">This module is part of the CMS. Use the settings to configure {meta.title.toLowerCase()}.</p>
        </div>
      )}
      {section === 'settings' && <SettingsView />}

      {/* Shared product form (used by Add Product landing) */}
      <ProductForm open={formOpen} onOpenChange={setFormOpen} editing={null} />
    </AdminShell>
  )
}

function AddProductLanding({ onOpenForm, onGoToProducts }: { onOpenForm: () => void; onGoToProducts: () => void }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-navy to-navy-soft p-8 text-primary-foreground">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-yellow/20 blur-3xl" />
        <div className="relative">
          <h2 className="text-2xl font-bold">Add a new product</h2>
          <p className="mt-1 max-w-lg text-sm text-primary-foreground/70">
            Create a digital product with a name, price, cover image and storefront placement. Fill in the form to publish it to your marketplace instantly.
          </p>
          <button
            onClick={onOpenForm}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-brand-yellow-foreground transition hover:bg-brand-yellow/90"
          >
            Open product form
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { step: '1', title: 'Add name & price', desc: 'Set the product name, brand, tagline and price in USD.' },
          { step: '2', title: 'Upload an image', desc: 'Drag a cover image or paste a URL — shown on every card.' },
          { step: '3', title: 'Pick placement', desc: 'Toggle Featured, Trending, Best Seller, Flash Deal or New.' },
          { step: '4', title: 'Publish instantly', desc: 'The product goes live on your storefront immediately.' },
        ].map((s) => (
          <div key={s.step} className="rounded-2xl border bg-card p-5 shadow-card-soft">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-yellow text-sm font-bold text-brand-yellow-foreground">{s.step}</div>
            <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-5">
        <div>
          <h3 className="text-sm font-semibold">Already have products?</h3>
          <p className="text-xs text-muted-foreground">Manage, edit, duplicate or delete existing products in the Product Manager.</p>
        </div>
        <button
          onClick={onGoToProducts}
          className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-brand-yellow"
        >
          Go to Product Manager →
        </button>
      </div>
    </div>
  )
}
