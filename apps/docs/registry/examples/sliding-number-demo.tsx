"use client"

import * as React from "react"
import { DollarSign, TrendingUp } from "lucide-react"

import { SlidingNumber } from "@/registry/ui/sliding-number"

export default function SlidingNumberDemo() {
  const [value, setValue] = React.useState(128.5)

  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="size-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground">
              Monthly Recurring Revenue
            </span>
            <span className="block text-[10px] text-muted-foreground">
              Real-time subscription billing (MRR)
            </span>
          </div>
        </div>

        <div className="flex items-baseline font-mono text-3xl font-bold tracking-tight text-foreground">
          <DollarSign className="size-5 text-muted-foreground self-center" />
          <SlidingNumber value={value.toFixed(1)} />
          <span className="ml-1 text-sm font-semibold text-muted-foreground">k</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>调整营收规模</span>
          <span className="font-mono font-medium text-foreground">${value}k</span>
        </div>
        <input
          aria-label="营收调节滑块"
          type="range"
          min="10"
          max="999.9"
          step="0.5"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
      </div>
    </div>
  )
}
