"use client"

import * as React from "react"

import { SlidingNumber } from "@/registry/ui/sliding-number"

export default function SlidingNumberCountdown() {
  const [secondsLeft, setSecondsLeft] = React.useState(2 * 86400 + 3 * 3600 + 17 * 60 + 42)

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const units = [
    { label: "天", value: Math.floor(secondsLeft / 86400) },
    { label: "时", value: Math.floor((secondsLeft % 86400) / 3600) },
    { label: "分", value: Math.floor((secondsLeft % 3600) / 60) },
    { label: "秒", value: secondsLeft % 60 },
  ]

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-muted-foreground text-sm">距离秋季发布会还有</p>
      <div className="flex items-start gap-5">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center gap-1">
            <span className="font-mono text-4xl font-semibold tracking-tight">
              <SlidingNumber value={unit.value} padStart />
            </span>
            <span className="text-muted-foreground text-xs">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
