"use client"

import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  AiChat,
  AiChatAvatar,
  AiChatLoading,
  AiChatMessage,
  AiChatMessageActions,
  AiChatMessageContent,
  AiChatMessages,
  AiChatPrompt,
  AiChatPromptFooter,
  AiChatScrollButton,
  AiChatSubmit,
  AiChatTextarea,
} from "@/registry/ui/ai-chat"
import {
  AiMessageCopy,
  AiMessageFeedback,
  AiMessageRetry,
} from "@/registry/ui/ai-message-actions"
import {
  AiReasoning,
  AiReasoningContent,
  AiReasoningStep,
  AiReasoningTrigger,
} from "@/registry/ui/ai-reasoning"
import { AiStream } from "@/registry/ui/ai-stream"
import {
  AiTodo,
  AiTodoHeader,
  AiTodoItem,
  AiTodoList,
  AiTodoProgress,
  type AiTodoStatus,
} from "@/registry/ui/ai-todo"
import {
  AiTool,
  AiToolCode,
  AiToolContent,
  AiToolLabel,
  AiToolSection,
  AiToolTrigger,
} from "@/registry/ui/ai-tool"

const QUESTION = "检查登录接口的限流策略，给出加固方案。"

const STEPS = [
  "读取认证中间件与限流配置",
  "评估撞库与突发流量下的风险",
  "拟定分级限流与人机验证策略",
]

const PLAN = ["按 IP 与账号双维度限流", "连续失败后要求人机验证", "限流命中写入审计日志"]

const ANSWER =
  "当前登录接口只有按 IP 的固定窗口限流，撞库时容易被分布式 IP 绕过。建议改为 IP 与账号双维度的滑动窗口：同一账号 5 分钟内最多 5 次尝试，连续失败 3 次后要求人机验证；所有命中限流的请求写入审计日志，便于风控回溯。"

/**
 * One scripted agent turn. Each tick advances the run so every component
 * shows its own transition: reasoning steps, tool status, plan progress and
 * the streamed answer.
 */
const TIMELINE = {
  thinking: 1, // ticks 1-3 reveal reasoning steps
  tool: 4, // tool starts running
  toolDone: 6,
  plan: 7, // ticks 7-9 complete plan items
  answer: 10,
} as const

export default function AiChatAgent() {
  const [tick, setTick] = React.useState(0)
  const [answerLength, setAnswerLength] = React.useState(0)
  const [prompt, setPrompt] = React.useState("")

  React.useEffect(() => {
    if (tick >= TIMELINE.answer) return
    const timer = window.setTimeout(
      () => setTick((current) => current + 1),
      tick === 0 ? 700 : 900
    )
    return () => window.clearTimeout(timer)
  }, [tick])

  const answer = ANSWER.slice(0, answerLength)
  const done = answerLength === ANSWER.length

  React.useEffect(() => {
    if (tick < TIMELINE.answer || done) return
    const timer = window.setInterval(() => {
      setAnswerLength((current) => Math.min(current + 2, ANSWER.length))
    }, 28)
    return () => window.clearInterval(timer)
  }, [done, tick])

  function restart() {
    setAnswerLength(0)
    setTick(0)
  }

  const thinking = tick >= TIMELINE.thinking && tick < TIMELINE.tool
  const visibleSteps = Math.min(Math.max(tick - TIMELINE.thinking + 1, 0), STEPS.length)
  const toolStatus =
    tick < TIMELINE.tool ? null : tick < TIMELINE.toolDone ? "running" : "success"
  const planDone = Math.min(Math.max(tick - TIMELINE.plan + 1, 0), PLAN.length)
  const planStatus = (index: number): AiTodoStatus =>
    index < planDone ? "completed" : index === planDone ? "in-progress" : "pending"
  const streaming = tick >= TIMELINE.answer && !done

  return (
    <AiChat className="mx-auto h-[600px] max-w-3xl">
      <AiChatMessages>
        <AiChatMessage role="user">
          <AiChatMessageContent role="user">{QUESTION}</AiChatMessageContent>
        </AiChatMessage>

        <AiChatMessage role="assistant">
          <AiChatAvatar />
          <div className="min-w-0 max-w-[88%] flex-1 space-y-3">
            {tick === 0 ? <AiChatLoading /> : null}

            {tick >= TIMELINE.thinking ? (
              <AiReasoning isStreaming={thinking}>
                <AiReasoningTrigger />
                <AiReasoningContent>
                  {STEPS.slice(0, visibleSteps).map((step, index) => (
                    <AiReasoningStep
                      key={step}
                      label={step}
                      status={
                        thinking && index === visibleSteps - 1 ? "active" : "complete"
                      }
                    />
                  ))}
                </AiReasoningContent>
              </AiReasoning>
            ) : null}

            {toolStatus ? (
              <AiTool
                status={toolStatus}
                className="duration-300 animate-in fade-in-0 slide-in-from-bottom-1"
              >
                <AiToolTrigger name="read_rate_limit_config" />
                <AiToolContent>
                  <AiToolSection>
                    <AiToolLabel>输入</AiToolLabel>
                    <AiToolCode>{`{ "route": "/api/auth/login" }`}</AiToolCode>
                  </AiToolSection>
                  <AiToolSection className="text-xs text-muted-foreground">
                    {toolStatus === "success"
                      ? "fixed_window · 20 次/分钟 · 仅按 IP 计数"
                      : "读取中…"}
                  </AiToolSection>
                </AiToolContent>
              </AiTool>
            ) : null}

            {tick >= TIMELINE.plan ? (
              <AiTodo className="duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
                <AiTodoHeader>
                  加固计划
                  <span className="ml-auto font-mono text-xs font-normal tabular-nums text-muted-foreground">
                    {planDone}/{PLAN.length}
                  </span>
                </AiTodoHeader>
                <AiTodoProgress value={planDone} max={PLAN.length} />
                <AiTodoList>
                  {PLAN.map((item, index) => (
                    <AiTodoItem key={item} title={item} status={planStatus(index)} />
                  ))}
                </AiTodoList>
              </AiTodo>
            ) : null}

            {answer ? (
              <AiChatMessageContent>
                <AiStream isStreaming={streaming} caret>
                  {answer}
                </AiStream>
              </AiChatMessageContent>
            ) : null}

            {done ? (
              <AiChatMessageActions className="-ml-1.5">
                <AiMessageCopy content={ANSWER} />
                <AiMessageRetry onClick={restart} />
                <AiMessageFeedback />
              </AiChatMessageActions>
            ) : null}
          </div>
        </AiChatMessage>
      </AiChatMessages>

      <AiChatScrollButton />

      <AiChatPrompt
        onSubmit={(event) => {
          event.preventDefault()
          if (!prompt.trim()) return
          setPrompt("")
          restart()
        }}
      >
        <AiChatPromptFooter>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="重新运行"
            disabled={!done}
            onClick={restart}
          >
            <RotateCcwIcon />
          </Button>
          <AiChatTextarea
            value={prompt}
            placeholder="追问细节，例如：给出中间件实现"
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
          />
          <AiChatSubmit
            status={done ? "idle" : "streaming"}
            disabled={done && !prompt.trim()}
            onClick={() => {
              if (!done) {
                setTick(TIMELINE.answer)
                setAnswerLength(ANSWER.length)
              }
            }}
          />
        </AiChatPromptFooter>
      </AiChatPrompt>
    </AiChat>
  )
}
