'use client'

import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrency } from '@/lib/use-currency'
import { cn } from '@/lib/utils'

export function CurrencySwitcher({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency, currencies, info } = useCurrency()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('gap-1 rounded-full px-2.5', compact ? 'h-9' : 'h-9')}
          aria-label={`Currency: ${currency}`}
        >
          <span className="text-sm font-semibold">{info.symbol}</span>
          <span className="text-xs font-medium">{currency}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs">Display currency</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {currencies.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setCurrency(c.code)}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-xs font-bold">
                {c.symbol}
              </span>
              <div>
                <div className="text-sm font-medium leading-tight">{c.code}</div>
                <div className="text-[10px] text-muted-foreground">{c.label}</div>
              </div>
            </div>
            {c.code === currency && <Check className="h-4 w-4 text-emerald-500" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-[10px] text-muted-foreground">
          Prices shown in {currency}. Checkout uses USD as the base currency.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
