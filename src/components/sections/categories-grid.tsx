'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useStore } from '@/store/use-store'
import { useCategories } from '@/lib/hooks'
import { Icon } from '@/components/product-cover'
import { SectionHeader } from '@/components/sections/product-rail'

const fallbackCategories = [
  { id: '1', name: 'Games & Assets', slug: 'games-assets', icon: 'Gamepad2', color: '#6366f1', description: '', productCount: 0 },
  { id: '2', name: 'Software & Apps', slug: 'software-apps', icon: 'Boxes', color: '#0ea5e9', description: '', productCount: 0 },
  { id: '3', name: 'Code & Scripts', slug: 'code-scripts', icon: 'Code2', color: '#10b981', description: '', productCount: 0 },
  { id: '4', name: 'Templates & Themes', slug: 'templates-themes', icon: 'LayoutTemplate', color: '#f59e0b', description: '', productCount: 0 },
  { id: '5', name: 'Design Resources', slug: 'design-resources', icon: 'Palette', color: '#ec4899', description: '', productCount: 0 },
  { id: '6', name: 'eBooks & Courses', slug: 'ebooks-courses', icon: 'BookOpen', color: '#8b5cf6', description: '', productCount: 0 },
  { id: '7', name: 'Audio & Music', slug: 'audio-music', icon: 'Music', color: '#14b8a6', description: '', productCount: 0 },
  { id: '8', name: 'Video & Motion', slug: 'video-motion', icon: 'Film', color: '#ef4444', description: '', productCount: 0 },
]

export function CategoriesGrid() {
  const navigate = useStore((s) => s.navigate)
  const { data, isLoading } = useCategories()
  const categories = data?.categories?.length ? data.categories : fallbackCategories

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <SectionHeader
        eyebrow="Browse"
        title="Shop by category"
        desc="Eight curated categories covering everything from game engines to design systems and courses."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
            onClick={() => navigate({ name: 'shop', category: c.slug })}
            className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-5 text-left shadow-card-soft transition-all hover:-translate-y-1 hover:shadow-glow-yellow"
          >
            <div
              className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
              style={{ background: c.color }}
            />
            <div
              className="grid h-12 w-12 place-items-center rounded-xl"
              style={{ background: `${c.color}1f`, color: c.color }}
            >
              <Icon name={c.icon} className="h-6 w-6" />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold sm:text-base">{c.name}</h3>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {c.description || 'Curated digital products for creators.'}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{c.productCount} items</span>
              <span className="inline-flex items-center gap-1 font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                Browse <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  )
}
