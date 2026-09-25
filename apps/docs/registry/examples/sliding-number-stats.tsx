"use client"

import * as React from "react"

import { SlidingNumber } from "@/registry/ui/sliding-number"
import { cn } from "@/registry/lib/utils"

type Metric = { label: string; value: number; unit?: string; digits?: number }

const initial: Metric[] = [
  { label: "在线用户", value: 24580 },
  { label: "每秒请求", value: 1842, unit: "次" },
  { label: "P99 延迟", value: 124.8, unit: "ms", digits: 1 },
]

export default function SlidingNumberStats() {
  const [metrics, setMetrics] = React.useState(initial)
  const [deltas, setDeltas] = React.useState<number[]>([0, 0, 0])
  const latest = React.useRef(initial)

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      const current = latest.current
      const next = current.map((metric) => {
        const drift = metric.value * (Math.random() - 0.45) * 0.03
        return {
          ...metric,
          value: Number((metric.value + drift).toFixed(metric.digits ?? 0)),
        }
      })
      latest.current = next
      setMetrics(next)
      setDeltas(
        next.map((metric, index) => metric.value - (current[index]?.value ?? 0))
      )
    }, 2000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <dl className="grid w-full max-w-2xl divide-y rounded-lg border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {metrics.map((metric, index) => {
        const delta = deltas[index] ?? 0
        return (
          <div key={metric.label} className="p-4">
            <dt className="text-muted-foreground text-xs">{metric.label}</dt>
            <dd className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-semibold tracking-tight">
                <SlidingNumber
                  value={metric.digits ? metric.value.toFixed(metric.digits) : metric.value}
                />
              </span>
              {metric.unit ? (
                <span className="text-muted-foreground text-xs">{metric.unit}</span>
              ) : null}
              <span
                className={cn(
                  "ml-auto font-mono text-xs tabular-nums",
                  delta > 0 && "text-success",
                  delta < 0 && "text-destructive",
                  delta === 0 && "text-muted-foreground"
                )}
              >
                {delta > 0 ? "▲" : delta < 0 ? "▼" : "–"}
              </span>
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
