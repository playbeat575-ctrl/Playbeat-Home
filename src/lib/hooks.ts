'use client'

import { useQuery } from '@tanstack/react-query'
import type { Product, Category, Review, AdminStats, Order, AdminUser, Coupon, AdminSection } from '@/lib/types'

async function jfetch<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json() as Promise<T>
}

export function useProducts(params: { flag?: string; category?: string; q?: string; sort?: string; limit?: number } = {}) {
  const qs = new URLSearchParams()
  if (params.flag) qs.set('flag', params.flag)
  if (params.category) qs.set('category', params.category)
  if (params.q) qs.set('q', params.q)
  if (params.sort) qs.set('sort', params.sort)
  if (params.limit) qs.set('limit', String(params.limit))
  return useQuery<{ products: Product[] }>({
    queryKey: ['products', params],
    queryFn: () => jfetch(`/api/products?${qs.toString()}`),
  })
}

export function useProduct(slug: string | null) {
  return useQuery<{ product: Product; reviews: Review[]; related: Product[] }>({
    queryKey: ['product', slug],
    queryFn: () => jfetch(`/api/products/${slug}`),
    enabled: !!slug,
  })
}

export function useCategories() {
  return useQuery<{ categories: (Category & { productCount: number })[] }>({
    queryKey: ['categories'],
    queryFn: () => jfetch('/api/categories'),
  })
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: () => jfetch('/api/admin/stats'),
  })
}

export function useAdminOrders(status?: string) {
  const qs = status && status !== 'all' ? `?status=${status}` : ''
  return useQuery<{ orders: Order[] }>({
    queryKey: ['admin-orders', status],
    queryFn: () => jfetch(`/api/admin/orders${qs}`),
  })
}

export function useAdminProducts() {
  return useQuery<{ products: Product[] }>({
    queryKey: ['admin-products'],
    queryFn: () => jfetch('/api/admin/products'),
  })
}

export function useAdminCustomers() {
  return useQuery<{ customers: (AdminUser & { orderCount: number })[] }>({
    queryKey: ['admin-customers'],
    queryFn: () => jfetch('/api/admin/customers'),
  })
}

export function useAdminCoupons() {
  return useQuery<{ coupons: Coupon[] }>({
    queryKey: ['admin-coupons'],
    queryFn: () => jfetch('/api/admin/coupons'),
  })
}

export function useAdminTickets() {
  return useQuery<{ tickets: { id: string; number: string; subject: string; category: string; priority: string; status: string; message: string; createdAt: string }[] }>({
    queryKey: ['admin-tickets'],
    queryFn: () => jfetch('/api/admin/tickets'),
  })
}

export interface LemonVariant {
  id: string
  name: string
  price: number
  status: string
  interval: string | null
}
export interface LemonProduct {
  id: string
  name: string
  status: string
  type?: string
  url?: string
  variants: LemonVariant[]
}

export function useLemonProducts() {
  return useQuery<{ products: LemonProduct[] }>({
    queryKey: ['lemon-products'],
    queryFn: () => jfetch('/api/admin/lemon/products'),
  })
}

export type { AdminSection }
