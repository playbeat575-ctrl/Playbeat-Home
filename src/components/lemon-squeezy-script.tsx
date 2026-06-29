'use client'

import Script from 'next/script'

/**
 * Loads the Lemon Squeezy embedded-checkout script (lemon.js).
 *
 * lemon.js only auto-initializes on the window `load` event, but next/script's
 * `afterInteractive` strategy loads it after `load` has already fired — so we
 * call `createLemonSqueezy()` manually in `onLoad` to set up `window.LemonSqueezy`.
 */
export function LemonSqueezyScript() {
  return (
    <Script
      src="https://assets.lemonsqueezy.com/lemon.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== 'undefined' && typeof window.createLemonSqueezy === 'function') {
          window.createLemonSqueezy()
        }
      }}
    />
  )
}
