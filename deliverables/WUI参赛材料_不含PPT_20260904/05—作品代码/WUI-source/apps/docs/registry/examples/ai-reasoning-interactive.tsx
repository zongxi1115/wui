"use client"

import * as React from "react"
import { PlayIcon, RotateCcwIcon, CheckCircle2Icon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  AiReasoning,
  AiReasoningContent,
  AiReasoningStep,
  AiReasoningTrigger,
} from "@/registry/ui/ai-reasoning"
import { Badge } from "@/registry/ui/badge"

interface StepData {
  id: string
  label: string
  description: string
  meta?: string
}

const ALL_STEPS: StepData[] = [
  {
    id: "1",
    label: "解析用户意图与上下文约束",
    description: "提取关键词：分布式事务、Saga 模式、补偿机制、Idempotency Key。",
    meta: "120ms",
  },
  {
    id: "2",
    label: "查询架构知识库与最佳实践规范",
    description: "检索微服务间通过消息队列实现最终一致性的补偿逻辑设计方案。",
    meta: "340ms",
  },
  {
    id: "3",
    label: "推演高并发场景下的极端异常边界",
    description: "分析网络超时、消息重复投递以及乱序到达时的幂等校验策略。",
    meta: "580ms",
  },
  {
    id: "4",
    label: "生成具备回滚能力的完整实现步骤与时序图",
    description: "输出包含 Try-Confirm-Cancel (TCC) 及本地消息表的架构选型建议。",
    meta: "210ms",
  },
]

export default function AiReasoningInteractive() {
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(-1)
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [open, setOpen] = React.useState(true)

  const startSimulation = () => {
    setCurrentStepIndex(0)
    setIsStreaming(true)
    setOpen(true)
  }

  React.useEffect(() => {
    if (!isStreaming || currentStepIndex < 0) return

    if (currentStepIndex < ALL_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1)
      }, 900)
      return () => clearTimeout(timer)
    } else {
      setIsStreaming(false)
    }
  }, [isStreaming, currentStepIndex])

  const resetSimulation = () => {
    setIsStreaming(false)
    setCurrentStepIndex(-1)
  }

  const duration = currentStepIndex >= ALL_STEPS.length ? 3.6 : undefined

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="rounded-xl border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between border-b pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">思维链推理演示</span>
            {isStreaming && (
              <Badge variant="secondary" className="text-[10px] animate-pulse">
                Thinking…
              </Badge>
            )}
            {!isStreaming && currentStepIndex >= ALL_STEPS.length && (
              <Badge variant="outline" className="text-success border-success/30 text-[10px]">
                <CheckCircle2Icon className="size-3 mr-1" />
                Done
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {Math.min(currentStepIndex + 1, ALL_STEPS.length)} / {ALL_STEPS.length} 步骤
          </span>
        </div>

        <AiReasoning
          open={open}
          onOpenChange={setOpen}
          isStreaming={isStreaming}
          duration={duration}
        >
          <AiReasoningTrigger />
          <AiReasoningContent>
            {currentStepIndex >= 0 ? (
              <div className="space-y-1">
                {ALL_STEPS.map((step, idx) => {
                  if (idx > currentStepIndex) return null
                  const isCurrent = idx === currentStepIndex && isStreaming
                  const isDone = idx < currentStepIndex || !isStreaming

                  return (
                    <AiReasoningStep
                      key={step.id}
                      status={isCurrent ? "active" : isDone ? "complete" : "pending"}
                      label={step.label}
                      description={step.description}
                      meta={step.meta}
                    />
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-2">
                点击下方「开始推理演练」查看思考链动态流式展开…
              </p>
            )}
          </AiReasoningContent>
        </AiReasoning>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={startSimulation}
          disabled={isStreaming}
        >
          <PlayIcon className="size-3.5 mr-1" />
          {isStreaming ? "正在推理分析中…" : "开始推理演练"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={resetSimulation}
          disabled={currentStepIndex === -1}
        >
          <RotateCcwIcon className="size-3.5 mr-1" />
          重置
        </Button>
      </div>
    </div>
  )
}
