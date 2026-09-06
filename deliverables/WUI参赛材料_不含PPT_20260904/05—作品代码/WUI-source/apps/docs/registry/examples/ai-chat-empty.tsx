"use client"

import * as React from "react"
import {
  Code2Icon,
  FileSearchIcon,
  SparklesIcon,
  Wand2Icon,
} from "lucide-react"

import {
  AiChat,
  AiChatEmptyState,
  AiChatMessages,
  AiChatPrompt,
  AiChatPromptFooter,
  AiChatPromptTools,
  AiChatSubmit,
  AiChatTextarea,
} from "@/registry/ui/ai-chat"
import { Badge } from "@/registry/ui/badge"

const SUGGESTIONS = [
  {
    icon: <Code2Icon className="size-4 text-blue-500" />,
    title: "重构 React 状态流",
    prompt: "帮我将基于 Context 的复杂状态重构为 Zustand 架构，并提供持久化方案。",
  },
  {
    icon: <FileSearchIcon className="size-4 text-emerald-500" />,
    title: "SQL 查询慢日志分析",
    prompt: "分析包含三表 JOIN 与 ORDER BY 的慢查询，给出索引优化建议。",
  },
  {
    icon: <Wand2Icon className="size-4 text-purple-500" />,
    title: "Tailwind 主题规范设计",
    prompt: "为企业级后台系统配置一套高对比度、支持 OKLCH 色彩空间的暗色主题。",
  },
]

export default function AiChatEmpty() {
  const [prompt, setPrompt] = React.useState("")

  return (
    <AiChat className="mx-auto h-[540px] max-w-2xl shadow-xs">
      <AiChatMessages>
        <AiChatEmptyState className="py-8">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <SparklesIcon className="size-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            WUI AI 智能工作助理
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            内置代码重构、架构设计与自动化调试能力，直接输入问题或选择下方模版开始：
          </p>

          <div className="mt-6 grid w-full grid-cols-1 gap-2 sm:grid-cols-3 text-left">
            {SUGGESTIONS.map((item, index) => (
              <button
                key={index}
                type="button"
                className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-3 text-left transition-colors hover:border-border hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 cursor-pointer"
                onClick={() => setPrompt(item.prompt)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-muted">
                    {item.icon}
                  </span>
                </div>
                <div className="text-xs font-semibold text-foreground group-hover:text-primary">
                  {item.title}
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                  {item.prompt}
                </p>
              </button>
            ))}
          </div>
        </AiChatEmptyState>
      </AiChatMessages>

      <AiChatPrompt
        onSubmit={(e) => {
          e.preventDefault()
          if (!prompt.trim()) return
        }}
      >
        <AiChatPromptFooter>
          <AiChatPromptTools>
            <Badge variant="outline" className="text-[11px] font-normal">
              DeepSeek R1
            </Badge>
          </AiChatPromptTools>
          <AiChatTextarea
            value={prompt}
            placeholder="输入您的问题或指令（Shift + Enter 换行）…"
            onChange={(e) => setPrompt(e.target.value)}
          />
          <AiChatSubmit disabled={!prompt.trim()} />
        </AiChatPromptFooter>
      </AiChatPrompt>
    </AiChat>
  )
}
