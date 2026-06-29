'use client'

import * as React from 'react'
import { Upload, X, Image as ImageIcon, Loader2, Sparkles, Check } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCategories } from '@/lib/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { ProductCover } from '@/components/product-cover'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Product, Category } from '@/lib/types'

const ICON_OPTIONS = [
  'Sparkles', 'Gamepad2', 'Code2', 'Palette', 'BookOpen', 'Music', 'Cpu',
  'Braces', 'LayoutTemplate', 'PenTool', 'Film', 'Mic', 'Camera', 'Terminal',
  'Boxes', 'Gauge', 'Layers', 'Wand2', 'Zap', 'Rocket',
]

const GRADIENTS = [
  'from-blue-600 via-indigo-600 to-violet-700',
  'from-amber-400 via-orange-500 to-rose-500',
  'from-emerald-400 via-teal-500 to-cyan-600',
  'from-fuchsia-500 via-purple-600 to-indigo-700',
  'from-sky-400 via-blue-500 to-indigo-600',
  'from-rose-400 via-pink-500 to-fuchsia-600',
  'from-lime-400 via-green-500 to-emerald-600',
  'from-slate-600 via-slate-700 to-slate-900',
  'from-yellow-400 via-amber-500 to-orange-600',
  'from-cyan-400 via-sky-500 to-blue-600',
]

export interface ProductFormData {
  name: string
  tagline: string
  description: string
  categoryId: string
  brand: string
  price: number | string
  compareAtPrice: number | string
  coverImage: string
  icon: string
  coverGradient: string
  tags: string
  lemonVariantId: string
  featured: boolean
  trending: boolean
  bestSeller: boolean
  flashDeal: boolean
  newArrival: boolean
  hasLicenseKey: boolean
  isSubscription: boolean
  subscriptionInterval: string
}

const EMPTY: ProductFormData = {
  name: '', tagline: '', description: '', categoryId: '', brand: 'PlayBeat Studios',
  price: '', compareAtPrice: '', coverImage: '', icon: 'Sparkles',
  coverGradient: GRADIENTS[0], tags: '', lemonVariantId: '', featured: false, trending: false,
  bestSeller: false, flashDeal: false, newArrival: false, hasLicenseKey: false,
  isSubscription: false, subscriptionInterval: 'monthly',
}

export function ProductForm({
  open, onOpenChange, editing, onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing: Product | null
  onSaved?: () => void
}) {
  const { data: catData } = useCategories()
  const categories: (Category & { productCount?: number })[] = catData?.categories ?? []
  const qc = useQueryClient()
  const [form, setForm] = React.useState<ProductFormData>(EMPTY)
  const [saving, setSaving] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [tagInput, setTagInput] = React.useState('')

  React.useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        tagline: editing.tagline,
        description: editing.description,
        categoryId: editing.categoryId,
        brand: editing.brand,
        price: String(editing.price),
        compareAtPrice: editing.compareAtPrice ? String(editing.compareAtPrice) : '',
        coverImage: editing.coverImage || '',
        lemonVariantId: editing.lemonVariantId || '',
        icon: editing.icon,
        coverGradient: editing.coverGradient,
        tags: Array.isArray(editing.tags) ? editing.tags.join(', ') : '',
        featured: editing.featured,
        trending: editing.trending,
        bestSeller: editing.bestSeller,
        flashDeal: editing.flashDeal,
        newArrival: editing.newArrival,
        hasLicenseKey: editing.hasLicenseKey,
        isSubscription: editing.isSubscription,
        subscriptionInterval: editing.subscriptionInterval || 'monthly',
      })
    } else {
      setForm({ ...EMPTY, categoryId: categories[0]?.id || '' })
    }
  }, [editing, open])

  React.useEffect(() => {
    if (!editing && open && categories.length && !form.categoryId) {
      setForm((f) => ({ ...f, categoryId: categories[0].id }))
    }
  }, [categories, open, editing, form.categoryId])

  const set = <K extends keyof ProductFormData>(k: K, v: ProductFormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const uploadImage = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      set('coverImage', data.url)
      toast.success('Image uploaded', { description: data.name })
    } catch (e: any) {
      toast.error(e.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) uploadImage(f)
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (!t) return
    const cur = form.tags ? form.tags.split(',').map((s) => s.trim()).filter(Boolean) : []
    if (!cur.includes(t)) cur.push(t)
    set('tags', cur.join(', '))
    setTagInput('')
  }

  const save = async () => {
    if (!form.name || !form.categoryId || form.price === '') {
      toast.error('Name, category and price are required')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      tags: form.tags ? form.tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
    }
    try {
      const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast.success(editing ? 'Product updated' : 'Product created', {
        description: form.name,
      })
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      onOpenChange(false)
      onSaved?.()
    } catch (e: any) {
      toast.error(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const curTags = form.tags ? form.tags.split(',').map((s) => s.trim()).filter(Boolean) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-full max-w-3xl overflow-y-auto scrollbar-slim p-0">
        <DialogHeader className="sticky top-0 z-10 border-b bg-card/95 px-6 py-4 backdrop-blur">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-yellow-foreground dark:text-brand-yellow" />
            {editing ? 'Edit product' : 'Add new product'}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? 'Update the product details below.'
              : 'Fill in the details to add a new digital product to your marketplace.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-6 py-5">
          {/* Image + preview */}
          <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
            <div>
              <Label className="mb-1.5 block">Cover image</Label>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-secondary">
                <ProductCover
                  gradient={form.coverGradient}
                  icon={form.icon}
                  coverImage={form.coverImage || null}
                  alt={form.name || 'Product preview'}
                  className="h-full w-full"
                  showShine={false}
                />
                {uploading && (
                  <div className="absolute inset-0 grid place-items-center bg-black/50">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <label className="mt-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-yellow hover:text-foreground">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? 'Uploading…' : 'Upload image'}
                <input type="file" accept="image/*" className="hidden" onChange={onFileChange} disabled={uploading} />
              </label>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="coverImage">Image URL</Label>
                <Input
                  id="coverImage"
                  value={form.coverImage}
                  onChange={(e) => set('coverImage', e.target.value)}
                  placeholder="https://… or upload above"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Paste a URL or upload a file. PNG/JPG/WebP/GIF up to 6 MB.
                </p>
              </div>
              <div>
                <Label className="mb-1.5 block">Cover gradient (fallback)</Label>
                <div className="grid grid-cols-5 gap-1.5">
                  {GRADIENTS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => set('coverGradient', g)}
                      className={cn(
                        'h-8 rounded-md bg-gradient-to-br ring-2 ring-offset-1 ring-offset-card transition',
                        g,
                        form.coverGradient === g ? 'ring-brand-yellow' : 'ring-transparent'
                      )}
                      aria-label={g}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select value={form.icon} onValueChange={(v) => set('icon', v)}>
                  <SelectTrigger id="icon"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((ic) => (
                      <SelectItem key={ic} value={ic}>{ic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Name + tagline */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Product name *</Label>
              <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Aether Engine — 2D Game Framework" />
            </div>
            <div>
              <Label htmlFor="brand">Brand / vendor</Label>
              <Input id="brand" value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="PlayBeat Studios" />
            </div>
          </div>

          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="Lightning-fast 2D game engine with built-in physics" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe what makes this product great…" />
          </div>

          {/* Category + price */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={form.categoryId} onValueChange={(v) => set('categoryId', v)}>
                <SelectTrigger id="category"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Price (USD) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input id="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="89" className="pl-7" />
              </div>
            </div>
            <div>
              <Label htmlFor="compareAt">Compare-at price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input id="compareAt" type="number" step="0.01" min="0" value={form.compareAtPrice} onChange={(e) => set('compareAtPrice', e.target.value)} placeholder="149" className="pl-7" />
              </div>
            </div>
          </div>

          {/* Lemon Squeezy variant mapping */}
          <div className="rounded-xl border bg-secondary/40 p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-yellow/20 text-brand-yellow-foreground dark:text-brand-yellow">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <Label htmlFor="lemonVariantId" className="text-sm font-semibold">Lemon Squeezy variant ID</Label>
                <p className="text-[11px] text-muted-foreground">
                  Link this product to a Lemon Squeezy variant for live hosted checkout. Found in your Lemon dashboard → product → variant.
                </p>
              </div>
            </div>
            <Input
              id="lemonVariantId"
              value={form.lemonVariantId}
              onChange={(e) => set('lemonVariantId', e.target.value)}
              placeholder="e.g. 1850448"
              className="mt-2"
            />
            {form.lemonVariantId ? (
              <p className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                ✓ Live checkout enabled for this product — buyers redirect to Lemon Squeezy.
              </p>
            ) : (
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Leave empty to use the default variant (demo mode if none set).
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="game, engine, 2d"
              />
              <Button type="button" variant="secondary" onClick={addTag}>Add</Button>
            </div>
            {curTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {curTags.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1 capitalize">
                    {t}
                    <button
                      type="button"
                      onClick={() => set('tags', curTags.filter((x) => x !== t).join(', '))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Flags */}
          <div>
            <Label className="mb-2 block">Storefront placement</Label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <FlagToggle label="Featured" desc="Show in Featured rail" checked={form.featured} onChange={(v) => set('featured', v)} />
              <FlagToggle label="Trending" desc="Show in Trending rail" checked={form.trending} onChange={(v) => set('trending', v)} />
              <FlagToggle label="Best Seller" desc="Show in Best Sellers" checked={form.bestSeller} onChange={(v) => set('bestSeller', v)} />
              <FlagToggle label="Flash Deal" desc="Show in Flash Deals" checked={form.flashDeal} onChange={(v) => set('flashDeal', v)} />
              <FlagToggle label="New Arrival" desc="Show in New Arrivals" checked={form.newArrival} onChange={(v) => set('newArrival', v)} />
              <FlagToggle label="License key" desc="Generate a license key on purchase" checked={form.hasLicenseKey} onChange={(v) => set('hasLicenseKey', v)} />
            </div>
          </div>

          {/* Subscription */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-secondary/40 p-4">
            <div className="flex items-center gap-2">
              <Switch checked={form.isSubscription} onCheckedChange={(v) => set('isSubscription', v)} id="sub" />
              <Label htmlFor="sub" className="cursor-pointer">Subscription product</Label>
            </div>
            {form.isSubscription && (
              <Select value={form.subscriptionInterval} onValueChange={(v) => set('subscriptionInterval', v)}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 border-t bg-card/95 px-6 py-4 backdrop-blur">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {editing ? 'Save changes' : 'Create product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FlagToggle({
  label, desc, checked, onChange,
}: {
  label: string
  desc: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className={cn(
      'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all',
      checked ? 'border-brand-yellow bg-brand-yellow/5 ring-1 ring-brand-yellow' : 'hover:border-foreground/30'
    )}>
      <Switch checked={checked} onCheckedChange={onChange} />
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[11px] text-muted-foreground">{desc}</div>
      </div>
    </label>
  )
}
