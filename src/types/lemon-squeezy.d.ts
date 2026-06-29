// Type declarations for the Lemon Squeezy embedded checkout (lemon.js)
// Docs: https://docs.lemonsqueezy.com/guides/developer-guide/embedded-checkout

interface LemonSqueezyCheckoutEvent {
  event: string
  checkout?: {
    id: string
    identifier: string
    [key: string]: unknown
  }
  order?: {
    id: string
    identifier: string
    order_number: string
    total: number
    currency: string
    [key: string]: unknown
  }
  transaction?: {
    id: string
    identifier: string
    [key: string]: unknown
  }
}

interface LemonSqueezyHandler {
  (event: LemonSqueezyCheckoutEvent): void
}

interface LemonSqueezyEvents {
  Success: string
  Close: string
  Error: string
  Checkout: string
}

interface LemonSqueezyUrl {
  Open: (url: string) => void
  Close: (url?: string) => void
}

interface LemonSqueezyAPI {
  Url: LemonSqueezyUrl
  Events: LemonSqueezyEvents
  Setup: (config: { eventHandler: LemonSqueezyHandler }) => void
}

interface Window {
  LemonSqueezy?: LemonSqueezyAPI
  createLemonSqueezy?: () => void
  LemonSqueezyUrlOpen?: (url: string) => void
}
