"use client"

import * as React from "react"

import { SlidingNumber } from "@/registry/ui/sliding-number"

export default function SlidingNumberDemo() {
  const [value, setValue] = React.useState(64)

  return (
    <div className="bg-background shadow-xs w-full max-w-sm space-y-6 rounded-lg border p-5">
      <div className="flex items-baseline justify-between border-b pb-4">
        <span className="text-muted-foreground text-sm">Current ARR</span>
        <span className="text-4xl font-semibold tracking-tight">
          $<SlidingNumber value={value} />k
        </span>
      </div>
      <input
        aria-label="Current ARR"
        type="range"
        min="0"
        max="999"
        value={value}
        className="accent-primary focus-visible:ring-ring/50 w-full rounded-full outline-none focus-visible:ring-[3px]"
        onChange={(event) => setValue(Number(event.target.value))}
      />
    </div>
  )
}
