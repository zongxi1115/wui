"use client"

import * as React from "react"
import { ArrowUp, Bot, Sparkles } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextMorph } from "@/registry/ui/text-morph"

const suggestions = [
  "Ask AI to summarize documents...",
  "Ask AI to generate React code...",
  "Ask AI to refactor performance...",
  "Ask AI to analyze error logs...",
]

export default function TextMorphSearchBar() {
  const [index, setIndex] = React.useState(0)
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % suggestions.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Bot className="size-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-foreground">AI 智能输入提示</h4>
          <p className="text-[11px] text-muted-foreground">
            占位提示文字在不同意图之间平滑形变过渡
          </p>
        </div>
      </div>

      <div className="relative flex items-center rounded-xl border border-border bg-background px-3 py-2 shadow-inner focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
        <Sparkles className="size-4 shrink-0 text-muted-foreground mr-2.5" />

        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-transparent text-xs text-foreground outline-none"
          />

          {!value && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              <TextMorph
                as="span"
                className="text-xs text-muted-foreground/60 select-none"
              >
                {suggestions[index]}
              </TextMorph>
            </div>
          )}
        </div>

        <Button
          type="button"
          size="icon"
          className="shrink-0 size-7 rounded-lg"
          aria-label="发送提问"
        >
          <ArrowUp className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
