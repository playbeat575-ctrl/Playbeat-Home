// Fetch a real cover image for each PlayBeat product via z-ai image-search.
// Run: bun run scripts/fetch-images.ts
import { writeFileSync, readFileSync } from 'fs'

interface Seed {
  name: string
  cat: string
  brand: string
}

const seeds: Seed[] = [
  { name: 'Aether Engine — 2D Game Framework', cat: 'games-assets', brand: 'PlayBeat Studios' },
  { name: 'Nebula UI Pro — React Component Library', cat: 'templates-themes', brand: 'Nebula Labs' },
  { name: 'Vertex Analytics Dashboard Kit', cat: 'templates-themes', brand: 'Vertex Co.' },
  { name: 'Lumen Type — Variable Font Family', cat: 'design-resources', brand: 'Lumen Type' },
  { name: 'Pixel Forge — 2D Sprite Pack', cat: 'games-assets', brand: 'Pixel Forge' },
  { name: 'CodeCraft CLI — SaaS Boilerplate', cat: 'code-scripts', brand: 'CodeCraft' },
  { name: 'Aurora Motion — LUTs & Transitions', cat: 'video-motion', brand: 'Studio Aurora' },
  { name: 'Brightside Icons — 6,000 Line Icons', cat: 'design-resources', brand: 'Brightside' },
  { name: 'Quantum Tasks — macOS Productivity App', cat: 'software-apps', brand: 'Quantum Apps' },
  { name: 'Maker Kit — Indie Hacker Bundle', cat: 'code-scripts', brand: 'Maker Kit' },
  { name: 'Aurora Sound — Lo-Fi Sample Pack', cat: 'audio-music', brand: 'Studio Aurora' },
  { name: 'PlayBeat Pro Membership', cat: 'software-apps', brand: 'PlayBeat Studios' },
  { name: 'Nebula Commerce Theme', cat: 'templates-themes', brand: 'Nebula Labs' },
  { name: 'Lumen Illustrations — 900 Scenes', cat: 'design-resources', brand: 'Lumen Type' },
  { name: 'Brightside Sound Effects — Vol. 3', cat: 'audio-music', brand: 'Brightside' },
  { name: 'CodeCraft API Starter', cat: 'code-scripts', brand: 'CodeCraft' },
  { name: 'Vertex 3D — Low-Poly Pack', cat: 'games-assets', brand: 'Vertex Co.' },
  { name: 'Indie Dev Mastery — Video Course', cat: 'ebooks-courses', brand: 'Maker Kit' },
  { name: 'Pixel Forge — Game UI Kit', cat: 'templates-themes', brand: 'Pixel Forge' },
  { name: 'Nebula Motion — React Animation Kit', cat: 'code-scripts', brand: 'Nebula Labs' },
  { name: 'Aurora Photo — Lightroom Presets', cat: 'design-resources', brand: 'Studio Aurora' },
  { name: 'Quantum Sync — Cloud Backup Tool', cat: 'software-apps', brand: 'Quantum Apps' },
  { name: 'Brightside Newsletter — Annual', cat: 'ebooks-courses', brand: 'Brightside' },
  { name: 'Lumen Mockups — Device Pack', cat: 'design-resources', brand: 'Lumen Type' },
  { name: 'Aether FX — Particle Pack', cat: 'games-assets', brand: 'PlayBeat Studios' },
]

function queryFor(s: Seed): string {
  const n = s.name
  if (n.includes('Aether Engine')) return 'indie 2D game engine editor screenshot with sprites and physics'
  if (n.includes('Nebula UI Pro')) return 'modern react component library dashboard ui design'
  if (n.includes('Vertex Analytics')) return 'analytics dashboard with charts and graphs on screen'
  if (n.includes('Lumen Type')) return 'elegant variable typography font specimen poster'
  if (n.includes('Pixel Forge — 2D Sprite')) return 'pixel art game sprites and tileset sheet'
  if (n.includes('CodeCraft CLI')) return 'developer coding on laptop terminal nextjs saas'
  if (n.includes('Aurora Motion')) return 'cinematic video color grading luts film still'
  if (n.includes('Brightside Icons')) return 'grid of minimal line icons ui design system'
  if (n.includes('Quantum Tasks')) return 'macbook productivity task manager app interface'
  if (n.includes('Maker Kit')) return 'indie hacker workspace laptop code startup'
  if (n.includes('Aurora Sound')) return 'lofi music production studio synthesizer vinyl'
  if (n.includes('PlayBeat Pro')) return 'premium digital subscription membership card gold'
  if (n.includes('Nebula Commerce')) return 'modern ecommerce website storefront on laptop'
  if (n.includes('Lumen Illustrations')) return 'colorful flat vector illustration scenes set'
  if (n.includes('Brightside Sound Effects')) return 'cinematic sound design audio waveform mixing'
  if (n.includes('CodeCraft API Starter')) return 'backend api code editor typescript node'
  if (n.includes('Vertex 3D')) return 'low poly 3d game models render isometric'
  if (n.includes('Indie Dev Mastery')) return 'online video course learning screen laptop'
  if (n.includes('Pixel Forge — Game UI')) return 'video game user interface hud menu design'
  if (n.includes('Nebula Motion')) return 'react animation motion design ui components'
  if (n.includes('Aurora Photo')) return 'photographer editing lightroom presets landscape'
  if (n.includes('Quantum Sync')) return 'cloud backup security software laptop data'
  if (n.includes('Brightside Newsletter')) return 'creator newsletter email on phone screen'
  if (n.includes('Lumen Mockups')) return 'device mockups iphone macbook branding presentation'
  if (n.includes('Aether FX')) return 'particle visual effects explosion game vfx'
  return 'digital product technology abstract'
}

async function searchImage(query: string): Promise<string> {
  const proc = Bun.spawn(['z-ai', 'image-search', '-q', query, '-c', '1', '--gl', 'us', '--no-rank'], {
    stdout: 'pipe', stderr: 'pipe',
  })
  const text = await new Response(proc.stdout).text()
  await proc.exited
  // The CLI prints status lines then a JSON object. Extract the first {...} block.
  const start = text.indexOf('{')
  if (start === -1) {
    console.warn('  no JSON in output')
    return ''
  }
  // Find matching closing brace by depth
  let depth = 0, end = -1
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') { depth--; if (depth === 0) { end = i; break } }
  }
  if (end === -1) {
    console.warn('  incomplete JSON')
    return ''
  }
  try {
    const data = JSON.parse(text.slice(start, end + 1))
    if (data.success && data.results?.[0]?.original_url) {
      return data.results[0].original_url
    }
    console.warn('  no results for:', query)
  } catch (e: any) {
    console.warn('  parse error:', e.message)
  }
  return ''
}

async function main() {
  const out: Record<string, string> = {}
  for (let i = 0; i < seeds.length; i++) {
    const s = seeds[i]
    const q = queryFor(s)
    console.log(`[${i + 1}/${seeds.length}] ${s.name}`)
    console.log(`  query: ${q}`)
    const url = await searchImage(q)
    out[s.name] = url
    console.log(`  url: ${url || '(none)'}`)
  }
  writeFileSync('/home/z/my-project/scripts/product-images.json', JSON.stringify(out, null, 2))
  const found = Object.values(out).filter(Boolean).length
  console.log(`\nDone. ${found}/${seeds.length} images found.`)
  console.log('Saved to scripts/product-images.json')
}

main()
