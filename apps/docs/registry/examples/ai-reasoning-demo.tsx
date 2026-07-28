"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import {
  AiReasoning,
  AiReasoningContent,
  AiReasoningStream,
  AiReasoningTrigger,
} from "@/registry/ui/ai-reasoning"

const fullReasoning =
  "我先确认请求的目标：需要重做登录页，但保留现有认证逻辑。\n\n接着检查项目里的表单、按钮和错误提示，避免引入另一套视觉规则。\n\n现有页面的问题主要是信息层级拥挤，移动端操作区也缺少稳定间距。\n\n因此实施顺序应该是：先整理结构，再复用现有组件，最后核对响应式状态。"

export default function AiReasoningDemo() {
  const [streaming, setStreaming] = React.useState(false)
  const [reasoning, setReasoning] = React.useState(
    "我先确认请求目标，再检查现有组件与设计变量，最后形成实施顺序。"
  )

  React.useEffect(() => {
    if (!streaming) return

    let cursor = 0
    setReasoning("")
    const timer = window.setInterval(() => {
      const deltaSize = cursor % 3 === 0 ? 3 : 2
      cursor = Math.min(cursor + deltaSize, fullReasoning.length)
      setReasoning(fullReasoning.slice(0, cursor))
      if (cursor === fullReasoning.length) {
        window.clearInterval(timer)
        setStreaming(false)
      }
    }, 90)

    return () => window.clearInterval(timer)
  }, [streaming])

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <AiReasoning isStreaming={streaming} duration={2.6} defaultOpen>
        <AiReasoningTrigger />
        <AiReasoningContent>
          <AiReasoningStream>{reasoning}</AiReasoningStream>
        </AiReasoningContent>
      </AiReasoning>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={streaming}
        onClick={() => setStreaming(true)}
      >
        {streaming ? "正在流式输出…" : "重新模拟流式推理"}
      </Button>
    </div>
  )
}
