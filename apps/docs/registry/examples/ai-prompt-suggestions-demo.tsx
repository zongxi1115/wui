"use client"

import * as React from "react"
import { CodeIcon, CompassIcon, FileTextIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import {
  AiPromptSuggestionItem,
  AiPromptSuggestions,
} from "@/registry/ui/ai-prompt-suggestions"

export default function AiPromptSuggestionsDemo() {
  const [selected, setSelected] = React.useState("")

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <AiPromptSuggestions layout="grid">
        <AiPromptSuggestionItem
          icon={<CodeIcon />}
          title="写一个 React Hook"
          description="带防抖与取消能力的 useDebouncedCallback，附使用示例"
          badge={
            <Badge variant="secondary" size="sm">
              代码
            </Badge>
          }
          onSelectPrompt={setSelected}
        />
        <AiPromptSuggestionItem
          icon={<FileTextIcon />}
          title="总结项目架构"
          description="梳理当前仓库的技术选型、目录约定与迁移风险"
          badge={
            <Badge variant="outline" size="sm">
              分析
            </Badge>
          }
          onSelectPrompt={setSelected}
        />
        <AiPromptSuggestionItem
          icon={<CompassIcon />}
          title="设计交互方案"
          description="多层级菜单在触屏与键盘下的操作方式"
          onSelectPrompt={setSelected}
        />
      </AiPromptSuggestions>

      <AiPromptSuggestions layout="chips">
        <AiPromptSuggestionItem
          variant="chip"
          title="解释 TypeScript 协变与逆变"
          onSelectPrompt={setSelected}
        />
        <AiPromptSuggestionItem
          variant="chip"
          title="减少 CSS 动画的重绘"
          onSelectPrompt={setSelected}
        />
        <AiPromptSuggestionItem
          variant="chip"
          title="写一段 Playwright 登录用例"
          onSelectPrompt={setSelected}
        />
      </AiPromptSuggestions>

      <p className="min-h-5 text-xs text-muted-foreground">
        {selected ? (
          <>
            已选择：<span className="text-foreground">{selected}</span>
          </>
        ) : (
          "点击任一建议填入输入框"
        )}
      </p>
    </div>
  )
}
