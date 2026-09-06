"use client"

import * as React from "react"
import {
  CopyIcon,
  RotateCcwIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  SparklesIcon,
} from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Badge } from "@/registry/ui/badge"
import {
  AiChat,
  AiChatAvatar,
  AiChatMessage,
  AiChatMessageActions,
  AiChatMessageContent,
  AiChatMessages,
  AiChatPrompt,
  AiChatPromptFooter,
  AiChatPromptTools,
  AiChatScrollButton,
  AiChatSubmit,
  AiChatTextarea,
} from "@/registry/ui/ai-chat"
import {
  AiReasoning,
  AiReasoningContent,
  AiReasoningStep,
  AiReasoningTrigger,
} from "@/registry/ui/ai-reasoning"
import {
  AiTool,
  AiToolCode,
  AiToolContent,
  AiToolLabel,
  AiToolSection,
  AiToolTrigger,
} from "@/registry/ui/ai-tool"
import { AiStream } from "@/registry/ui/ai-stream"

export default function AiChatAgent() {
  const [prompt, setPrompt] = React.useState("")
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [messages, setMessages] = React.useState<Array<{ role: "user" | "assistant"; text: string }>>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isStreaming) return

    const userText = prompt.trim()
    setMessages((prev) => [...prev, { role: "user", text: userText }])
    setPrompt("")
    setIsStreaming(true)

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `针对您的问题「${userText}」，我已完成上下文分析并生成了对应的解决方案配置。`,
        },
      ])
      setIsStreaming(false)
    }, 2000)
  }

  return (
    <AiChat className="mx-auto h-[640px] max-w-3xl shadow-xs">
      <AiChatMessages>
        {/* User Request */}
        <AiChatMessage role="user">
          <AiChatMessageContent role="user">
            检查用户认证模块的速率限制（Rate Limiting）策略，并提供防护方案。
          </AiChatMessageContent>
        </AiChatMessage>

        {/* Assistant Multi-step Agent Response */}
        <AiChatMessage role="assistant">
          <AiChatAvatar>
            <SparklesIcon className="size-3.5 text-primary" />
          </AiChatAvatar>
          <div className="min-w-0 max-w-[88%] flex-1 space-y-3">
            <AiChatMessageContent>
              收到。正在检索 `src/middleware/auth.ts` 与 Redis 限流配置…
            </AiChatMessageContent>

            {/* Reasoning breakdown */}
            <AiReasoning duration={3.2} defaultOpen={false}>
              <AiReasoningTrigger />
              <AiReasoningContent>
                <AiReasoningStep
                  status="complete"
                  label="检索现有中间件配置"
                  description="扫描 IP 基础限频策略及滑窗计数算法。"
                />
                <AiReasoningStep
                  status="complete"
                  label="评估高并发雪崩风险"
                  description="发现登录接口缺少分级限流与验证码降级机制。"
                />
                <AiReasoningStep
                  status="complete"
                  label="拟定分布式 Token Bucket 防护策略"
                />
              </AiReasoningContent>
            </AiReasoning>

            {/* Tool execution */}
            <AiTool status="success" defaultOpen={false}>
              <AiToolTrigger name="inspect_redis_rate_limit" />
              <AiToolContent>
                <AiToolSection>
                  <AiToolLabel>调用入参</AiToolLabel>
                  <AiToolCode>{`{
  "route": "/api/v1/auth/login",
  "algorithm": "token_bucket",
  "capacity": 5,
  "refillRate": "1/sec"
}`}</AiToolCode>
                </AiToolSection>
                <AiToolSection>
                  <AiToolLabel>执行反馈</AiToolLabel>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-success border-success/30">
                      Policy Valid
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      规则已预检，可在生产环境部署。
                    </span>
                  </div>
                </AiToolSection>
              </AiToolContent>
            </AiTool>

            <AiChatMessageContent>
              <p>
                已完成对认证模块的安全审计。建议采取以下三项加固措施：
              </p>
              <ul className="mt-2 list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                <li>针对同一 IP 的登录尝试限制为 <strong>5 次 / 分钟</strong>；</li>
                <li>连续失败 3 次后，强制要求完成 Turnstile 人机验证；</li>
                <li>采用 Redis 滑动窗口计数，避免固定时间窗口边缘流量尖刺。</li>
              </ul>
            </AiChatMessageContent>

            <AiChatMessageActions>
              <Button variant="ghost" size="icon" className="size-7" aria-label="复制回复">
                <CopyIcon className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="size-7" aria-label="重新生成">
                <RotateCcwIcon className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="size-7" aria-label="点赞">
                <ThumbsUpIcon className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="size-7" aria-label="点踩">
                <ThumbsDownIcon className="size-3.5" />
              </Button>
            </AiChatMessageActions>
          </div>
        </AiChatMessage>

        {/* Dynamic Messages */}
        {messages.map((msg, index) => (
          <AiChatMessage key={index} role={msg.role}>
            {msg.role === "assistant" && (
              <AiChatAvatar>
                <SparklesIcon className="size-3.5 text-primary" />
              </AiChatAvatar>
            )}
            <AiChatMessageContent role={msg.role}>
              <AiStream isStreaming={false}>{msg.text}</AiStream>
            </AiChatMessageContent>
          </AiChatMessage>
        ))}

        {isStreaming && (
          <AiChatMessage role="assistant">
            <AiChatAvatar>
              <SparklesIcon className="size-3.5 text-primary" />
            </AiChatAvatar>
            <AiChatMessageContent>
              <AiStream isStreaming={true}>正在思考并生成解决方案…</AiStream>
            </AiChatMessageContent>
          </AiChatMessage>
        )}
      </AiChatMessages>

      <AiChatScrollButton />

      <AiChatPrompt onSubmit={handleSubmit}>
        <AiChatPromptFooter>
          <AiChatPromptTools>
            <Badge variant="secondary" className="text-[11px] font-normal">
              Claude 3.5 Sonnet
            </Badge>
          </AiChatPromptTools>
          <AiChatTextarea
            value={prompt}
            placeholder="追问细节或要求生成 TypeScript 中间件代码…"
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                e.currentTarget.form?.requestSubmit()
              }
            }}
          />
          <AiChatSubmit status={isStreaming ? "streaming" : "idle"} disabled={!prompt.trim() && !isStreaming} />
        </AiChatPromptFooter>
      </AiChatPrompt>
    </AiChat>
  )
}
