"use client"

import * as React from "react"

import { Badge } from "@/registry/ui/badge"
import {
  AiConversationTimeline,
  type AiConversationTimelineItem,
} from "@/registry/ui/ai-conversation-timeline"

const TRACE: AiConversationTimelineItem[] = [
  {
    id: "intent",
    title: "识别用户意图",
    description: "「对比近七天销售额并解释波动」，提取时间范围与维度。",
    meta: "14:20:01",
    level: 1,
  },
  {
    id: "sql",
    title: "生成聚合 SQL",
    description: "按区域与日期聚合 orders，附加租户隔离条件。",
    meta: "14:20:03",
    level: 2,
  },
  {
    id: "query",
    title: "执行只读查询",
    description: "返回 1,420 行，耗时 128ms。",
    meta: "14:20:04",
    level: 3,
  },
  {
    id: "clean",
    title: "剔除测试与退款订单",
    description: "过滤 37 条测试单，校准退款抵扣。",
    meta: "14:20:06",
    level: 3,
  },
  {
    id: "compare",
    title: "对比上周同期",
    description: "华东区客单价提升 18.4%，是主要增长来源。",
    meta: "14:20:09",
    level: 2,
  },
  {
    id: "chart",
    title: "生成图表配置",
    description: "双轴折线 + 柱状，按区域着色。",
    meta: "14:20:12",
    level: 2,
  },
  {
    id: "answer",
    title: "输出分析结论",
    description: "总结波动原因并给出两条运营建议。",
    meta: "14:20:15",
    level: 1,
  },
]

const LEVEL_LABELS = { 1: "主任务", 2: "子调用", 3: "执行细节" } as const

export default function AiConversationTimelineLevels() {
  const [activeId, setActiveId] = React.useState("compare")
  const active = TRACE.find((item) => item.id === activeId) ?? TRACE[0]

  return (
    <div className="mx-auto flex w-full max-w-xl items-center gap-8">
      <AiConversationTimeline
        items={TRACE}
        activeId={activeId}
        previewSide="right"
        preview={false}
        onActiveChange={setActiveId}
        className="order-last"
      />

      <div
        key={active.id}
        className="min-w-0 flex-1 duration-300 animate-in fade-in-0 slide-in-from-bottom-1"
      >
        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm">
            {LEVEL_LABELS[active.level ?? 1]}
          </Badge>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {active.meta}
          </span>
        </div>
        <h4 className="mt-2 text-base font-medium text-foreground">
          {active.title}
        </h4>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {active.description}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          刻度越短层级越深；点击刻度切换查看的调用。
        </p>
      </div>
    </div>
  )
}
