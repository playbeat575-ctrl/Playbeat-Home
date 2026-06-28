// PlayBeat Digital — seed script
// Run: bun run seed
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'

const db = new PrismaClient()

// Real cover images fetched via z-ai image-search (scripts/product-images.json)
const productImages: Record<string, string> = (() => {
  try {
    return JSON.parse(readFileSync('/home/z/my-project/scripts/product-images.json', 'utf8'))
  } catch {
    return {}
  }
})()

const gradients = [
  'from-blue-600 via-indigo-600 to-violet-700',
  'from-amber-400 via-orange-500 to-rose-500',
  'from-emerald-400 via-teal-500 to-cyan-600',
  'from-fuchsia-500 via-purple-600 to-indigo-700',
  'from-sky-400 via-blue-500 to-indigo-600',
  'from-rose-400 via-pink-500 to-fuchsia-600',
  'from-lime-400 via-green-500 to-emerald-600',
  'from-slate-600 via-slate-700 to-slate-900',
  'from-yellow-400 via-amber-500 to-orange-600',
  'from-cyan-400 via-sky-500 to-blue-600',
]

const icons = [
  'Gamepad2', 'Code2', 'Palette', 'BookOpen', 'Music',
  'Cpu', 'Braces', 'LayoutTemplate', 'PenTool', 'Film',
  'Mic', 'Camera', 'Terminal', 'Boxes', 'Gauge',
  'Layers', 'Sparkles', 'Wand2', 'Zap', 'Rocket',
]

const categories = [
  { name: 'Games & Assets', slug: 'games-assets', icon: 'Gamepad2', color: '#6366f1', description: 'Indie games, game templates, 3D models and Unity/Unreal assets.' },
  { name: 'Software & Apps', slug: 'software-apps', icon: 'Boxes', color: '#0ea5e9', description: 'Desktop apps, SaaS tools, utilities and developer software.' },
  { name: 'Code & Scripts', slug: 'code-scripts', icon: 'Code2', color: '#10b981', description: 'Source code, scripts, SDKs and boilerplates for builders.' },
  { name: 'Templates & Themes', slug: 'templates-themes', icon: 'LayoutTemplate', color: '#f59e0b', description: 'Website themes, app UI kits, dashboards and landing pages.' },
  { name: 'Design Resources', slug: 'design-resources', icon: 'Palette', color: '#ec4899', description: 'Icons, illustrations, fonts, mockups and design systems.' },
  { name: 'eBooks & Courses', slug: 'ebooks-courses', icon: 'BookOpen', color: '#8b5cf6', description: 'Ebooks, video courses and learning tracks for creators.' },
  { name: 'Audio & Music', slug: 'audio-music', icon: 'Music', color: '#14b8a6', description: 'Royalty-free music, SFX packs, loops and DAW templates.' },
  { name: 'Video & Motion', slug: 'video-motion', icon: 'Film', color: '#ef4444', description: 'Motion graphics, LUTs, transitions and stock footage.' },
]

const brands = ['PlayBeat Studios', 'Nebula Labs', 'Pixel Forge', 'CodeCraft', 'Studio Aurora', 'Vertex Co.', 'Lumen Type', 'Brightside', 'Quantum Apps', 'Maker Kit']

type Seed = {
  name: string
  tagline: string
  desc: string
  cat: string
  brand: string
  price: number
  compare?: number
  icon: string
  gradient: string
  tags: string[]
  flags: { featured?: boolean; trending?: boolean; bestSeller?: boolean; flashDeal?: boolean; newArrival?: boolean; hasLicenseKey?: boolean; isSubscription?: boolean; subscriptionInterval?: string }
  rating: number
  reviewCount: number
  salesCount: number
}

const seeds: Seed[] = [
  { name: 'Aether Engine — 2D Game Framework', tagline: 'Lightning-fast 2D game engine with built-in physics', desc: 'Aether Engine is a modular 2D game framework built for indie studios. Ship cross-platform titles with a powerful ECS, physics solver, particle systems, and a visual scene editor. Includes full TypeScript source, 40+ demo scenes, and lifetime updates.', cat: 'games-assets', brand: 'PlayBeat Studios', price: 89, compare: 149, icon: 'Gamepad2', gradient: gradients[0], tags: ['game', 'engine', '2d', 'typescript'], flags: { featured: true, trending: true, bestSeller: true, hasLicenseKey: true }, rating: 4.9, reviewCount: 312, salesCount: 4820 },
  { name: 'Nebula UI Pro — React Component Library', tagline: '120+ accessible, animated React components', desc: 'Nebula UI Pro is a production-ready React component library with 120+ components, 30+ blocks and 12 full templates. Built on Radix, Tailwind CSS 4 and Framer Motion. Fully typed, themeable, dark-mode ready, and tree-shakeable.', cat: 'templates-themes', brand: 'Nebula Labs', price: 79, compare: 119, icon: 'LayoutTemplate', gradient: gradients[3], tags: ['react', 'ui', 'tailwind', 'components'], flags: { featured: true, bestSeller: true, hasLicenseKey: true }, rating: 4.8, reviewCount: 540, salesCount: 7310 },
  { name: 'Vertex Analytics Dashboard Kit', tagline: 'Complete analytics dashboard template in Next.js', desc: 'A complete, fully-responsive analytics dashboard built with Next.js 16, TanStack Query, Recharts and shadcn/ui. Includes 25+ chart variants, auth flows, role-based access, and a design system you can ship today.', cat: 'templates-themes', brand: 'Vertex Co.', price: 129, compare: 199, icon: 'Gauge', gradient: gradients[9], tags: ['nextjs', 'dashboard', 'analytics'], flags: { trending: true, bestSeller: true, hasLicenseKey: true }, rating: 4.9, reviewCount: 218, salesCount: 2960 },
  { name: 'Lumen Type — Variable Font Family', tagline: 'A 9-axis variable font family with 64 styles', desc: 'Lumen Type is a contemporary variable font family with optical sizing, weight, width and grade axes. Includes 64 named instances, webfonts, and a commercial license for unlimited projects.', cat: 'design-resources', brand: 'Lumen Type', price: 49, compare: 69, icon: 'PenTool', gradient: gradients[7], tags: ['font', 'typeface', 'variable'], flags: { newArrival: true, featured: true }, rating: 4.7, reviewCount: 96, salesCount: 1410 },
  { name: 'Pixel Forge — 2D Sprite Pack', tagline: '4,200+ hand-crafted pixel-art sprites', desc: 'A massive sprite pack for 2D games: characters, tilesets, props, UI, effects and animated sprites. Delivered as PNG + PSD source, organized for Unity, Godot and GameMaker.', cat: 'games-assets', brand: 'Pixel Forge', price: 39, compare: 59, icon: 'Boxes', gradient: gradients[1], tags: ['pixel', 'sprites', '2d', 'game-art'], flags: { flashDeal: true, trending: true }, rating: 4.8, reviewCount: 167, salesCount: 3210 },
  { name: 'CodeCraft CLI — SaaS Boilerplate', tagline: 'Ship your SaaS in a weekend, not a month', desc: 'A batteries-included Next.js SaaS boilerplate with auth, billing, teams, emails, admin panel, blog and SEO. Powered by Lemon Squeezy, Prisma and Tailwind. Save weeks of setup.', cat: 'code-scripts', brand: 'CodeCraft', price: 199, compare: 299, icon: 'Terminal', gradient: gradients[4], tags: ['saas', 'boilerplate', 'nextjs', 'lemonsqueezy'], flags: { featured: true, bestSeller: true, hasLicenseKey: true }, rating: 5.0, reviewCount: 188, salesCount: 1980 },
  { name: 'Aurora Motion — LUTs & Transitions', tagline: '120 cinematic LUTs + 80 motion transitions', desc: 'Elevate your edits with Aurora Motion: 120 film-grade LUTs and 80 seamless motion transitions for Premiere, DaVinci and Final Cut. Includes a one-click installer.', cat: 'video-motion', brand: 'Studio Aurora', price: 34, compare: 49, icon: 'Film', gradient: gradients[5], tags: ['luts', 'transitions', 'video', 'color'], flags: { flashDeal: true, newArrival: true }, rating: 4.6, reviewCount: 74, salesCount: 1120 },
  { name: 'Brightside Icons — 6,000 Line Icons', tagline: 'A consistent, pixel-perfect icon system', desc: 'Brightside is a meticulously crafted icon system with 6,000 line icons in 6 weights. Delivered as SVG, React, Vue, Figma library and a webfont. A license covers unlimited products.', cat: 'design-resources', brand: 'Brightside', price: 29, compare: 45, icon: 'Sparkles', gradient: gradients[6], tags: ['icons', 'svg', 'figma', 'design'], flags: { trending: true, bestSeller: true }, rating: 4.9, reviewCount: 421, salesCount: 9120 },
  { name: 'Quantum Tasks — macOS Productivity App', tagline: 'A keyboard-first task manager for power users', desc: 'Quantum Tasks is a native macOS productivity app with a keyboard-first workflow, natural-language parsing, calendar sync, and focus timers. Lifetime license with 2 years of updates.', cat: 'software-apps', brand: 'Quantum Apps', price: 59, compare: 89, icon: 'Cpu', gradient: gradients[8], tags: ['macos', 'productivity', 'native'], flags: { featured: true, hasLicenseKey: true }, rating: 4.8, reviewCount: 142, salesCount: 2310 },
  { name: 'Maker Kit — Indie Hacker Bundle', tagline: '12 mini-products with full source code', desc: 'A bundle of 12 shippable mini-products — feedback boards, link pages, waitlists, changelogs, billing portals and more — each with full source, deployment guides and commercial rights.', cat: 'code-scripts', brand: 'Maker Kit', price: 99, compare: 179, icon: 'Rocket', gradient: gradients[2], tags: ['bundle', 'indie', 'source'], flags: { flashDeal: true, trending: true, hasLicenseKey: true }, rating: 4.7, reviewCount: 203, salesCount: 3450 },
  { name: 'Aurora Sound — Lo-Fi Sample Pack', tagline: '320 royalty-free lo-fi loops & one-shots', desc: 'Aurora Sound delivers 320 warm, tape-saturated lo-fi loops, one-shots and MIDI files. Royalty-free for streaming, beat-making and commercial release.', cat: 'audio-music', brand: 'Studio Aurora', price: 24, compare: 39, icon: 'Music', gradient: gradients[9], tags: ['lofi', 'samples', 'royalty-free'], flags: { newArrival: true, flashDeal: true }, rating: 4.6, reviewCount: 58, salesCount: 870 },
  { name: 'PlayBeat Pro Membership', tagline: 'All current + future PlayBeat products', desc: 'Unlock every PlayBeat Studios product and all future releases with a single membership. Priority support, early access to betas, and commercial licensing included.', cat: 'software-apps', brand: 'PlayBeat Studios', price: 19, compare: 29, icon: 'Zap', gradient: gradients[0], tags: ['membership', 'subscription', 'bundle'], flags: { featured: true, isSubscription: true, subscriptionInterval: 'monthly', hasLicenseKey: true }, rating: 4.9, reviewCount: 612, salesCount: 8420 },
  { name: 'Nebula Commerce Theme', tagline: 'Headless Shopify + Next.js storefront', desc: 'A high-performance headless commerce theme pairing Shopify with Next.js 16. ISR, predictive search, cart, checkout, subscriptions and a fully themeable design system.', cat: 'templates-themes', brand: 'Nebula Labs', price: 149, compare: 229, icon: 'Layers', gradient: gradients[3], tags: ['shopify', 'headless', 'nextjs'], flags: { trending: true, bestSeller: true, hasLicenseKey: true }, rating: 4.8, reviewCount: 134, salesCount: 1610 },
  { name: 'Lumen Illustrations — 900 Scenes', tagline: 'A cohesive, editable illustration library', desc: '900 editable scene illustrations in a consistent style. Delivered as SVG + Figma with recolorable palettes, in 12 categories. Commercial license for web, app and print.', cat: 'design-resources', brand: 'Lumen Type', price: 45, compare: 69, icon: 'Wand2', gradient: gradients[7], tags: ['illustrations', 'svg', 'figma'], flags: { newArrival: true, featured: true }, rating: 4.7, reviewCount: 81, salesCount: 1290 },
  { name: 'Brightside Sound Effects — Vol. 3', tagline: '1,200 cinematic sound effects', desc: '1,200 mastered cinematic sound effects — impacts, risers, whooshes, UI sounds and ambiences. 24-bit WAV, organized for any NLE or game engine.', cat: 'audio-music', brand: 'Brightside', price: 32, compare: 49, icon: 'Mic', gradient: gradients[5], tags: ['sfx', 'cinematic', 'audio'], flags: { flashDeal: true, trending: true }, rating: 4.8, reviewCount: 64, salesCount: 980 },
  { name: 'CodeCraft API Starter', tagline: 'Type-safe REST API in Node + TypeScript', desc: 'A production-grade REST API starter with JWT auth, rate limiting, validation, OpenAPI docs, background jobs and tests. Prisma + PostgreSQL ready. Deploy in minutes.', cat: 'code-scripts', brand: 'CodeCraft', price: 69, compare: 99, icon: 'Braces', gradient: gradients[4], tags: ['api', 'node', 'typescript', 'backend'], flags: { bestSeller: true, hasLicenseKey: true }, rating: 4.8, reviewCount: 119, salesCount: 2030 },
  { name: 'Vertex 3D — Low-Poly Pack', tagline: '850 low-poly 3D models, game-ready', desc: '850 optimized low-poly 3D models with PBR materials, rigged characters and modular environments. FBX, GLB and Blender source included.', cat: 'games-assets', brand: 'Vertex Co.', price: 54, compare: 79, icon: 'Boxes', gradient: gradients[1], tags: ['3d', 'lowpoly', 'game-art'], flags: { newArrival: true, trending: true }, rating: 4.7, reviewCount: 47, salesCount: 740 },
  { name: 'Indie Dev Mastery — Video Course', tagline: '28 hours of indie product building', desc: 'A 28-hour video course on shipping profitable indie products: idea validation, building, launching, pricing and growth. Includes templates, scripts and a private community.', cat: 'ebooks-courses', brand: 'Maker Kit', price: 89, compare: 149, icon: 'BookOpen', gradient: gradients[8], tags: ['course', 'indie', 'growth'], flags: { featured: true, bestSeller: true }, rating: 4.9, reviewCount: 276, salesCount: 4180 },
  { name: 'Pixel Forge — Game UI Kit', tagline: '120 game UI screens, fully customizable', desc: 'A complete game UI kit: HUDs, menus, inventory, shop, settings and onboarding screens. Editable PSD + Figma with smart scaling for any resolution.', cat: 'templates-themes', brand: 'Pixel Forge', price: 38, compare: 55, icon: 'LayoutTemplate', gradient: gradients[6], tags: ['game-ui', 'kit', 'psd'], flags: { flashDeal: true, newArrival: true }, rating: 4.6, reviewCount: 39, salesCount: 690 },
  { name: 'Nebula Motion — React Animation Kit', tagline: '180 reusable Framer Motion components', desc: '180 ready-to-use animation components and 40 page transitions for React. Built on Framer Motion with performance presets, gestures and scroll effects.', cat: 'code-scripts', brand: 'Nebula Labs', price: 44, compare: 64, icon: 'Sparkles', gradient: gradients[3], tags: ['react', 'animation', 'framer'], flags: { trending: true, hasLicenseKey: true }, rating: 4.8, reviewCount: 92, salesCount: 1560 },
  { name: 'Aurora Photo — Lightroom Presets', tagline: '48 cinematic Lightroom presets', desc: '48 film-inspired Lightroom presets for portraits, travel and street photography. One-click installs for desktop and mobile Lightroom.', cat: 'design-resources', brand: 'Studio Aurora', price: 19, compare: 29, icon: 'Camera', gradient: gradients[5], tags: ['presets', 'lightroom', 'photo'], flags: { flashDeal: true, bestSeller: true }, rating: 4.7, reviewCount: 211, salesCount: 5630 },
  { name: 'Quantum Sync — Cloud Backup Tool', tagline: 'End-to-end encrypted backup for teams', desc: 'Quantum Sync is a cross-platform backup tool with end-to-end encryption, incremental sync, versioning and team management. Lifetime license for 5 devices.', cat: 'software-apps', brand: 'Quantum Apps', price: 75, compare: 119, icon: 'Cpu', gradient: gradients[4], tags: ['backup', 'security', 'cross-platform'], flags: { newArrival: true, hasLicenseKey: true }, rating: 4.8, reviewCount: 58, salesCount: 920 },
  { name: 'Brightside Newsletter — Annual', tagline: 'Premium weekly creator newsletter', desc: 'A weekly premium newsletter for digital creators: growth tactics, teardowns, deals and an archive of 200+ past issues. Billed annually.', cat: 'ebooks-courses', brand: 'Brightside', price: 59, compare: 99, icon: 'BookOpen', gradient: gradients[2], tags: ['newsletter', 'creator', 'subscription'], flags: { isSubscription: true, subscriptionInterval: 'yearly', featured: true }, rating: 4.9, reviewCount: 340, salesCount: 5210 },
  { name: 'Lumen Mockups — Device Pack', tagline: '140 device mockups for any product', desc: '140 high-resolution device mockups — phones, tablets, laptops, desktops and wearables — in editable PSD with smart objects and dynamic shadows.', cat: 'design-resources', brand: 'Lumen Type', price: 27, compare: 39, icon: 'Layers', gradient: gradients[1], tags: ['mockups', 'psd', 'device'], flags: { trending: true, flashDeal: true }, rating: 4.7, reviewCount: 73, salesCount: 1340 },
  { name: 'Aether FX — Particle Pack', tagline: '300+ particle effects for games', desc: '300+ ready-to-use particle effects: explosions, magic, fire, smoke, sparks and ambient FX. Unity + Unreal + Godot packages included.', cat: 'games-assets', brand: 'PlayBeat Studios', price: 42, compare: 59, icon: 'Wand2', gradient: gradients[0], tags: ['particles', 'vfx', 'unity', 'unreal'], flags: { newArrival: true, trending: true }, rating: 4.8, reviewCount: 51, salesCount: 880 },
]

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const reviewers = [
  { name: 'Maya Chen', avatar: 'MC' },
  { name: 'Daniel Park', avatar: 'DP' },
  { name: 'Sofia Reyes', avatar: 'SR' },
  { name: 'Liam Walsh', avatar: 'LW' },
  { name: 'Aisha Khan', avatar: 'AK' },
  { name: 'Noah Bennett', avatar: 'NB' },
  { name: 'Yuki Tanaka', avatar: 'YT' },
  { name: 'Emma Müller', avatar: 'EM' },
  { name: 'Carlos Mendez', avatar: 'CM' },
  { name: 'Priya Nair', avatar: 'PN' },
]

const reviewTitles = [
  'Exactly what my team needed',
  'Worth every penny',
  'Polished and well supported',
  'Shipped in record time',
  'Fantastic quality',
  'Best purchase this quarter',
  'Incredible value',
  'Saved me weeks of work',
  'Clean code, great docs',
  'My go-to from now on',
]
const reviewComments = [
  'The build quality is excellent and the documentation made onboarding trivial. Highly recommended for any serious project.',
  'I was skeptical at first but the attention to detail won me over. Updates have been consistent and the support is responsive.',
  'Beautifully structured and a pleasure to work with. It became the foundation of our new product launch.',
  'Performance is outstanding and the design system is flexible enough to adapt to our brand. Five stars.',
  'The amount of content for the price is unbeatable. Everything is organized and easy to find.',
  'I have tried alternatives and nothing comes close. This is now a core part of our workflow.',
]

async function main() {
  console.log('Seeding PlayBeat Digital...')

  // Clean
  await db.auditLog.deleteMany()
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.review.deleteMany()
  await db.ticket.deleteMany()
  await db.newsletter.deleteMany()
  await db.coupon.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.user.deleteMany()

  // Categories
  const catMap: Record<string, string> = {}
  for (const c of categories) {
    const created = await db.category.create({ data: { ...c } })
    catMap[c.slug] = created.id
  }
  console.log(`Created ${categories.length} categories`)

  // Users
  const roles = ['super_admin', 'admin', 'finance', 'support', 'marketing', 'customer', 'customer', 'customer']
  const users: { id: string; name: string; email: string }[] = []
  for (let i = 0; i < 8; i++) {
    const name = reviewers[i].name
    const u = await db.user.create({
      data: {
        email: name.toLowerCase().replace(/[^a-z]+/g, '.') + (i + 1) + '@playbeat.dev',
        name,
        role: roles[i],
        points: 100 + i * 45,
        referralCode: 'PB-' + (1000 + i),
        status: 'active',
      },
    })
    users.push({ id: u.id, name: u.name, email: u.email })
  }
  // a few more customers
  for (let i = 0; i < 6; i++) {
    const name = 'Customer ' + (i + 1)
    const u = await db.user.create({
      data: {
        email: 'customer' + (i + 1) + '@playbeat.dev',
        name,
        role: 'customer',
        points: 40 + i * 30,
        referralCode: 'PB-' + (2000 + i),
        status: 'active',
      },
    })
    users.push({ id: u.id, name: u.name, email: u.email })
  }

  // Products
  const productIds: string[] = []
  for (const s of seeds) {
    const p = await db.product.create({
      data: {
        name: s.name,
        slug: slugify(s.name),
        tagline: s.tagline,
        description: s.desc,
        categoryId: catMap[s.cat],
        brand: s.brand,
        price: s.price,
        compareAtPrice: s.compare ?? null,
        rating: s.rating,
        reviewCount: s.reviewCount,
        salesCount: s.salesCount,
        featured: !!s.flags.featured,
        trending: !!s.flags.trending,
        bestSeller: !!s.flags.bestSeller,
        flashDeal: !!s.flags.flashDeal,
        newArrival: !!s.flags.newArrival,
        hasLicenseKey: !!s.flags.hasLicenseKey,
        isSubscription: !!s.flags.isSubscription,
        subscriptionInterval: s.flags.subscriptionInterval ?? null,
        coverGradient: s.gradient,
        coverImage: productImages[s.name] || null,
        icon: s.icon,
        tags: s.tags.join(','),
        fileUrl: null,
        fileName: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-v2.zip',
        fileSize: (Math.floor(Math.random() * 400) + 20) + ' MB',
      },
    })
    productIds.push(p.id)

    // Reviews for this product (2-4 each)
    const n = 2 + Math.floor(Math.random() * 3)
    for (let i = 0; i < n; i++) {
      const r = reviewers[(i + productIds.length) % reviewers.length]
      const u = users[(i + productIds.length) % users.length]
      await db.review.create({
        data: {
          productId: p.id,
          userId: u.id,
          userName: r.name,
          userAvatar: r.avatar,
          rating: 4 + (i % 2),
          title: reviewTitles[(i + productIds.length) % reviewTitles.length],
          comment: reviewComments[(i + productIds.length) % reviewComments.length],
          verified: i % 3 !== 0,
        },
      })
    }
  }
  console.log(`Created ${seeds.length} products with reviews`)

  // Coupons
  await db.coupon.create({ data: { code: 'WELCOME10', type: 'percentage', value: 10, minSpend: 0, usageLimit: 0, active: true } })
  await db.coupon.create({ data: { code: 'FLASH25', type: 'percentage', value: 25, minSpend: 50, usageLimit: 500, usedCount: 132, active: true } })
  await db.coupon.create({ data: { code: 'SAVE15', type: 'fixed', value: 15, minSpend: 80, usageLimit: 1000, usedCount: 410, active: true } })
  await db.coupon.create({ data: { code: 'FIRST5', type: 'first_purchase', value: 5, minSpend: 0, usageLimit: 0, active: true } })
  await db.coupon.create({ data: { code: 'REFER20', type: 'referral', value: 20, minSpend: 0, usageLimit: 0, active: true } })
  await db.coupon.create({ data: { code: 'EXPIRED5', type: 'percentage', value: 5, minSpend: 0, expiry: new Date(Date.now() - 86400000 * 3), active: false } })
  console.log('Created coupons')

  // Orders — generate ~40 historical orders across last 60 days
  const statuses = ['pending', 'paid', 'processing', 'completed', 'completed', 'completed', 'refunded', 'cancelled']
  const payMethods = ['card', 'apple_pay', 'google_pay', 'paypal']
  let orderCounter = 1000
  for (let i = 0; i < 48; i++) {
    const p = seeds[i % seeds.length]
    const customer = users[(i * 3) % users.length]
    const qty = 1 + (i % 3)
    const subtotal = p.price * qty
    const discount = i % 4 === 0 ? Math.round(subtotal * 0.1 * 100) / 100 : 0
    const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100
    const total = Math.round((subtotal - discount + tax) * 100) / 100
    const daysAgo = Math.floor((i / 48) * 60)
    const createdAt = new Date(Date.now() - daysAgo * 86400000 - (i % 24) * 3600000)
    const status = statuses[i % statuses.length]
    const o = await db.order.create({
      data: {
        number: 'PB-' + (++orderCounter),
        userId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        status,
        paymentStatus: status === 'completed' || status === 'paid' || status === 'processing' ? 'paid' : status === 'refunded' ? 'refunded' : 'unpaid',
        paymentMethod: payMethods[i % payMethods.length],
        subtotal,
        discount,
        tax,
        total,
        couponCode: discount > 0 ? (i % 2 === 0 ? 'WELCOME10' : 'FLASH25') : null,
        createdAt,
        items: {
          create: {
            productId: productIds[i % productIds.length],
            name: p.name,
            price: p.price,
            quantity: qty,
            licenseKey: p.flags.hasLicenseKey ? 'PB-' + Math.random().toString(36).slice(2, 8).toUpperCase() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase() : null,
          },
        },
      },
    })
  }
  console.log('Created orders')

  // Tickets
  const ticketSubjects = ['Download link not received', 'License key activation issue', 'Refund request', 'Subscription renewal question', 'Variant compatibility check']
  const ticketCats = ['download', 'license', 'refund', 'other', 'order']
  for (let i = 0; i < 8; i++) {
    const c = users[(i + 4) % users.length]
    await db.ticket.create({
      data: {
        number: 'TKT-' + (500 + i),
        userId: c.id,
        subject: ticketSubjects[i % ticketSubjects.length],
        category: ticketCats[i % ticketCats.length],
        priority: ['low', 'normal', 'high', 'urgent'][i % 4],
        status: ['open', 'pending', 'resolved', 'closed'][i % 4],
        message: 'Hi team, I need help with my recent purchase. Could you assist at your earliest convenience?',
      },
    })
  }

  // Newsletter
  for (let i = 0; i < 12; i++) {
    await db.newsletter.create({ data: { email: `subscriber${i + 1}@example.com` } })
  }

  // Audit logs
  const auditActions = [
    { actor: 'admin@playbeat.dev', action: 'product.create', entity: 'Product', entityId: productIds[0] },
    { actor: 'admin@playbeat.dev', action: 'coupon.create', entity: 'Coupon' },
    { actor: 'finance@playbeat.dev', action: 'order.refund', entity: 'Order' },
    { actor: 'marketing@playbeat.dev', action: 'flash_deal.publish', entity: 'Product' },
    { actor: 'support@playbeat.dev', action: 'ticket.resolve', entity: 'Ticket' },
  ]
  for (const a of auditActions) {
    await db.auditLog.create({ data: { ...a, createdAt: new Date(Date.now() - Math.random() * 86400000 * 5) } })
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
