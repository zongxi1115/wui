"use client"

import * as React from "react"
import { RefreshCw } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextRoll } from "@/registry/ui/text-roll"

export default function TextRollMountStagger() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-6 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex w-full items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          挂载即时翻滚 (trigger="mount")
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setKey((k) => k + 1)}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className="size-3" />
          重新挂载
        </Button>
      </div>

      <div key={key} className="space-y-4 text-center py-4">
        <TextRoll
          trigger="mount"
          duration={0.6}
          getEnterDelay={(i) => i * 0.04}
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
        >
          99.999% SLA
        </TextRoll>

        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          适用于核心数据大屏披露、重要指标统计卡片首屏亮相。
        </p>
      </div>
    </div>
  )
}
