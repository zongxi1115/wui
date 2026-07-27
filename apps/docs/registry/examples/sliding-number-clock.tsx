"use client"

import * as React from "react"

import { SlidingNumber } from "@/registry/ui/sliding-number"

export default function SlidingNumberClock() {
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <time
      className="bg-background shadow-xs rounded-lg border px-5 py-4 font-mono text-4xl font-medium tabular-nums"
      dateTime={now.toISOString()}
    >
      <SlidingNumber value={now.getHours()} padStart />:
      <SlidingNumber value={now.getMinutes()} padStart />:
      <SlidingNumber value={now.getSeconds()} padStart />
    </time>
  )
}
