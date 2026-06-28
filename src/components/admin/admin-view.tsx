'use client'

import { AdminShell } from '@/components/admin/admin-shell'
import { AdminDashboard } from '@/components/admin/dashboard'
import { ProductsTable, OrdersTable, CustomersTable, CouponsTable, TicketsTable } from '@/components/admin/admin-tables'
import { AnalyticsView, SettingsView } from '@/components/admin/admin-views'
import type { AdminSection } from '@/lib/types'

const META: Record<AdminSection, { title: string; description: string }> = {
  dashboard: { title: 'Dashboard', description: 'Revenue, sales and customer insights at a glance.' },
  analytics: { title: 'Analytics', description: 'Deep-dive into traffic, conversion and product performance.' },
  products: { title: 'Products', description: 'Manage your digital catalog, pricing and inventory.' },
  orders: { title: 'Orders', description: 'Track and fulfill customer orders, refunds and invoices.' },
  customers: { title: 'Customers', description: 'View customer profiles, points and referral activity.' },
  coupons: { title: 'Coupons', description: 'Create and manage discount codes and promotions.' },
  tickets: { title: 'Support Tickets', description: 'Resolve customer support requests and issues.' },
  categories: { title: 'Categories', description: 'Organize your catalog with categories.' },
  reviews: { title: 'Reviews', description: 'Moderate product reviews and ratings.' },
  settings: { title: 'Settings', description: 'Store configuration, roles, permissions and security.' },
}

export function AdminView({ section = 'dashboard' }: { section?: AdminSection }) {
  const meta = META[section] ?? META.dashboard
  return (
    <AdminShell section={section} title={meta.title} description={meta.description}>
      {section === 'dashboard' && <AdminDashboard />}
      {section === 'analytics' && <AnalyticsView />}
      {section === 'products' && <ProductsTable />}
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
    </AdminShell>
  )
}
