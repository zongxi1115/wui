"use client"

import * as React from "react"
import {
  DatabaseIcon,
  FileCodeIcon,
  GlobeIcon,
  LayersIcon,
  ShieldCheckIcon,
} from "lucide-react"

import {
  AiPromptSuggestionItem,
  AiPromptSuggestions,
} from "@/registry/ui/ai-prompt-suggestions"

const SCENARIOS = [
  {
    icon: <FileCodeIcon />,
    title: "写一个 React Hook",
    description: "带防抖和取消能力的 useDebouncedCallback",
  },
  {
    icon: <DatabaseIcon />,
    title: "优化分页查询",
    description: "千万级订单表的深分页改写与索引建议",
  },
  {
    icon: <ShieldCheckIcon />,
    title: "接口安全审查",
    description: "检查参数校验、越权访问与敏感字段返回",
  },
  {
    icon: <GlobeIcon />,
    title: "生成结构化数据",
    description: "为商品详情页输出 Schema.org JSON-LD",
  },
  {
    icon: <LayersIcon />,
    title: "微前端选型",
    description: "对比 Module Federation 与 iframe 隔离方案",
  },
]

export default function AiPromptSuggestionsScroll() {
  const [selected, setSelected] = React.useState<string | null>(null)

  return (
    <div className="w-full max-w-2xl min-w-0 space-y-3">
      <AiPromptSuggestions layout="scroll">
        {SCENARIOS.map((item) => (
          <AiPromptSuggestionItem
            key={item.title}
            className="w-60"
            icon={item.icon}
            title={item.title}
            description={item.description}
            promptText={`${item.title}：${item.description}`}
            onSelectPrompt={setSelected}
          />
        ))}
      </AiPromptSuggestions>

      <p className="text-xs text-muted-foreground">
        {selected ? (
          <>
            将发送：<span className="text-foreground">{selected}</span>
          </>
        ) : (
          "左右滑动查看更多场景"
        )}
      </p>
    </div>
  )
}
