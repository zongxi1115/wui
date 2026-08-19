"use client"

import * as React from "react"
import { CodeIcon, TerminalIcon, CheckCircle2Icon } from "lucide-react"

import {
  AiConversationTimeline,
  type AiConversationTimelineItem,
} from "@/registry/ui/ai-conversation-timeline"

const codeSteps: AiConversationTimelineItem[] = [
  {
    id: "init",
    title: "初始化项目脚手架",
    description: "检测 Node.js 环境与 pnpm 工作区配置，生成基础配置文件。",
    meta: "Step 1",
    level: 1,
  },
  {
    id: "install-deps",
    title: "安装核心依赖包",
    description: "安装 tailwindcss, motion, lucide-react 与 radix-ui 原语。",
    meta: "Step 2",
    level: 2,
  },
  {
    id: "generate-schema",
    title: "生成 Prisma 数据模型",
    description: "解析 User, Session 与 Conversation 关系模型并同步至 SQLite。",
    meta: "Step 3",
    level: 2,
  },
  {
    id: "build-api",
    title: "构建流式推理 API 路由",
    description: "集成 OpenAI SDK 与 Server-Sent Events 流式响应管道。",
    meta: "Step 4",
    level: 1,
  },
  {
    id: "type-check",
    title: "执行 TypeScript 严格校验",
    description: "无任何类型报错，所有接口均已满足严格推导。",
    meta: "Step 5",
    level: 3,
  },
  {
    id: "deploy-preview",
    title: "部署临时预览环境",
    description: "生成无服务器边缘预览链接并等待健康检查就绪。",
    meta: "Step 6",
    level: 1,
  },
]

export default function AiConversationTimelineLeftPreview() {
  const [activeId, setActiveId] = React.useState("generate-schema")
  const activeStep = codeSteps.find((s) => s.id === activeId) ?? codeSteps[0]

  return (
    <div className="flex w-full max-w-2xl items-center justify-between gap-6 rounded-xl border bg-card p-6 shadow-xs">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <TerminalIcon className="size-4 text-primary" />
          <span>AI 自动化构建流水线</span>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium text-primary">
              {activeStep.meta}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
              <CheckCircle2Icon className="size-3.5" /> 已完成
            </span>
          </div>
          <h4 className="mt-1 text-base font-semibold text-foreground">
            {activeStep.title}
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {activeStep.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CodeIcon className="size-3.5" />
          <span>右侧悬停或点击时间线刻度可向左展开详细信息</span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <AiConversationTimeline
          items={codeSteps}
          activeId={activeId}
          previewSide="left"
          onActiveChange={setActiveId}
        />
      </div>
    </div>
  )
}
