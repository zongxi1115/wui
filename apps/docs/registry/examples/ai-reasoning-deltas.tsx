"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import {
  AiReasoning,
  AiReasoningContent,
  AiReasoningDeltas,
  AiReasoningTrigger,
} from "@/registry/ui/ai-reasoning"

const sourceDeltas = [
  "先确认需求边界，",
  "保留现有认证逻辑。",
  "\n\n然后读取登录表单，",
  "核对输入、错误提示和提交状态。",
  "\n\n最后整理页面层级，",
  "并检查移动端操作区的间距。",
]

export default function AiReasoningDeltasDemo() {
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
      <AiReasoning isStreaming={streaming} duration={3.1} defaultOpen>
        <AiReasoningTrigger />
        <AiReasoningContent>
          <AiReasoningDeltas deltas={deltas} />
        </AiReasoningContent>
      </AiReasoning>
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
