'use client'

import { Sparkles, Twitter, Github, Linkedin, Youtube, Mail, ShieldCheck, Zap, Headphones, ArrowUpRight } from 'lucide-react'
import { useStore } from '@/store/use-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const features = [
  { icon: Zap, title: 'Instant Delivery', desc: 'Get your files & keys immediately after payment.' },
  { icon: ShieldCheck, title: 'Secure Checkout', desc: 'Powered by Lemon Squeezy with Apple Pay & PayPal.' },
  { icon: Headphones, title: 'Human Support', desc: 'Real people, real fast — 7 days a week.' },
]

const columns = [
  {
    title: 'Marketplace',
    links: ['All Products', 'Featured', 'Trending', 'Best Sellers', 'Flash Deals', 'New Arrivals'],
  },
  {
    title: 'Categories',
    links: ['Games & Assets', 'Software & Apps', 'Code & Scripts', 'Templates', 'Design', 'Audio & Music'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Blog', 'Affiliate Program', 'Press Kit', 'Contact'],
  },
  {
    title: 'Legal & Help',
    links: ['Privacy Policy', 'Terms of Service', 'License Agreement', 'Refund Policy', 'FAQ', 'Support'],
  },
]

export function Footer() {
  const navigate = useStore((s) => s.navigate)

  return (
    <footer className="mt-auto border-t bg-secondary/40">
      {/* trust strip */}
      <div className="border-b">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-primary-foreground">
                <f.icon className="h-5 w-5 text-brand-yellow" />
              </div>
              <div>
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* main */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-2">
              <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-navy text-primary-foreground">
                <Sparkles className="h-5 w-5 text-brand-yellow" />
              </span>
              <span className="text-base font-bold">
                PlayBeat<span className="text-brand-yellow-foreground dark:text-brand-yellow"> Digital</span>
              </span>
            </button>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The premium marketplace for digital creators. Software, templates, assets, and courses — delivered instantly.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {[Twitter, Github, Linkedin, Youtube, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="grid h-9 w-9 place-items-center rounded-full border text-muted-foreground transition-colors hover:border-brand-yellow hover:text-brand-yellow-foreground dark:hover:text-brand-yellow"
                  aria-label="social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <button
                      onClick={() => {
                        if (col.title === 'Marketplace' && l === 'All Products') navigate({ name: 'shop' })
                        else if (col.title === 'Marketplace' && l === 'Featured') navigate({ name: 'shop' })
                        else navigate({ name: 'home' })
                      }}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PlayBeat Digital. Crafted with care. Payments secured by Lemon Squeezy.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> PCI Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1">
              <Zap className="h-3.5 w-3.5 text-brand-yellow-foreground dark:text-brand-yellow" /> VAT Included
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function BackToTopButton() {
  return null
}
