'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Search, MoreHorizontal, Plus, Download, Eye, Pencil, Trash2, RotateCcw, Send, Mail,
  Star, Filter, FileDown, Tag, CheckCircle2, XCircle, AlertCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProductCover } from '@/components/product-cover'
import { StatusBadge } from '@/components/admin/dashboard'
import { useAdminProducts, useAdminOrders, useAdminCustomers, useAdminCoupons, useAdminTickets } from '@/lib/hooks'
import { formatDate, formatCompact } from '@/lib/format'
import { useCurrency } from '@/lib/use-currency'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function ProductsTable() {
  const { data, isLoading } = useAdminProducts()
  const products = data?.products ?? []
  const [search, setSearch] = React.useState('')
  const { format: fmt } = useCurrency()

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card className="overflow-hidden shadow-card-soft">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('Exporting CSV…')}>
            <FileDown className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => toast.info('Open product editor')}>
            <Plus className="h-4 w-4" /> New product
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-secondary/40">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Sales</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={7} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-muted" /></td>
                  </tr>
                ))
              : filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductCover gradient={p.coverGradient} icon={p.icon} coverImage={p.coverImage} alt={p.name} className="h-10 w-10 shrink-0 rounded-lg" showShine={false} />
                        <div className="min-w-0">
                          <div className="line-clamp-1 text-sm font-medium">{p.name}</div>
                          <div className="text-[11px] text-muted-foreground">{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.category?.name ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold">{fmt(p.price)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatCompact(p.salesCount)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
                        {p.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.featured && <Badge variant="secondary" className="text-[10px]">Featured</Badge>}
                        {p.flashDeal && <Badge className="bg-brand-yellow/20 text-brand-yellow-foreground text-[10px] dark:text-brand-yellow">Flash</Badge>}
                        {p.isSubscription && <Badge variant="outline" className="text-[10px]">Sub</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => toast.info(`Viewing ${p.name}`)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Opening editor')}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Duplicated')}><Plus className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-rose-600" onClick={() => toast.error('Archived (demo)')}><Trash2 className="mr-2 h-4 w-4" /> Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t p-3 text-xs text-muted-foreground">
        <span>{filtered.length} products</span>
        <span>Page 1 of 1</span>
      </div>
    </Card>
  )
}

export function OrdersTable() {
  const { data, isLoading } = useAdminOrders()
  const orders = data?.orders ?? []
  const [search, setSearch] = React.useState('')
  const [status, setStatus] = React.useState('all')
  const { format: fmt } = useCurrency()

  const { data: filteredData } = useAdminOrders(status)
  const list = (status === 'all' ? orders : filteredData?.orders ?? orders).filter(
    (o) => o.customerName.toLowerCase().includes(search.toLowerCase()) || o.number.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card className="overflow-hidden shadow-card-soft">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('Generating invoice PDF…')}>
            <FileDown className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-secondary/40">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b"><td colSpan={8} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-muted" /></td></tr>
                ))
              : list.map((o) => (
                  <tr key={o.id} className="border-b last:border-0 transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-xs">{o.number}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium">{o.customerName}</div>
                      <div className="text-[10px] text-muted-foreground">{o.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{o.items.length} item{o.items.length === 1 ? '' : 's'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="capitalize text-xs">{(o.paymentMethod || 'card').replace('_', ' ')}</span>
                        {o.couponCode && <Badge variant="outline" className="text-[10px]">{o.couponCode}</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 font-semibold">{fmt(o.total)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info('Generating invoice PDF…')}><FileDown className="mr-2 h-4 w-4" /> Generate invoice</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Resending download link…')}><Send className="mr-2 h-4 w-4" /> Resend download link</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Opening order')}><Eye className="mr-2 h-4 w-4" /> View details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-rose-600" onClick={() => toast.error('Refund initiated (demo)')}><RotateCcw className="mr-2 h-4 w-4" /> Refund order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t p-3 text-xs text-muted-foreground">
        <span>{list.length} orders</span>
        <span>Showing latest {list.length}</span>
      </div>
    </Card>
  )
}

export function CustomersTable() {
  const { data, isLoading } = useAdminCustomers()
  const customers = data?.customers ?? []
  const [search, setSearch] = React.useState('')

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card className="overflow-hidden shadow-card-soft">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('Exporting CSV…')}>
          <FileDown className="h-4 w-4" /> Export
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-secondary/40">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Points</th>
              <th className="px-4 py-3 font-medium">Referral</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b"><td colSpan={8} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-muted" /></td></tr>
                ))
              : filtered.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-primary-foreground">
                          {c.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </span>
                        <div>
                          <div className="text-sm font-medium">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="capitalize text-[10px]">{c.role.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs">{c.orderCount}</td>
                    <td className="px-4 py-3 text-xs"><span className="font-semibold text-brand-yellow-foreground dark:text-brand-yellow">{c.points}</span> pts</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{c.referralCode}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1 text-[11px] font-medium capitalize',
                        c.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600')}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', c.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500')} />
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info(`Viewing ${c.name}`)}><Eye className="mr-2 h-4 w-4" /> View profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Opening email')}><Mail className="mr-2 h-4 w-4" /> Email</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Adjusting points')}><Tag className="mr-2 h-4 w-4" /> Adjust points</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t p-3 text-xs text-muted-foreground">
        <span>{filtered.length} customers</span>
      </div>
    </Card>
  )
}

export function CouponsTable() {
  const { data, isLoading } = useAdminCoupons()
  const coupons = data?.coupons ?? []
  const { format: fmt } = useCurrency()

  return (
    <Card className="overflow-hidden shadow-card-soft">
      <div className="flex items-center justify-between border-b p-4">
        <div className="text-sm text-muted-foreground">{coupons.length} coupons</div>
        <Button size="sm" className="gap-1.5" onClick={() => toast.info('Open coupon editor')}>
          <Plus className="h-4 w-4" /> New coupon
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-secondary/40">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Value</th>
              <th className="px-4 py-3 font-medium">Min spend</th>
              <th className="px-4 py-3 font-medium">Usage</th>
              <th className="px-4 py-3 font-medium">Expiry</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b"><td colSpan={8} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-muted" /></td></tr>
                ))
              : coupons.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <code className="rounded bg-secondary px-2 py-1 font-mono text-xs font-semibold">{c.code}</code>
                    </td>
                    <td className="px-4 py-3 capitalize text-xs">{c.type.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-xs font-semibold">
                      {c.type === 'percentage' || c.type === 'first_purchase' || c.type === 'referral' ? `${c.value}%` : fmt(c.value)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.minSpend ? fmt(c.minSpend) : '—'}</td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span>{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</span>
                        {c.usageLimit > 0 && (
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-brand-yellow" style={{ width: `${Math.min(100, (c.usedCount / c.usageLimit) * 100)}%` }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.expiry ? formatDate(c.expiry) : 'No expiry'}</td>
                    <td className="px-4 py-3">
                      {c.active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                          <XCircle className="h-3.5 w-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info('Editing coupon')}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info(c.active ? 'Deactivated' : 'Activated')}>
                            {c.active ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                            {c.active ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export function TicketsTable() {
  const { data, isLoading } = useAdminTickets()
  const tickets = data?.tickets ?? []

  const priorityColor: Record<string, string> = {
    low: 'bg-muted text-muted-foreground',
    normal: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    urgent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  }

  return (
    <Card className="overflow-hidden shadow-card-soft">
      <div className="flex items-center justify-between border-b p-4">
        <div className="text-sm text-muted-foreground">{tickets.length} tickets</div>
        <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" /> {tickets.filter((t) => t.status === 'open').length} open</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-secondary/40">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b"><td colSpan={7} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-muted" /></td></tr>
                ))
              : tickets.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-xs">{t.number}</td>
                    <td className="px-4 py-3 text-sm font-medium">{t.subject}</td>
                    <td className="px-4 py-3 capitalize text-xs text-muted-foreground">{t.category}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize', priorityColor[t.priority])}>{t.priority}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={t.status === 'open' ? 'pending' : t.status === 'resolved' ? 'completed' : t.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(t.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => toast.info('Opening ticket')}>Open</Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
