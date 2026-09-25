"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextRoll } from "@/registry/ui/text-roll"

export default function TextRollMountStagger() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div key={key}>
        <p className="text-muted-foreground text-xs">过去 90 天服务可用性</p>
        <TextRoll
          trigger="mount"
          duration={0.7}
          getEnterDelay={(index) => 0.15 + index * 0.05}
          className="mt-2 font-mono text-5xl font-semibold tracking-tight tabular-nums"
        >
          99.992%
        </TextRoll>
      </div>
      <Button variant="ghost" size="sm" onClick={() => setKey((k) => k + 1)}>
        <RotateCcwIcon />
        重播
      </Button>
    </div>
  )
}
