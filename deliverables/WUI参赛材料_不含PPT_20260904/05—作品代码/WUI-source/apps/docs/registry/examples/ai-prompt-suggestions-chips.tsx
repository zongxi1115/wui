"use client"

import * as React from "react"
import { SendIcon, Wand2Icon } from "lucide-react"

import {
  AiPromptSuggestionItem,
  AiPromptSuggestions,
} from "@/registry/ui/ai-prompt-suggestions"

export default function AiPromptSuggestionsChips() {
  const [inputValue, setInputValue] = React.useState("")

  const suggestions = [
    { title: "提炼核心要点", prompt: "请将上文内容整理为 3 条结构清晰的核心要点" },
    { title: "改写为专业公文风", prompt: "请将这段草稿重写为规范严谨的商业邮件风格" },
    { title: "翻译为地道英文", prompt: "请将以上内容翻译为符合母语习惯的英语商务表达" },
    { title: "代码安全性审查", prompt: "请全面审查这段代码中是否存在 SQL 注入或 XSS 风险" },
  ]

  return (
    <div className="w-full max-w-xl space-y-3 rounded-xl border bg-card p-4 shadow-xs">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
        <Wand2Icon className="size-3.5" />
        <span>快捷追问与指令建议</span>
      </div>

      {/* 胶囊标签组 */}
      <AiPromptSuggestions layout="chips">
        {suggestions.map((item) => (
          <AiPromptSuggestionItem
            key={item.title}
            variant="chip"
            title={item.title}
            promptText={item.prompt}
            onSelectPrompt={(p) => setInputValue(p)}
          />
        ))}
      </AiPromptSuggestions>

      {/* 模拟输入框 */}
      <div className="relative mt-2 flex items-center rounded-lg border bg-background px-3 py-2 shadow-inner">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入问题或点击上方胶囊标签..."
          className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="button"
          disabled={!inputValue.trim()}
          className="ml-2 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
          onClick={() => {
            alert(`发送提问: ${inputValue}`)
            setInputValue("")
          }}
        >
          <SendIcon className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
