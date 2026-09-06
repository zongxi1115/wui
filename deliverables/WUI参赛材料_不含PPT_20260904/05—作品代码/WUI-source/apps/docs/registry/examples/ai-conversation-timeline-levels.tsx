"use client"

import * as React from "react"
import { BotIcon, SparklesIcon } from "lucide-react"

import {
  AiConversationTimeline,
  type AiConversationTimelineItem,
} from "@/registry/ui/ai-conversation-timeline"

const agentTraceItems: AiConversationTimelineItem[] = [
  {
    id: "user-intent",
    title: "用户意图分析",
    description: "提取「检索近七天销售报表并生成环比分析」核心意图与参数实体。",
    meta: "14:20:01",
    level: 1,
  },
  {
    id: "tool-db",
    title: "调用 SQL 生成工具",
    description: "生成针对 orders 表的聚合查询语句，添加租户 ID 过滤限制。",
    meta: "14:20:03",
    level: 2,
  },
  {
    id: "tool-exec",
    title: "执行只读数据库查询",
    description: "返回 1,420 条交易记录，耗时 128ms。",
    meta: "14:20:04",
    level: 3,
  },
  {
    id: "data-clean",
    title: "数据清洗与异常剔除",
    description: "过滤测试订单与未支付单据，校准退款抵扣额。",
    meta: "14:20:06",
    level: 3,
  },
  {
    id: "reasoning-step",
    title: "多维特征交叉推演",
    description: "对比上周同期 GMV，发现华东区客单价提升 18.4%。",
    meta: "14:20:09",
    level: 2,
  },
  {
    id: "chart-gen",
    title: "生成可视化图表配置",
    description: "输出双轴折线柱状图 Schema 与配色映射规范。",
    meta: "14:20:12",
    level: 2,
  },
  {
    id: "final-answer",
    title: "整合最终分析报告",
    description: "输出 Markdown 格式的完整分析洞察与业务改进策略建议。",
    meta: "14:20:15",
    level: 1,
  },
]

export default function AiConversationTimelineLevels() {
  const [activeId, setActiveId] = React.useState("reasoning-step")
  const currentItem = agentTraceItems.find((i) => i.id === activeId) ?? agentTraceItems[0]

  return (
    <div className="flex w-full max-w-2xl items-center justify-between gap-6 rounded-xl border bg-card p-6 shadow-xs">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <BotIcon className="size-4" />
          <span>Agent 执行调用链路 (Trace)</span>
        </div>

        <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary">
              层级 Level {currentItem.level ?? 1}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {currentItem.meta}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            {currentItem.title}
          </h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {currentItem.description}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SparklesIcon className="size-3.5 text-amber-500" />
          <span>Level 1 为主任务，Level 2 为子调用，Level 3 为细粒度执行</span>
        </div>
      </div>

      <div className="flex items-center">
        <AiConversationTimeline
          items={agentTraceItems}
          activeId={activeId}
          onActiveChange={setActiveId}
        />
      </div>
    </div>
  )
}
