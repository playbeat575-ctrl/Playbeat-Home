'use client'

import { useStore } from '@/store/use-store'
import {
  formatCurrency,
  convertFromUsd,
  convertToUsd,
  getCurrency,
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
} from '@/lib/format'

/**
 * Currency hook for the storefront.
 * Returns the active currency, a `format(usd)` helper that converts and
 * formats USD amounts into the active display currency, and conversion
 * helpers.
 *
 * All product prices are stored in USD (base currency); this hook converts
 * them on the fly for display and for the checkout payload.
 */
export function useCurrency() {
  const currency = useStore((s) => s.currency)
  const setCurrency = useStore((s) => s.setCurrency)

  return {
    currency,
    setCurrency,
    currencies: SUPPORTED_CURRENCIES,
    info: getCurrency(currency),
    /** Format a USD amount into the active display currency. */
    format: (usd: number) => formatCurrency(usd, currency),
    /** Convert a USD amount into the active display currency (number). */
    convert: (usd: number) => convertFromUsd(usd, currency),
    /** Convert an amount in the active currency back to USD (base). */
    toUsd: (amount: number) => convertToUsd(amount, currency),
  }
}

export type { CurrencyCode }
