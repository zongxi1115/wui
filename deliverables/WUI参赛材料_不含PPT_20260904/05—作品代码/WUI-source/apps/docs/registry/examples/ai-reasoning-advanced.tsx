"use client"

import * as React from "react"
import {
  FileCode2Icon,
  Globe2Icon,
  LightbulbIcon,
  ScanSearchIcon,
} from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  AiReasoning,
  AiReasoningContent,
  AiReasoningStep,
  AiReasoningTrigger,
} from "@/registry/ui/ai-reasoning"
import { AiStream } from "@/registry/ui/ai-stream"
import {
  AiTool,
  AiToolCode,
  AiToolContent,
  AiToolLabel,
  AiToolSection,
  AiToolTrigger,
} from "@/registry/ui/ai-tool"

const fullAnswer =
  "建议保留现有认证逻辑，只重组页面结构：先统一表单与第三方登录的层级，再补齐加载、错误和禁用状态，最后收紧移动端操作区间距。"

type Phase = "idle" | "reasoning" | "answer"

export default function AiReasoningAdvancedDemo() {
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [open, setOpen] = React.useState(true)
  const [runId, setRunId] = React.useState(0)
  const [visibleCount, setVisibleCount] = React.useState(4)
  const [answer, setAnswer] = React.useState(fullAnswer)

  React.useEffect(() => {
    if (phase !== "reasoning") return

    let count = 1
    const timer = window.setInterval(() => {
      if (count === 4) {
        window.clearInterval(timer)
        setPhase("answer")
        return
      }

      count += 1
      setVisibleCount(count)
    }, 900)

    return () => window.clearInterval(timer)
  }, [phase])

  React.useEffect(() => {
    if (phase !== "answer") return

    let cursor = 0
    const timer = window.setInterval(() => {
      cursor = Math.min(cursor + 2, fullAnswer.length)
      setAnswer(fullAnswer.slice(0, cursor))

      if (cursor === fullAnswer.length) {
        window.clearInterval(timer)
        setPhase("idle")
      }
    }, 38)

    return () => window.clearInterval(timer)
  }, [phase])

  const isReasoning = phase === "reasoning"
  const isAnswering = phase === "answer"

  function getStatus(index: number): "active" | "complete" {
    return isReasoning && index === visibleCount - 1 ? "active" : "complete"
  }

  function replay() {
    setOpen(true)
    setRunId((current) => current + 1)
    setVisibleCount(1)
    setAnswer("")
    setPhase("reasoning")
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <AiReasoning
        open={open}
        isStreaming={isReasoning}
        duration={8.6}
        onOpenChange={setOpen}
      >
        <AiReasoningTrigger
          getLabel={(streaming, duration) =>
            streaming ? "正在分析登录页…" : `思考了 ${duration} 秒`
          }
        />
        <AiReasoningContent>
          {visibleCount >= 1 ? (
            <AiReasoningStep
              key={`${runId}-search`}
              status={getStatus(0)}
              icon={<Globe2Icon className="size-3.5" />}
              label="搜索现有登录体验与组件"
              meta="12 个结果"
            >
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" size="sm">
                  login form
                </Badge>
                <Badge variant="outline" size="sm">
                  auth error state
                </Badge>
                <Badge variant="outline" size="sm">
                  mobile sign in
                </Badge>
              </div>
            </AiReasoningStep>
          ) : null}

          {visibleCount >= 2 ? (
            <AiReasoningStep
              key={`${runId}-files`}
              status={getStatus(1)}
              icon={<FileCode2Icon className="size-3.5" />}
              label="读取页面与认证相关文件"
              meta="4 个文件"
            >
              <div className="grid gap-1 text-xs">
                <code className="text-foreground">app/login/page.tsx</code>
                <code className="text-muted-foreground">
                  components/auth/login-form.tsx
                </code>
              </div>
            </AiReasoningStep>
          ) : null}

          {visibleCount >= 3 ? (
            <AiReasoningStep
              key={`${runId}-states`}
              status={getStatus(2)}
              icon={<ScanSearchIcon className="size-3.5" />}
              label="核对交互状态与设计变量"
              description="保留提交、校验与第三方登录逻辑，只调整展示层。"
            >
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="success" size="sm">
                  默认状态
                </Badge>
                <Badge variant="warning" size="sm">
                  加载状态
                </Badge>
                <Badge variant="destructive" size="sm">
                  错误状态
                </Badge>
              </div>
            </AiReasoningStep>
          ) : null}

          {visibleCount >= 4 ? (
            <AiReasoningStep
              key={`${runId}-plan`}
              status={getStatus(3)}
              icon={<LightbulbIcon className="size-3.5" />}
              label="形成可以直接执行的改版方案"
            >
              <AiTool
                status={isReasoning ? "running" : "success"}
                defaultOpen
                className="mt-1"
              >
                <AiToolTrigger name="analyze_login_flow" />
                <AiToolContent>
                  <AiToolSection>
                    <AiToolLabel>输入</AiToolLabel>
                    <AiToolCode>{`{
  "scope": "app/login",
  "preserveAuth": true
}`}</AiToolCode>
                  </AiToolSection>
                  <AiToolSection>
                    <AiToolLabel>结果</AiToolLabel>
                    已确认 3 个布局问题和 2 个移动端间距问题。
                  </AiToolSection>
                </AiToolContent>
              </AiTool>
            </AiReasoningStep>
          ) : null}
        </AiReasoningContent>
      </AiReasoning>

      <div className="text-foreground min-h-14 text-sm leading-7">
        <AiStream isStreaming={isAnswering}>{answer}</AiStream>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={phase !== "idle"}
        onClick={replay}
      >
        {isReasoning
          ? "正在追加思考步骤…"
          : isAnswering
            ? "正在生成回答…"
            : "重新播放完整过程"}
      </Button>
    </div>
  )
}
