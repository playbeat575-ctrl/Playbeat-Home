// Formatting + small helpers

export type CurrencyCode = 'USD' | 'PKR'

export interface CurrencyInfo {
  code: CurrencyCode
  symbol: string
  label: string
  /** Conversion rate from USD (1 USD = rate * targetCurrency) */
  rate: number
  decimals: number
  locale: string
}

/**
 * Supported display currencies.
 * USD is the base currency stored in the database; PKR is converted at a
 * fixed reference rate for display & payment. Update `rate` to reflect your
 * current conversion rate (e.g. to use a live rate from an FX API).
 */
export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar', rate: 1, decimals: 2, locale: 'en-US' },
  { code: 'PKR', symbol: '₨', label: 'Pakistani Rupee', rate: 285, decimals: 0, locale: 'en-PK' },
]

export const DEFAULT_CURRENCY: CurrencyCode = 'PKR'

export function getCurrency(code: CurrencyCode): CurrencyInfo {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code) ?? SUPPORTED_CURRENCIES[0]
}

/** Convert an amount from USD to the target currency. */
export function convertFromUsd(usd: number, code: CurrencyCode): number {
  const c = getCurrency(code)
  const v = usd * c.rate
  const p = Math.pow(10, c.decimals)
  return Math.round(v * p) / p
}

/** Convert an amount from the source currency back to USD. */
export function convertToUsd(amount: number, code: CurrencyCode): number {
  const c = getCurrency(code)
  return Math.round((amount / c.rate) * 100) / 100
}

/**
 * Format a USD amount into the given display currency.
 * `value` is always treated as USD (the base/storage currency).
 */
export function formatCurrency(valueUsd: number, currency: CurrencyCode = 'USD') {
  const c = getCurrency(currency)
  const converted = convertFromUsd(valueUsd, currency)
  return new Intl.NumberFormat(c.locale, {
    style: 'currency',
    currency: c.code,
    minimumFractionDigits: c.decimals,
    maximumFractionDigits: c.decimals,
  }).format(converted)
}

/** Format with an explicit symbol prefix (used for compact UI badges). */
export function formatCurrencyShort(valueUsd: number, currency: CurrencyCode = 'USD') {
  const c = getCurrency(currency)
  const converted = convertFromUsd(valueUsd, currency)
  const num = new Intl.NumberFormat(c.locale, {
    minimumFractionDigits: c.decimals,
    maximumFractionDigits: c.decimals,
  }).format(converted)
  return `${c.symbol}${num}`
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function timeAgo(value: string | Date) {
  const d = new Date(value).getTime()
  const diff = Date.now() - d
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(value)
}

export function discountPercent(price: number, compareAt: number | null) {
  if (!compareAt || compareAt <= price) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}

export function calcDiscount(subtotal: number, coupon: { type: string; value: number } | null) {
  if (!coupon) return 0
  if (coupon.type === 'percentage' || coupon.type === 'first_purchase' || coupon.type === 'referral') {
    return Math.round(subtotal * (coupon.value / 100) * 100) / 100
  }
  return Math.min(subtotal, coupon.value)
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function classForGradient(g: string) {
  return g
}
