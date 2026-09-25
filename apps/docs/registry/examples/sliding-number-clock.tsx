"use client"

import * as React from "react"

import { SlidingNumber } from "@/registry/ui/sliding-number"

export default function SlidingNumberClock() {
  const [time, setTime] = React.useState<Date | null>(null)

  React.useEffect(() => {
    setTime(new Date())
    const timer = window.setInterval(() => setTime(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-baseline font-mono text-5xl font-semibold tracking-tight">
        {time ? (
          <>
            <SlidingNumber value={time.getHours()} padStart />
            <span className="text-muted-foreground mx-1">:</span>
            <SlidingNumber value={time.getMinutes()} padStart />
            <span className="text-muted-foreground mx-1">:</span>
            <SlidingNumber value={time.getSeconds()} padStart />
          </>
        ) : (
          <span className="text-muted-foreground">--:--:--</span>
        )}
      </div>
      <p className="text-muted-foreground text-xs">本地时间 · 每秒更新</p>
    </div>
  )
}
