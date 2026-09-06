"use client"

import * as React from "react"
import { Globe2Icon, LightbulbIcon, SearchIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  AiReasoning,
  AiReasoningContent,
  AiReasoningStep,
  AiReasoningTrigger,
} from "@/registry/ui/ai-reasoning"

const steps: Array<{
  label: string
  meta?: string
  icon: React.ComponentType<{ className?: string }>
  body?: React.ReactNode
}> = [
  {
    label: "已搜索登录页现有组件与设计变量",
    meta: "15 个结果",
    icon: Globe2Icon,
    body: (
      <div className="flex flex-wrap gap-1.5">
        <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
          login form
        </code>
        <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
          auth error state
        </code>
      </div>
    ),
  },
  {
    label: "正在补充查找认证流程与错误状态",
    icon: LightbulbIcon,
  },
  {
    label: "已完成 3 次相关搜索",
    icon: SearchIcon,
  },
  {
    label: "正在整理页面层级与移动端改版方案",
    icon: LightbulbIcon,
  },
]

export default function AiReasoningDemo() {
  const [streaming, setStreaming] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(steps.length)

  React.useEffect(() => {
    if (!streaming) return

    let nextIndex = 0
    setActiveIndex(nextIndex)
    const timer = window.setInterval(() => {
      nextIndex += 1
      setActiveIndex(nextIndex)

      if (nextIndex === steps.length) {
        window.clearInterval(timer)
        setStreaming(false)
      }
    }, 900)

    return () => window.clearInterval(timer)
  }, [streaming])

  const visibleSteps = streaming
    ? steps.slice(0, Math.min(activeIndex + 1, steps.length))
    : steps

  return (
    <div className="mx-auto w-full max-w-xl space-y-5">
      <AiReasoning isStreaming={streaming} duration={10} defaultOpen>
        <AiReasoningTrigger />
        <AiReasoningContent>
          {visibleSteps.map((step, index) => {
            const Icon = step.icon
            const status =
              !streaming || index < activeIndex ? "complete" : "active"

            return (
              <AiReasoningStep
                key={step.label}
                status={status}
                label={step.label}
                meta={step.meta}
                icon={<Icon className="size-3.5" />}
              >
                {step.body}
              </AiReasoningStep>
            )
          })}
        </AiReasoningContent>
      </AiReasoning>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={streaming}
        onClick={() => setStreaming(true)}
      >
        {streaming ? "正在生成思考链…" : "重新播放思考过程"}
      </Button>
    </div>
  )
}
