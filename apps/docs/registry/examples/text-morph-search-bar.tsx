"use client"

import * as React from "react"
import { ArrowUpIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextMorph } from "@/registry/ui/text-morph"

const suggestions = [
  "让 AI 帮你总结这份文档",
  "让 AI 帮你写一封周报",
  "让 AI 帮你分析错误日志",
  "让 AI 帮你润色这段文案",
]

export default function TextMorphSearchBar() {
  const [index, setIndex] = React.useState(0)
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    if (value) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % suggestions.length)
    }, 2600)
    return () => window.clearInterval(timer)
  }, [value])

  return (
    <div className="focus-within:border-ring focus-within:ring-ring/50 flex w-full max-w-md items-center gap-2 rounded-lg border bg-background py-1.5 pl-3 pr-1.5 transition-[border-color,box-shadow] focus-within:ring-[3px]">
      <SparklesIcon className="text-muted-foreground size-4 shrink-0" />
      <div className="relative min-w-0 flex-1">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="向 AI 提问"
          className="w-full bg-transparent py-1 text-sm outline-none"
        />
        {!value ? (
          <TextMorph
            as="span"
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm"
          >
            {suggestions[index]}
          </TextMorph>
        ) : null}
      </div>
      <Button size="icon" className="size-7" aria-label="发送" disabled={!value}>
        <ArrowUpIcon className="size-3.5" />
      </Button>
    </div>
  )
}
