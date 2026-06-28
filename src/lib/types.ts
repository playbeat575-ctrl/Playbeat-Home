// Shared types for PlayBeat Digital storefront + admin

export type Role =
  | 'super_admin'
  | 'admin'
  | 'finance'
  | 'inventory'
  | 'support'
  | 'marketing'
  | 'affiliate'
  | 'customer'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string
  color: string
}

export interface Product {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  categoryId: string
  category?: Category
  brand: string
  price: number
  compareAtPrice: number | null
  currency: string
  stock: number
  rating: number
  reviewCount: number
  salesCount: number
  featured: boolean
  trending: boolean
  bestSeller: boolean
  flashDeal: boolean
  newArrival: boolean
  hasLicenseKey: boolean
  isSubscription: boolean
  subscriptionInterval: string | null
  coverGradient: string
  coverImage: string | null
  icon: string
  tags: string[]
  fileName: string | null
  fileSize: string | null
  createdAt: string
}

export interface Review {
  id: string
  productId: string
  userName: string
  userAvatar: string | null
  rating: number
  title: string
  comment: string
  verified: boolean
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
  variant?: string
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'first_purchase' | 'referral'
  value: number
  minSpend: number
  expiry: string | null
  usageLimit: number
  usedCount: number
  active: boolean
}

export interface Order {
  id: string
  number: string
  customerName: string
  customerEmail: string
  status: string
  paymentStatus: string
  paymentMethod: string | null
  subtotal: number
  discount: number
  tax: number
  total: number
  currency: string
  couponCode: string | null
  items: { name: string; price: number; quantity: number; licenseKey: string | null }[]
  createdAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  points: number
  referralCode: string
  status: string
  createdAt: string
}

export interface AdminStats {
  revenue: number
  revenueChange: number
  orders: number
  ordersChange: number
  customers: number
  customersChange: number
  conversion: number
  conversionChange: number
  revenueSeries: { label: string; value: number }[]
  weeklySeries: { label: string; value: number }[]
  customerGrowth: { label: string; value: number }[]
  topProducts: { name: string; sales: number; revenue: number; gradient: string }[]
  statusBreakdown: { name: string; value: number }[]
}

export type View =
  | { name: 'home' }
  | { name: 'product'; slug: string }
  | { name: 'shop'; category?: string }
  | { name: 'wishlist' }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'success'; orderId: string }
  | { name: 'admin'; section?: AdminSection }

export type AdminSection =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'categories'
  | 'reviews'
  | 'tickets'
  | 'analytics'
  | 'settings'
