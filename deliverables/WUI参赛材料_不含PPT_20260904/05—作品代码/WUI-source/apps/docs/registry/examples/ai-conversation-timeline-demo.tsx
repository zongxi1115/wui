"use client"

import * as React from "react"

import {
  AiChat,
  AiChatAvatar,
  AiChatMessage,
  AiChatMessageContent,
  AiChatMessages,
} from "@/registry/ui/ai-chat"
import {
  AiConversationTimeline,
  type AiConversationTimelineItem,
} from "@/registry/ui/ai-conversation-timeline"

const turns: AiConversationTimelineItem[] = [
  {
    id: "request",
    title: "添加一个 AI 组件板块",
    description: "先从聊天框、工具调用、任务和推理过程开始。",
    meta: "09:41",
  },
  {
    id: "scope",
    title: "确认第一批组件范围",
    description: "聊天壳层、消息气泡、输入区先落地，其余按需补。",
    meta: "09:43",
    level: 2,
  },
  {
    id: "reasoning",
    title: "调整推理过程的流式动效",
    description: "只在文本右边缘保留自然羽化，收起时不要整体缩放。",
    meta: "09:46",
  },
  {
    id: "tokens",
    title: "推理块改用语义 token",
    description: "去掉硬编码灰阶，跟随主题变量走明暗两套。",
    meta: "09:48",
    level: 3,
  },
  {
    id: "todo",
    title: "任务列表支持嵌套子项",
    description: "父任务收起时显示进度摘要，展开后逐条对齐。",
    meta: "09:50",
    level: 2,
  },
  {
    id: "docs",
    title: "补上每页的 LLM 文档入口",
    description: "增加复制 Markdown、查看原文和在 ChatGPT 中打开。",
    meta: "09:52",
  },
  {
    id: "digest",
    title: "把文档正文汇总进 MCP digest",
    description: "组件作用、事件、拓展使用三节直接喂给模型。",
    meta: "09:55",
    level: 3,
  },
  {
    id: "timeline",
    title: "为长对话增加时间线导航",
    description: "用短刻度压缩全部轮次，悬停预览，点击快速定位。",
    meta: "09:58",
    level: 2,
  },
  {
    id: "polish",
    title: "刻度改成聚拢 + 邻近放大",
    description: "静止时是一组等距灰刻度，指针靠近才逐级变长。",
    meta: "现在",
  },
]

const responses: Record<string, string> = {
  request:
    "组件会保持可组合：聊天负责消息与输入，工具、任务和推理作为独立内容插入助手回复。",
  scope: "先交付聊天壳层与消息内容，工具调用和任务列表复用同一套间距与圆角。",
  reasoning:
    "累计文本仅对最右侧做羽化；分段 delta 单独淡入，收起使用轻微位移和透明度过渡。",
  tokens: "全部替换为 muted / foreground 语义变量，深色主题不再出现死黑背景。",
  todo: "子任务以缩进对齐，父任务在收起态显示「已完成 / 总数」，展开走高度过渡。",
  docs:
    "每个组件文档页现在都能复制原始 Markdown，也可以直接交给支持链接上下文的模型阅读。",
  digest: "构建时抽取三节正文与全部 demo 源码，模型据此判断该用哪个组件。",
  timeline:
    "时间线会跟随当前阅读轮次高亮，悬停显示摘要，点击后平滑滚动到对应消息。",
  polish:
    "刻度静止时聚拢成一列等距灰线；指针靠近时以高斯衰减放大自身与相邻刻度。",
}

export default function AiConversationTimelineDemo() {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const messageRefs = React.useRef<Record<string, HTMLElement | null>>({})
  const [activeId, setActiveId] = React.useState(turns[0].id)

  function updateActiveItem() {
    const viewport = viewportRef.current
    if (!viewport) return

    const viewportTop = viewport.getBoundingClientRect().top
    let closest = turns[0].id
    let closestDistance = Number.POSITIVE_INFINITY

    for (const turn of turns) {
      const element = messageRefs.current[turn.id]
      if (!element) continue
      const distance = Math.abs(element.getBoundingClientRect().top - viewportTop - 24)
      if (distance < closestDistance) {
        closest = turn.id
        closestDistance = distance
      }
    }

    setActiveId(closest)
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <AiChat className="h-[520px]">
        <AiChatMessages ref={viewportRef} className="pl-20" onScroll={updateActiveItem}>
          {turns.map((turn) => (
            <div
              key={turn.id}
              ref={(element) => {
                messageRefs.current[turn.id] = element
              }}
              className="space-y-4 py-3 first:pt-0"
            >
              <AiChatMessage role="user">
                <AiChatMessageContent role="user">
                  {turn.title}
                </AiChatMessageContent>
              </AiChatMessage>
              <AiChatMessage role="assistant">
                <AiChatAvatar />
                <AiChatMessageContent>
                  {responses[turn.id]}
                </AiChatMessageContent>
              </AiChatMessage>
            </div>
          ))}
        </AiChatMessages>
      </AiChat>

      <AiConversationTimeline
        items={turns}
        activeId={activeId}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2"
        onActiveChange={setActiveId}
        onNavigate={(item) => {
          messageRefs.current[item.id]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }}
      />
    </div>
  )
}
