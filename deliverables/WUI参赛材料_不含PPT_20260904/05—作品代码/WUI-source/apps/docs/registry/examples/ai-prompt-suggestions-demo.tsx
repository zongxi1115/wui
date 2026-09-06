"use client"

import * as React from "react"
import { Code2Icon, CompassIcon, FileTextIcon } from "lucide-react"
import { Badge } from "@/registry/ui/badge"
import {
  AiPromptSuggestionItem,
  AiPromptSuggestions,
} from "@/registry/ui/ai-prompt-suggestions"

export default function AiPromptSuggestionsDemo() {
  const [selectedPrompt, setSelectedPrompt] = React.useState<string>("")

  return (
    <div className="flex w-full max-w-2xl flex-col gap-5">
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">卡片网格布局 (Grid)</div>
        <AiPromptSuggestions layout="grid">
          <AiPromptSuggestionItem
            icon={<Code2Icon className="size-3.5" />}
            title="生成 React Hook"
            description="编写一个具有防抖和取消功能的 useDebouncedCallback"
            badge={<Badge variant="secondary" className="text-[10px] py-0">代码</Badge>}
            onSelectPrompt={setSelectedPrompt}
          />
          <AiPromptSuggestionItem
            icon={<FileTextIcon className="size-3.5" />}
            title="总结技术架构"
            description="分析当前项目的技术选型与 Tailwind CSS v4 迁移策略"
            badge={<Badge variant="outline" className="text-[10px] py-0">分析</Badge>}
            onSelectPrompt={setSelectedPrompt}
          />
          <AiPromptSuggestionItem
            icon={<CompassIcon className="size-3.5" />}
            title="探索交互方案"
            description="设计适用于移动端和键盘快捷键的多层级下拉菜单"
            onSelectPrompt={setSelectedPrompt}
          />
        </AiPromptSuggestions>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">胶囊药丸布局 (Chips)</div>
        <AiPromptSuggestions layout="chips">
          <AiPromptSuggestionItem
            variant="chip"
            title="解释 TypeScript 协变与逆变"
            onSelectPrompt={setSelectedPrompt}
          />
          <AiPromptSuggestionItem
            variant="chip"
            title="优化 CSS 动画重绘性能"
            onSelectPrompt={setSelectedPrompt}
          />
          <AiPromptSuggestionItem
            variant="chip"
            title="编写 Playwright E2E 脚本"
            onSelectPrompt={setSelectedPrompt}
          />
        </AiPromptSuggestions>
      </div>

      {selectedPrompt && (
        <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
          已选择 Prompt：<span className="font-medium text-foreground">{selectedPrompt}</span>
        </div>
      )}
    </div>
  )
}
