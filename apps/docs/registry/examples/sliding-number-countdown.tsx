"use client"

import * as React from "react"
import { Rocket } from "lucide-react"

import { SlidingNumber } from "@/registry/ui/sliding-number"

export default function SlidingNumberCountdown() {
  const [secondsLeft, setSecondsLeft] = React.useState(184200)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const days = Math.floor(secondsLeft / (3600 * 24))
  const hours = Math.floor((secondsLeft % (3600 * 24)) / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-5 rounded-xl border border-border bg-card p-6 text-center shadow-xs">
      <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        <Rocket className="size-3.5" />
        <span>WUI 3.0 全球发布会倒计时</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
        {/* Days */}
        <div className="flex flex-col items-center rounded-lg border border-border bg-muted/20 p-3">
          <div className="font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <SlidingNumber value={days} padStart />
          </div>
          <span className="text-[10px] text-muted-foreground uppercase mt-1">Days</span>
        </div>

        {/* Hours */}
        <div className="flex flex-col items-center rounded-lg border border-border bg-muted/20 p-3">
          <div className="font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <SlidingNumber value={hours} padStart />
          </div>
          <span className="text-[10px] text-muted-foreground uppercase mt-1">Hours</span>
        </div>

        {/* Minutes */}
        <div className="flex flex-col items-center rounded-lg border border-border bg-muted/20 p-3">
          <div className="font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <SlidingNumber value={minutes} padStart />
          </div>
          <span className="text-[10px] text-muted-foreground uppercase mt-1">Mins</span>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center rounded-lg border border-border bg-muted/20 p-3">
          <div className="font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <SlidingNumber value={seconds} padStart />
          </div>
          <span className="text-[10px] text-muted-foreground uppercase mt-1">Secs</span>
        </div>
      </div>
    </div>
  )
}
