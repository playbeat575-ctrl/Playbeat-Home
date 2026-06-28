'use client'

import { motion } from 'framer-motion'
import { HeroSlider } from '@/components/sections/hero-slider'
import { CategoriesGrid } from '@/components/sections/categories-grid'
import { ProductRail, ProductGridSection } from '@/components/sections/product-rail'
import { FlashDeals } from '@/components/sections/flash-deals'
import { Reviews } from '@/components/sections/reviews'
import { StatsBand, Newsletter } from '@/components/sections/newsletter'
import { Footer } from '@/components/footer'

const BRANDS = ['PlayBeat Studios', 'Nebula Labs', 'Pixel Forge', 'CodeCraft', 'Studio Aurora', 'Vertex Co.', 'Lumen Type', 'Brightside', 'Quantum Apps', 'Maker Kit']

export function HomeView() {
  return (
    <>
      <HeroSlider />
      <StatsBand />
      <BrandsMarquee />
      <CategoriesGrid />
      <ProductRail
        flag="featured"
        eyebrow="Editor's picks"
        title="Featured products"
        desc="Hand-selected digital products our team stands behind this month."
      />
      <FlashDeals />
      <ProductRail
        flag="trending"
        eyebrow="Hot right now"
        title="Trending products"
        desc="What the community is buying and loving this week."
      />
      <ProductGridSection
        flag="bestSeller"
        eyebrow="Most loved"
        title="Best sellers"
        desc="Top-rated products with thousands of happy customers."
        limit={8}
      />
      <ProductRail
        flag="newArrival"
        eyebrow="Fresh drops"
        title="New arrivals"
        desc="The latest additions to the PlayBeat Digital catalog."
      />
      <Reviews />
      <Newsletter />
      <Footer />
    </>
  )
}

function BrandsMarquee() {
  return (
    <div className="border-y bg-background py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Trusted by leading studios</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
          {BRANDS.map((b) => (
            <motion.span
              key={b}
              whileHover={{ scale: 1.04 }}
              className="text-sm font-semibold text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {b}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}
