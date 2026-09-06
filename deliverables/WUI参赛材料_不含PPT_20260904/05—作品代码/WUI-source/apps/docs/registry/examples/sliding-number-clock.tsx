"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { SlidingNumber } from "@/registry/ui/sliding-number"

export default function SlidingNumberClock() {
  const [time, setTime] = React.useState<Date | null>(null)

  React.useEffect(() => {
    setTime(new Date())
    const timer = window.setInterval(() => setTime(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  if (!time) {
    return (
      <div className="flex h-32 w-full max-w-sm items-center justify-center rounded-xl border border-border bg-card p-6" />
    )
  }

  const hours = time.getHours()
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const isPm = hours >= 12
  const displayHours = hours % 12 || 12

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center shadow-xs">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Clock className="size-3.5" />
        <span>实时物理时钟 (UTC+8)</span>
      </div>

      <div className="flex items-baseline gap-2 rounded-xl border border-border bg-muted/30 px-6 py-4">
        <div className="font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          <SlidingNumber value={displayHours} padStart />
          <span className="text-muted-foreground animate-pulse">:</span>
          <SlidingNumber value={minutes} padStart />
          <span className="text-muted-foreground animate-pulse">:</span>
          <SlidingNumber value={seconds} padStart />
        </div>
        <span className="font-mono text-xs font-bold text-muted-foreground uppercase">
          {isPm ? "PM" : "AM"}
        </span>
      </div>
    </div>
  )
}
