"use client"

import * as React from "react"
import { DatabaseIcon, FileCodeIcon, GlobeIcon, LayersIcon, ShieldCheckIcon } from "lucide-react"

import {
  AiPromptSuggestionItem,
  AiPromptSuggestions,
} from "@/registry/ui/ai-prompt-suggestions"

export default function AiPromptSuggestionsScroll() {
  const [activePrompt, setActivePrompt] = React.useState<string | null>(null)

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          横向滚动推荐 (Scroll Layout)
        </span>
        <span className="text-[11px] text-muted-foreground">支持移动端手势与滚轮滑动</span>
      </div>

      <AiPromptSuggestions layout="scroll">
        <div className="w-64 shrink-0">
          <AiPromptSuggestionItem
            icon={<FileCodeIcon className="size-3.5" />}
            title="生成 React Hook"
            description="构建带防抖与取消功能的 useDebouncedEffect"
            onSelectPrompt={setActivePrompt}
          />
        </div>
        <div className="w-64 shrink-0">
          <AiPromptSuggestionItem
            icon={<DatabaseIcon className="size-3.5" />}
            title="优化 SQL 查询"
            description="针对千万级订单表建立联合索引与分页改写"
            onSelectPrompt={setActivePrompt}
          />
        </div>
        <div className="w-64 shrink-0">
          <AiPromptSuggestionItem
            icon={<ShieldCheckIcon className="size-3.5" />}
            title="安全合规审查"
            description="检查接口参数是否符合 GDPR 与网络安全法要求"
            onSelectPrompt={setActivePrompt}
          />
        </div>
        <div className="w-64 shrink-0">
          <AiPromptSuggestionItem
            icon={<GlobeIcon className="size-3.5" />}
            title="SEO 结构化数据"
            description="生成符合 Schema.org 的 JSON-LD 元数据标记"
            onSelectPrompt={setActivePrompt}
          />
        </div>
        <div className="w-64 shrink-0">
          <AiPromptSuggestionItem
            icon={<LayersIcon className="size-3.5" />}
            title="微前端架构方案"
            description="对比 Module Federation 与 iframe 沙箱隔离方案"
            onSelectPrompt={setActivePrompt}
          />
        </div>
      </AiPromptSuggestions>

      {activePrompt && (
        <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground animate-in fade-in">
          已点击执行：<strong className="text-foreground">{activePrompt}</strong>
        </div>
      )}
    </div>
  )
}
