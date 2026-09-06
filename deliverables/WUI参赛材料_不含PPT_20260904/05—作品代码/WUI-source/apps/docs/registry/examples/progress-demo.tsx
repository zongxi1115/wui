"use client"

import * as React from "react"

import { Progress } from "@/registry/ui/progress"

export default function ProgressDemo() {
  const [value, setValue] = React.useState(68)

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setValue((current) => (current >= 100 ? 12 : current + 4))
    }, 900)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="w-full max-w-sm space-y-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">Downloading update</span>
        <span className="text-xs tabular-nums text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} aria-label="Downloading update" />
      <p className="text-xs text-muted-foreground">About one minute remaining</p>
    </div>
  )
}
