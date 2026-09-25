"use client"

import * as React from "react"
import { CheckIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Motion } from "@/registry/ui/motion"

export default function MotionDemo() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <Motion
        key={key}
        preset="blur-up"
        transition="gentle"
        className="flex w-full items-start gap-3 rounded-lg border bg-background p-4 shadow-sm"
      >
        <span className="bg-success/10 text-success mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
          <CheckIcon className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">发布成功</p>
          <p className="text-muted-foreground mt-0.5 text-sm">
            v2.4.0 已推送到生产环境，预计 3 分钟内全量生效。
          </p>
        </div>
      </Motion>
      <Button variant="ghost" size="sm" onClick={() => setKey((k) => k + 1)}>
        <RotateCcwIcon />
        重播
      </Button>
    </div>
  )
}
