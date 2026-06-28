'use client'

import * as React from 'react'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'

// A premium CSS-based product visual: gradient cover + lucide icon + subtle grid
export function ProductCover({
  gradient,
  icon,
  className,
  showShine = true,
}: {
  gradient: string
  icon: string
  className?: string
  showShine?: boolean
}) {
  const Icon = (Icons as any)[icon] as React.ComponentType<{ className?: string }> | undefined
  const LucideIcon = Icon ?? Icons.Sparkles
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)} />
      {/* texture */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6) 0, transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.35) 0, transparent 45%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      {showShine && (
        <div className="absolute -inset-x-10 -top-10 h-40 rotate-12 bg-white/20 blur-2xl" />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-white/30 blur-xl scale-110" />
          <div className="relative grid place-items-center h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/15 ring-1 ring-white/40 backdrop-blur-sm">
            <LucideIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white drop-shadow" strokeWidth={1.6} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/30" />
    </div>
  )
}

// Small inline icon
export function Icon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as any)[name] as React.ComponentType<{ className?: string }> | undefined
  const LucideIcon = Icon ?? Icons.Sparkles
  return <LucideIcon className={className} />
}
