"use client"

import * as React from "react"

import { Progress } from "@/registry/ui/progress"
import { SlidingNumber } from "@/registry/ui/sliding-number"

const TOTAL_MB = 186.4

export default function ProgressDemo() {
  const [value, setValue] = React.useState(18)

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setValue((current) =>
        current >= 100 ? 6 : Math.min(100, current + 3 + Math.round(Math.random() * 9))
      )
    }, 1100)
    return () => window.clearInterval(timer)
  }, [])

  const done = value >= 100
  const downloaded = ((TOTAL_MB * value) / 100).toFixed(1)

  return (
    <div className="w-full max-w-sm space-y-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium">
          {done ? "更新已下载，重启后生效" : "正在下载 v3.8.0 更新"}
        </span>
        <span className="text-muted-foreground inline-flex items-baseline text-xs tabular-nums">
          <SlidingNumber value={value} />%
        </span>
      </div>
      <Progress
        value={value}
        color={done ? "success" : "primary"}
        aria-label="更新下载进度"
      />
      <p className="text-muted-foreground text-xs tabular-nums">
        {downloaded} MB / {TOTAL_MB} MB
      </p>
    </div>
  )
}
