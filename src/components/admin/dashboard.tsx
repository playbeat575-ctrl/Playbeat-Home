'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import {
  DollarSign, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Package,
  CreditCard, RotateCcw, Activity, Crown,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAdminStats, useAdminOrders } from '@/lib/hooks'
import { formatCurrency, formatCompact, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

const PIE_COLORS = ['#1e3a8a', '#facc15', '#10b981', '#f43f5e', '#94a3b8']

export function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats()
  const { data: ordersData } = useAdminOrders()
  const recentOrders = ordersData?.orders.slice(0, 6) ?? []

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    )
  }

  const kpis = [
    { label: 'Revenue (30d)', value: formatCurrency(stats.revenue), change: stats.revenueChange, icon: DollarSign, tint: 'text-emerald-600' },
    { label: 'Orders (30d)', value: stats.orders.toLocaleString(), change: stats.ordersChange, icon: ShoppingCart, tint: 'text-blue-600' },
    { label: 'Customers', value: stats.customers.toLocaleString(), change: stats.customersChange, icon: Users, tint: 'text-violet-600' },
    { label: 'Conversion', value: `${stats.conversion}%`, change: stats.conversionChange, icon: TrendingUp, tint: 'text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="relative overflow-hidden p-5 shadow-card-soft">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k.label}</div>
                  <div className="mt-2 text-2xl font-bold tracking-tight">{k.value}</div>
                </div>
                <div className={cn('grid h-10 w-10 place-items-center rounded-xl bg-secondary', k.tint)}>
                  <k.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs">
                <span className={cn('inline-flex items-center gap-0.5 font-semibold', k.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500')}>
                  {k.change >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {Math.abs(k.change)}%
                </span>
                <span className="text-muted-foreground">vs last 30 days</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* revenue area chart */}
        <Card className="p-5 shadow-card-soft lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Revenue overview</h3>
              <p className="text-xs text-muted-foreground">Monthly revenue · last 12 months</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Activity className="h-3 w-3" /> Live
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats.revenueSeries} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#facc15" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#facc15" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} tickFormatter={(v) => `$${formatCompact(v)}`} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
                formatter={(v: any) => [formatCurrency(v), 'Revenue']}
              />
              <Area type="monotone" dataKey="value" stroke="#facc15" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* status breakdown pie */}
        <Card className="p-5 shadow-card-soft">
          <h3 className="text-sm font-semibold">Order status</h3>
          <p className="text-xs text-muted-foreground">Distribution of all orders</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.statusBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {stats.statusBreakdown.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {stats.statusBreakdown.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 capitalize">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {s.name}
                </span>
                <span className="font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 shadow-card-soft">
          <h3 className="text-sm font-semibold">Weekly sales</h3>
          <p className="text-xs text-muted-foreground">Orders per week · last 8 weeks</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.weeklySeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="value" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 shadow-card-soft">
          <h3 className="text-sm font-semibold">Customer growth</h3>
          <p className="text-xs text-muted-foreground">Cumulative customers</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.customerGrowth} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 shadow-card-soft">
          <h3 className="text-sm font-semibold">Top products</h3>
          <p className="text-xs text-muted-foreground">By units sold</p>
          <div className="mt-3 space-y-3">
            {stats.topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-bold">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-xs font-medium">{p.name}</div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('h-full rounded-full bg-gradient-to-r', p.gradient)}
                      style={{ width: `${(p.sales / stats.topProducts[0].sales) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold">{formatCurrency(p.revenue)}</div>
                  <div className="text-[10px] text-muted-foreground">{formatCompact(p.sales)} sold</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* secondary KPIs + recent orders */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-1">
          <MiniStat icon={Package} label="Products" value={stats.productCount.toString()} />
          <MiniStat icon={CreditCard} label="Avg order value" value={formatCurrency(stats.aov)} />
          <MiniStat icon={RotateCcw} label="Refunds (total)" value={formatCurrency(stats.refundTotal)} tint="text-rose-500" />
          <MiniStat icon={Crown} label="Pro members" value="8.4K" tint="text-brand-yellow-foreground dark:text-brand-yellow" />
        </div>

        <Card className="p-5 shadow-card-soft lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Recent orders</h3>
              <p className="text-xs text-muted-foreground">Latest transactions</p>
            </div>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Order</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 text-right font-medium">Total</th>
                  <th className="pb-2 text-right font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-2.5 font-mono text-xs">{o.number}</td>
                    <td className="py-2.5">
                      <div className="text-xs font-medium">{o.customerName}</div>
                      <div className="text-[10px] text-muted-foreground">{o.customerEmail}</div>
                    </td>
                    <td className="py-2.5"><StatusBadge status={o.status} /></td>
                    <td className="py-2.5 text-right font-semibold">{formatCurrency(o.total)}</td>
                    <td className="py-2.5 text-right text-xs text-muted-foreground">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

function MiniStat({ icon: Icon, label, value, tint }: { icon: any; label: string; value: string; tint?: string }) {
  return (
    <Card className="flex items-center gap-3 p-4 shadow-card-soft">
      <div className={cn('grid h-10 w-10 place-items-center rounded-xl bg-secondary', tint)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
    </Card>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    processing: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    refunded: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    cancelled: 'bg-muted text-muted-foreground',
  }
  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize', map[status] || 'bg-muted text-muted-foreground')}>
      {status}
    </span>
  )
}
