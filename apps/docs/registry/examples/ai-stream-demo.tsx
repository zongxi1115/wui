"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import {
  AiReasoning,
  AiReasoningContent,
  AiReasoningTrigger,
} from "@/registry/ui/ai-reasoning"
import { AiStream } from "@/registry/ui/ai-stream"

const fullReasoning =
  "先确认问题指向的是流式文本能力，而不是某一种消息外观。接着把文字动画从推理容器中拆出来，让回答与推理共享同一套实现。"

const fullAnswer =
  "可以。流式输出现在是独立能力：普通回答直接使用 AiStream，思考过程则把同一个 AiStream 放进 AiReasoning。两者接收的都是累计文本，并在仍有内容到达时只羽化最右侧边缘。"

type Phase = "idle" | "reasoning" | "answer"

export default function AiStreamDemo() {
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [reasoning, setReasoning] = React.useState(fullReasoning)
  const [answer, setAnswer] = React.useState(fullAnswer)

  React.useEffect(() => {
    if (phase === "idle") return

    const source = phase === "reasoning" ? fullReasoning : fullAnswer
    const update = phase === "reasoning" ? setReasoning : setAnswer
    let cursor = 0

    const timer = window.setInterval(() => {
      cursor = Math.min(cursor + 2, source.length)
      update(source.slice(0, cursor))

      if (cursor === source.length) {
        window.clearInterval(timer)
        setPhase(phase === "reasoning" ? "answer" : "idle")
      }
    }, phase === "reasoning" ? 54 : 42)

    return () => window.clearInterval(timer)
  }, [phase])

  function replay() {
    setReasoning("")
    setAnswer("")
    setPhase("reasoning")
  }

  const isReasoning = phase === "reasoning"
  const isAnswering = phase === "answer"

  return (
    <div className="mx-auto w-full max-w-xl space-y-5">
      <div className="space-y-3">
        <AiReasoning
          isStreaming={isReasoning}
          duration={2.4}
          defaultOpen
        >
          <AiReasoningTrigger />
          <AiReasoningContent>
            <AiStream isStreaming={isReasoning}>{reasoning}</AiStream>
          </AiReasoningContent>
        </AiReasoning>

        <div className="text-sm leading-7 text-foreground">
          <AiStream isStreaming={isAnswering}>{answer}</AiStream>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={phase !== "idle"}
        onClick={replay}
      >
        {isReasoning
          ? "正在流式输出思考过程…"
          : isAnswering
            ? "正在流式输出普通回答…"
            : "重新播放完整响应"}
      </Button>
    </div>
  )
}
