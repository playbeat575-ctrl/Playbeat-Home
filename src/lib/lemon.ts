import {
  lemonSqueezySetup,
  createCheckout,
  getAuthenticatedUser,
  listStores,
} from '@lemonsqueezy/lemonsqueezy.js'
import crypto from 'crypto'

let configured = false

function setup() {
  if (configured) return
  const apiKey = process.env.LEMON_API_KEY
  if (apiKey) {
    lemonSqueezySetup({
      apiKey,
      onError: (err) => console.error('[LemonSqueezy]', err.message),
    })
  }
  configured = true
}

export function lemonConfig() {
  return {
    apiKey: process.env.LEMON_API_KEY || '',
    storeId: process.env.LEMON_STORE_ID || '',
    defaultVariantId: process.env.LEMON_DEFAULT_VARIANT_ID || '',
    webhookSecret: process.env.LEMON_WEBHOOK_SECRET || '',
    demoMode: (process.env.LEMON_DEMO_MODE || '').toLowerCase() === 'true',
  }
}

export function isLemonConfigured() {
  const c = lemonConfig()
  return !!c.apiKey && !!c.storeId && !c.demoMode
}

export function isLiveCheckoutEnabled() {
  const c = lemonConfig()
  return isLemonConfigured() && !!c.defaultVariantId
}

/** Verify the API key works and return the authenticated user + first store. */
export async function getLemonStatus() {
  const c = lemonConfig()
  if (!c.apiKey) {
    return { configured: false, reason: 'LEMON_API_KEY not set' }
  }
  setup()
  try {
    const userRes = await getAuthenticatedUser()
    if (userRes.statusCode !== 200 || !userRes.data) {
      return { configured: false, reason: `API key invalid (${userRes.statusCode})` }
    }
    const storesRes = await listStores()
    const stores = (storesRes as any)?.data?.data ?? []
    return {
      configured: true,
      liveCheckout: !!c.defaultVariantId,
      demoMode: c.demoMode,
      user: {
        name: (userRes.data as any)?.data?.attributes?.name ?? 'Unknown',
        email: (userRes.data as any)?.data?.attributes?.email ?? '',
      },
      stores: stores.map((s: any) => ({ id: s.id, name: s.attributes?.name })),
      storeId: c.storeId,
      variantId: c.defaultVariantId,
    }
  } catch (e: any) {
    return { configured: false, reason: e?.message || 'Request failed' }
  }
}

export interface HostedCheckoutInput {
  variantId?: string
  customPriceCents?: number
  productName?: string
  productDescription?: string
  email?: string
  name?: string
  redirectUrl?: string
  receiptThankYouNote?: string
}

/**
 * Create a Lemon Squeezy hosted checkout and return its URL.
 * The user is redirected there to complete payment securely.
 */
export async function createHostedCheckout(input: HostedCheckoutInput) {
  const c = lemonConfig()
  if (!isLemonConfigured()) {
    throw new Error('Lemon Squeezy is not configured')
  }
  const variantId = input.variantId || c.defaultVariantId
  if (!variantId) {
    throw new Error('No variant ID configured for checkout')
  }
  setup()
  const res = await createCheckout(c.storeId, variantId, {
    customPrice: input.customPriceCents,
    productOptions: {
      name: input.productName,
      description: input.productDescription,
      redirectUrl: input.redirectUrl,
      receiptThankYouNote: input.receiptThankYouNote,
    },
    checkoutOptions: {
      embed: false,
      dark: false,
    },
    checkoutData: {
      email: input.email,
      name: input.name,
      variantQuantities: input.customPriceCents ? undefined : undefined,
    },
  } as any)

  const url = (res as any)?.data?.data?.attributes?.url
  if (!url) {
    throw new Error(`Checkout creation failed (status ${res.statusCode})`)
  }
  return { url, checkoutId: (res as any)?.data?.data?.id }
}

/**
 * Verify a Lemon Squeezy webhook signature.
 * Lemon Squeezy signs the raw request body with HMAC-SHA256 using the
 * webhook secret and sends the hex digest in the `X-Signature` header.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null, secret?: string): boolean {
  const sigSecret = secret || lemonConfig().webhookSecret
  if (!sigSecret || !signature) return false
  const hmac = crypto.createHmac('sha256', sigSecret)
  const digest = hmac.update(rawBody).digest('hex')
  const a = Buffer.from(digest, 'utf8')
  const b = Buffer.from(signature, 'utf8')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export { setup as setupLemon }
