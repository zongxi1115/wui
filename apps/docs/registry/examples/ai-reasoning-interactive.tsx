"use client"

import * as React from "react"
import { PlayIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  AiReasoning,
  AiReasoningContent,
  AiReasoningStep,
  AiReasoningTrigger,
} from "@/registry/ui/ai-reasoning"
import { AiStream } from "@/registry/ui/ai-stream"

const STEPS = [
  {
    label: "拆解问题：订单支付与库存扣减跨两个服务",
    description: "需要保证最终一致，同时允许任一服务短暂不可用。",
  },
  {
    label: "比较 TCC、Saga 与本地消息表",
    description: "TCC 侵入性高；Saga 补偿清晰；本地消息表实现成本最低。",
  },
  {
    label: "推演重复投递与乱序到达",
    description: "以订单号作为幂等键，消费端先查后写，状态机只允许前进。",
  },
  {
    label: "整理落地顺序与回滚预案",
  },
]

const ANSWER =
  "建议采用「本地消息表 + 可靠投递」：支付服务在同一事务内写订单与待发消息，由投递任务推送到库存服务；库存侧以订单号做幂等，失败时按 Saga 发起补偿退款。"

type Phase = "idle" | "thinking" | "answering" | "done"

export default function AiReasoningInteractive() {
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [stepCount, setStepCount] = React.useState(0)
  const [answer, setAnswer] = React.useState("")

  React.useEffect(() => {
    if (phase !== "thinking") return
    if (stepCount > STEPS.length) {
      setPhase("answering")
      return
    }
    const timer = window.setTimeout(
      () => setStepCount((count) => count + 1),
      stepCount === 0 ? 500 : 1100
    )
    return () => window.clearTimeout(timer)
  }, [phase, stepCount])

  React.useEffect(() => {
    if (phase !== "answering") return
    let cursor = 0
    const timer = window.setInterval(() => {
      cursor = Math.min(cursor + 2, ANSWER.length)
      setAnswer(ANSWER.slice(0, cursor))
      if (cursor === ANSWER.length) {
        window.clearInterval(timer)
        setPhase("done")
      }
    }, 32)
    return () => window.clearInterval(timer)
  }, [phase])

  function start() {
    setStepCount(0)
    setAnswer("")
    setPhase("thinking")
  }

  function reset() {
    setPhase("idle")
    setStepCount(0)
    setAnswer("")
  }

  const thinking = phase === "thinking"
  const visibleSteps = STEPS.slice(0, stepCount)

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={start} disabled={thinking || phase === "answering"}>
          <PlayIcon />
          {phase === "idle" ? "发送问题" : "再问一次"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={reset}
          disabled={phase === "idle"}
        >
          <RotateCcwIcon />
          重置
        </Button>
      </div>

      <div className="rounded-lg bg-muted/50 px-3.5 py-2.5 text-sm text-foreground">
        两个微服务之间怎么保证下单和扣库存的一致性？
      </div>

      {phase !== "idle" ? (
        <div className="space-y-3">
          {/* No duration prop: the trigger measures the thinking time itself. */}
          <AiReasoning isStreaming={thinking}>
            <AiReasoningTrigger />
            <AiReasoningContent>
              {visibleSteps.map((step, index) => (
                <AiReasoningStep
                  key={step.label}
                  status={
                    thinking && index === visibleSteps.length - 1
                      ? "active"
                      : "complete"
                  }
                  label={step.label}
                  description={step.description}
                />
              ))}
            </AiReasoningContent>
          </AiReasoning>

          {answer ? (
            <div className="text-sm leading-7 text-foreground">
              <AiStream isStreaming={phase === "answering"} caret>
                {answer}
              </AiStream>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
