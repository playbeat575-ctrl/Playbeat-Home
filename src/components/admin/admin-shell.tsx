'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Ticket, BarChart3, Settings,
  Sparkles, ArrowLeft, Search, Bell, Tag, ChevronRight, Crown, LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
import { useStore } from '@/store/use-store'
import { useAdminStats } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import type { AdminSection } from '@/lib/types'

const NAV: { section: AdminSection; label: string; icon: any }[] = [
  { section: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { section: 'analytics', label: 'Analytics', icon: BarChart3 },
  { section: 'products', label: 'Products', icon: Package },
  { section: 'orders', label: 'Orders', icon: ShoppingCart },
  { section: 'customers', label: 'Customers', icon: Users },
  { section: 'coupons', label: 'Coupons', icon: Tag },
  { section: 'tickets', label: 'Support', icon: Ticket },
  { section: 'settings', label: 'Settings', icon: Settings },
]

export function AdminShell({
  section,
  children,
  title,
  description,
}: {
  section: AdminSection
  children: React.ReactNode
  title: string
  description: string
}) {
  const navigate = useStore((s) => s.navigate)
  const view = useStore((s) => s.view)
  const currentSection = (view.name === 'admin' ? view.section : 'dashboard') as AdminSection
  const { data: stats } = useAdminStats()

  const [mobileNav, setMobileNav] = React.useState(false)

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card transition-transform lg:static lg:translate-x-0',
          mobileNav ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy">
              <Sparkles className="h-4 w-4 text-brand-yellow" />
            </span>
            <span className="text-sm font-bold">PlayBeat <span className="text-brand-yellow-foreground dark:text-brand-yellow">Admin</span></span>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-slim">
          <div className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Overview</div>
          {NAV.slice(0, 2).map((item) => (
            <NavItem key={item.section} item={item} active={currentSection === item.section} />
          ))}
          <div className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Catalog & Sales</div>
          {NAV.slice(2, 6).map((item) => (
            <NavItem key={item.section} item={item} active={currentSection === item.section} />
          ))}
          <div className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">System</div>
          {NAV.slice(6).map((item) => (
            <NavItem key={item.section} item={item} active={currentSection === item.section} />
          ))}
        </nav>

        {/* mini stats */}
        {stats && (
          <div className="border-t p-3">
            <div className="rounded-xl bg-secondary/60 p-3">
              <div className="text-[11px] text-muted-foreground">Revenue (30d)</div>
              <div className="text-lg font-bold">${stats.revenue.toLocaleString()}</div>
              <div className={cn('text-[11px] font-medium', stats.revenueChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500')}>
                {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}% vs last period
              </div>
            </div>
          </div>
        )}

        <div className="border-t p-3">
          <button
            onClick={() => navigate({ name: 'home' })}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to storefront
          </button>
        </div>
      </aside>

      {mobileNav && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileNav(false)} />}

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open menu">
            <LayoutDashboard className="h-5 w-5" />
          </Button>
          <div className="relative hidden flex-1 max-w-sm sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search admin…" className="h-9 rounded-full pl-9" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-yellow" />
            </Button>
            <ThemeToggle />
            <div className="flex items-center gap-2 rounded-full border px-2 py-1">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-navy text-[10px] font-bold text-primary-foreground">SA</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <div className="text-xs font-semibold leading-tight">Super Admin</div>
                <div className="text-[10px] text-muted-foreground">admin@playbeat.dev</div>
              </div>
              <Crown className="h-3.5 w-3.5 text-brand-yellow" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Admin</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{title}</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )

  function NavItem({ item, active }: { item: { section: AdminSection; label: string; icon: any }; active: boolean }) {
    return (
      <button
        onClick={() => navigate({ name: 'admin', section: item.section })}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          active ? 'bg-navy text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        )}
      >
        <item.icon className={cn('h-4 w-4', active && 'text-brand-yellow')} />
        {item.label}
        {item.section === 'orders' && (
          <Badge variant="secondary" className={cn('ml-auto text-[10px]', active && 'bg-white/20 text-primary-foreground')}>12</Badge>
        )}
        {item.section === 'tickets' && (
          <Badge variant="secondary" className={cn('ml-auto text-[10px]', active && 'bg-white/20 text-primary-foreground')}>3</Badge>
        )}
      </button>
    )
  }
}
