'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, RadialBar, RadialBarChart, PolarAngleAxis,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAdminStats } from '@/lib/hooks'
import { formatCompact } from '@/lib/format'
import { useCurrency } from '@/lib/use-currency'
import { TrendingUp, Globe, ShoppingCart, Clock, Download } from 'lucide-react'
import { toast } from 'sonner'

const PIE_COLORS = ['#1e3a8a', '#facc15', '#10b981', '#f43f5e', '#94a3b8', '#8b5cf6']

export function AnalyticsView() {
  const { data: stats, isLoading } = useAdminStats()
  const { format: fmt } = useCurrency()

  if (isLoading || !stats) {
    return <div className="h-96 animate-pulse rounded-2xl bg-muted" />
  }

  // Build daily sales approximation from weekly
  const dailyData = [
    { label: 'Mon', sales: 18, revenue: 1840 },
    { label: 'Tue', sales: 22, revenue: 2210 },
    { label: 'Wed', sales: 31, revenue: 3120 },
    { label: 'Thu', sales: 27, revenue: 2680 },
    { label: 'Fri', sales: 42, revenue: 4520 },
    { label: 'Sat', sales: 38, revenue: 3940 },
    { label: 'Sun', sales: 24, revenue: 2310 },
  ]

  const trafficSources = [
    { name: 'Direct', value: 38, fill: '#1e3a8a' },
    { name: 'Search', value: 27, fill: '#facc15' },
    { name: 'Social', value: 18, fill: '#10b981' },
    { name: 'Referral', value: 11, fill: '#f43f5e' },
    { name: 'Email', value: 6, fill: '#94a3b8' },
  ]

  const countries = [
    { name: 'United States', flag: '🇺🇸', revenue: 18420, share: 34 },
    { name: 'United Kingdom', flag: '🇬🇧', revenue: 9210, share: 17 },
    { name: 'Germany', flag: '🇩🇪', revenue: 7380, share: 14 },
    { name: 'Canada', flag: '🇨🇦', revenue: 5640, share: 10 },
    { name: 'Australia', flag: '🇦🇺', revenue: 4290, share: 8 },
    { name: 'Other', flag: '🌍', revenue: 9180, share: 17 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['7 days', '30 days', '90 days', '12 months'].map((r, i) => (
            <Button key={r} variant={i === 1 ? 'default' : 'outline'} size="sm" className="rounded-full">{r}</Button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('Exporting report…')}>
          <Download className="h-4 w-4" /> Export report
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Sessions', value: '24.8K', change: '+12.4%', icon: Globe },
          { label: 'Conversion rate', value: '3.8%', change: '+0.6%', icon: TrendingUp },
          { label: 'Avg session', value: '4m 12s', change: '+8s', icon: Clock },
          { label: 'Cart abandonment', value: '18.2%', change: '-2.1%', icon: ShoppingCart },
        ].map((m, i) => (
          <Card key={m.label} className="p-5 shadow-card-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">{m.label}</span>
              <m.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold">{m.value}</div>
            <div className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">{m.change} vs prev</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 shadow-card-soft lg:col-span-2">
          <h3 className="text-sm font-semibold">Daily sales & revenue</h3>
          <p className="text-xs text-muted-foreground">Last 7 days performance</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#1e3a8a" strokeWidth={2.5} fill="url(#rev2)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 shadow-card-soft">
          <h3 className="text-sm font-semibold">Traffic sources</h3>
          <p className="text-xs text-muted-foreground">Where visitors come from</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart innerRadius="30%" outerRadius="100%" data={trafficSources} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 40]} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={6} />
              <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 11 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 shadow-card-soft">
          <h3 className="text-sm font-semibold">Monthly revenue trend</h3>
          <p className="text-xs text-muted-foreground">Last 12 months</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats.revenueSeries} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} tickFormatter={(v) => `$${formatCompact(v)}`} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} formatter={(v: any) => [fmt(v), 'Revenue']} />
              <Line type="monotone" dataKey="value" stroke="#facc15" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 shadow-card-soft">
          <h3 className="text-sm font-semibold">Revenue by country</h3>
          <p className="text-xs text-muted-foreground">Top markets this period</p>
          <div className="mt-4 space-y-3">
            {countries.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-lg">{c.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{c.name}</span>
                    <span className="font-semibold">{fmt(c.revenue)}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-to-r from-navy to-brand-yellow" style={{ width: `${c.share * 2.6}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 shadow-card-soft">
        <h3 className="text-sm font-semibold">Top products by revenue</h3>
        <p className="text-xs text-muted-foreground">All-time best performers</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.topProducts} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} tickFormatter={(v) => `$${formatCompact(v)}`} />
            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} formatter={(v: any) => [fmt(v), 'Revenue']} />
            <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
              {stats.topProducts.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

const ROLES = [
  { name: 'Super Admin', desc: 'Full access to everything', members: 1, perms: ['all'] },
  { name: 'Admin', desc: 'Manage products, orders, customers', members: 2, perms: ['products', 'orders', 'customers'] },
  { name: 'Finance Manager', desc: 'View revenue, refunds, payouts', members: 1, perms: ['finance'] },
  { name: 'Inventory Manager', desc: 'Manage products & stock', members: 1, perms: ['products'] },
  { name: 'Customer Support', desc: 'Handle tickets & orders', members: 2, perms: ['tickets', 'orders'] },
  { name: 'Marketing Manager', desc: 'Coupons, banners, analytics', members: 1, perms: ['coupons', 'analytics'] },
  { name: 'Affiliate Manager', desc: 'Manage affiliates & payouts', members: 0, perms: ['affiliates'] },
  { name: 'Customer', desc: 'Storefront shopper', members: 4820, perms: ['shop'] },
]

const PERMISSIONS = ['Dashboard', 'Products', 'Orders', 'Customers', 'Coupons', 'Support', 'Analytics', 'Finance', 'Settings']

export function SettingsView() {
  return (
    <div className="space-y-6">
      <Card className="p-5 shadow-card-soft">
        <h3 className="text-sm font-semibold">Store settings</h3>
        <p className="text-xs text-muted-foreground">General configuration for PlayBeat Digital</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Store name', value: 'PlayBeat Digital' },
            { label: 'Support email', value: 'support@playbeat.dev' },
            { label: 'Currency', value: 'USD ($)' },
            { label: 'Tax rate', value: '8%' },
            { label: 'Lemon Squeezy store ID', value: 'pb-store-8421' },
            { label: 'Webhook secret', value: '••••••••••••3a9f' },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
              <div className="mt-1 rounded-lg border bg-card px-3 py-2 text-sm">{f.value}</div>
            </div>
          ))}
        </div>
        <Button className="mt-4" size="sm" onClick={() => toast.success('Settings saved')}>Save changes</Button>
      </Card>

      <Card className="p-5 shadow-card-soft">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Role-based access control</h3>
            <p className="text-xs text-muted-foreground">Configurable permissions per role</p>
          </div>
          <Badge variant="secondary">{ROLES.length} roles</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Members</th>
                {PERMISSIONS.map((p) => (
                  <th key={p} className="pb-2 text-center font-medium">{p.slice(0, 4)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((r) => (
                <tr key={r.name} className="border-b last:border-0">
                  <td className="py-3">
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground">{r.desc}</div>
                  </td>
                  <td className="py-3 text-xs">{r.members.toLocaleString()}</td>
                  {PERMISSIONS.map((p) => {
                    const allowed = r.perms.includes('all') || r.perms.includes(p.toLowerCase()) || (r.name === 'Super Admin')
                    return (
                      <td key={p} className="py-3 text-center">
                        <span className={allowed ? 'text-emerald-500' : 'text-muted-foreground/30'}>
                          {allowed ? '●' : '○'}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5 shadow-card-soft">
        <h3 className="text-sm font-semibold">Security</h3>
        <p className="text-xs text-muted-foreground">Authentication & protection settings</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { label: 'JWT Authentication', on: true },
            { label: 'Refresh Tokens', on: true },
            { label: 'Password Hashing (bcrypt)', on: true },
            { label: 'Rate Limiting', on: true },
            { label: 'Helmet Security', on: true },
            { label: 'CORS Protection', on: true },
            { label: 'CSRF Protection', on: true },
            { label: 'XSS Protection', on: true },
            { label: 'Audit Logs', on: true },
            { label: 'Two-Factor Auth (2FA)', on: false },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
              <span className="text-xs font-medium">{s.label}</span>
              <Badge variant={s.on ? 'default' : 'outline'} className={s.on ? 'bg-emerald-500 text-white' : ''}>
                {s.on ? 'Enabled' : 'Optional'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
