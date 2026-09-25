"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { Progress } from "@/registry/ui/progress"

type Phase = "idle" | "preparing" | "exporting" | "done"

const captions: Record<Phase, string> = {
  idle: "导出最近 90 天的订单明细，约 12,000 行。",
  preparing: "正在统计数据量，暂时无法预估耗时…",
  exporting: "正在写入 orders-2026Q3.xlsx",
  done: "导出完成，文件已保存到下载中心。",
}

export default function ProgressIndeterminate() {
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    if (phase === "preparing") {
      const timer = window.setTimeout(() => setPhase("exporting"), 2400)
      return () => window.clearTimeout(timer)
    }
    if (phase === "exporting") {
      const timer = window.setInterval(() => {
        setValue((current) =>
          Math.min(100, current + 8 + Math.round(Math.random() * 12))
        )
      }, 380)
      return () => window.clearInterval(timer)
    }
  }, [phase])

  React.useEffect(() => {
    if (value >= 100) setPhase("done")
  }, [value])

  const busy = phase === "preparing" || phase === "exporting"

  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-medium">导出订单报表</p>
        {phase === "exporting" || phase === "done" ? (
          <span className="text-muted-foreground text-xs tabular-nums">
            {value}%
          </span>
        ) : null}
      </div>
      <Progress
        value={phase === "preparing" ? null : value}
        color={phase === "done" ? "success" : "primary"}
        aria-label="报表导出进度"
      />
      <div className="flex items-center justify-between gap-4">
        <p className="text-muted-foreground text-xs">{captions[phase]}</p>
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => {
            setValue(0)
            setPhase("preparing")
          }}
        >
          {phase === "done" ? "再次导出" : "开始导出"}
        </Button>
      </div>
    </div>
  )
}
