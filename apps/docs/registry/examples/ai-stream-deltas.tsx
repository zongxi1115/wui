"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { AiStreamDeltas } from "@/registry/ui/ai-stream"

const sourceDeltas = [
  "登录页改版会保留现有认证逻辑，",
  "优先调整表单的信息层级。",
  "\n\n桌面端沿用现有内容宽度，",
  "移动端则重新整理操作区间距。",
  "\n\n错误提示、加载和提交状态",
  "继续复用组件库已有能力。",
]

export default function AiStreamDeltasDemo() {
  const [deltas, setDeltas] = React.useState<string[]>(sourceDeltas)
  const [streaming, setStreaming] = React.useState(false)

  React.useEffect(() => {
    if (!streaming) return

    let index = 0
    setDeltas([])
    const timer = window.setInterval(() => {
      const delta = sourceDeltas[index]
      if (delta === undefined) {
        window.clearInterval(timer)
        setStreaming(false)
        return
      }
      setDeltas((current) => [...current, delta])
      index += 1
      if (index === sourceDeltas.length) {
        window.clearInterval(timer)
        setStreaming(false)
      }
    }, 520)

    return () => window.clearInterval(timer)
  }, [streaming])

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <div className="text-foreground text-sm leading-7">
        <AiStreamDeltas deltas={deltas} isStreaming={streaming} />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={streaming}
        onClick={() => setStreaming(true)}
      >
        {streaming ? "正在接收 delta…" : "重新播放分段淡入"}
      </Button>
    </div>
  )
}
