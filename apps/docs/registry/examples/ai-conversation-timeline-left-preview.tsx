"use client"

import * as React from "react"

import {
  AiConversationTimeline,
  type AiConversationTimelineItem,
} from "@/registry/ui/ai-conversation-timeline"

const TURNS: AiConversationTimelineItem[] = [
  {
    id: "scaffold",
    title: "初始化项目脚手架",
    description: "确认 pnpm 工作区与 Node 版本，生成基础配置。",
    meta: "10:02",
  },
  {
    id: "deps",
    title: "安装 UI 与动效依赖",
    description: "tailwindcss、motion、radix-ui 与图标库。",
    meta: "10:04",
    level: 2,
  },
  {
    id: "schema",
    title: "设计会话数据模型",
    description: "User、Conversation、Message 三张表及索引。",
    meta: "10:09",
    level: 2,
  },
  {
    id: "api",
    title: "实现流式对话接口",
    description: "以 SSE 返回增量，前端用 useAiStream 消费。",
    meta: "10:17",
  },
  {
    id: "typecheck",
    title: "修复类型错误",
    description: "补齐消息分片的联合类型，严格模式零报错。",
    meta: "10:21",
    level: 3,
  },
  {
    id: "preview",
    title: "部署预览环境",
    description: "生成预览链接，健康检查通过。",
    meta: "10:26",
  },
]

export default function AiConversationTimelineLeftPreview() {
  const [activeId, setActiveId] = React.useState("schema")
  const active = TURNS.find((turn) => turn.id === activeId) ?? TURNS[0]
  const index = TURNS.indexOf(active)

  return (
    <div className="mx-auto flex w-full max-w-xl items-center gap-8">
      <div
        key={active.id}
        className="min-w-0 flex-1 duration-300 animate-in fade-in-0 slide-in-from-bottom-1"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono tabular-nums">
            {String(index + 1).padStart(2, "0")} / {TURNS.length}
          </span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">{active.meta}</span>
        </div>
        <h4 className="mt-1.5 text-base font-medium text-foreground">
          {active.title}
        </h4>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {active.description}
        </p>
      </div>

      <AiConversationTimeline
        items={TURNS}
        activeId={activeId}
        previewSide="left"
        onActiveChange={setActiveId}
      />
    </div>
  )
}
