"use client"

import * as React from "react"
import {
  ActivityIcon,
  CpuIcon,
  HardDriveIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Progress } from "@/registry/ui/progress"

type Tone = "primary" | "success" | "warning" | "destructive"

type Metric = {
  key: "cpu" | "disk" | "success"
  label: string
  icon: LucideIcon
  initial: number
  range: [number, number]
  spread: number
  detail: (value: number) => [string, string]
  tone: (value: number) => Tone
}

const metrics: Metric[] = [
  {
    key: "cpu",
    label: "CPU 负载",
    icon: CpuIcon,
    initial: 34,
    range: [12, 94],
    spread: 24,
    detail: () => ["8 核 · 实时", "峰值 72%"],
    tone: (value) =>
      value >= 85 ? "destructive" : value >= 70 ? "warning" : "primary",
  },
  {
    key: "disk",
    label: "存储容量",
    icon: HardDriveIcon,
    initial: 86,
    range: [84, 90],
    spread: 2,
    detail: (value) => [`已用 ${value * 10} GB`, "总计 1 TB"],
    tone: (value) => (value >= 85 ? "warning" : "primary"),
  },
  {
    key: "success",
    label: "请求成功率",
    icon: ActivityIcon,
    initial: 98,
    range: [93, 100],
    spread: 3,
    detail: () => ["近 1 小时", "SLA 99.9%"],
    tone: (value) => (value >= 97 ? "success" : "warning"),
  },
]

const toneText: Record<Tone, string> = {
  primary: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
}

function drift(metric: Metric, value: number) {
  const next = value + Math.round((Math.random() - 0.5) * metric.spread)
  return Math.min(metric.range[1], Math.max(metric.range[0], next))
}

export default function ProgressDashboard() {
  const [values, setValues] = React.useState(() =>
    metrics.map((metric) => metric.initial)
  )

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setValues((current) =>
        current.map((value, index) => drift(metrics[index], value))
      )
    }, 1800)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="grid w-full max-w-2xl grid-cols-1 divide-y rounded-lg border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {metrics.map((metric, index) => {
        const value = values[index]
        const tone = metric.tone(value)
        const [left, right] = metric.detail(value)
        const Icon = metric.icon
        return (
          <div key={metric.key} className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Icon className="text-muted-foreground size-4" />
                {metric.label}
              </div>
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums transition-colors duration-300",
                  toneText[tone]
                )}
              >
                {value}%
              </span>
            </div>
            <Progress
              value={value}
              color={tone}
              size="sm"
              aria-label={metric.label}
            />
            <div className="text-muted-foreground flex justify-between text-xs tabular-nums">
              <span>{left}</span>
              <span>{right}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
