"use client"

import * as React from "react"
import { Check, Loader2, Sparkles } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { TextMorph } from "@/registry/ui/text-morph"

type State = "idle" | "loading" | "success"

export default function TextMorphDemo() {
  const [state, setState] = React.useState<State>("idle")

  const handleClick = () => {
    if (state !== "idle") return
    setState("loading")
    setTimeout(() => {
      setState("success")
      setTimeout(() => setState("idle"), 2000)
    }, 1200)
  }

  const labelMap = {
    idle: "Generate UI",
    loading: "Generating...",
    success: "Generated!",
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-5 rounded-xl border border-border bg-card p-8 text-center shadow-xs">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-foreground">状态形变按钮</h4>
        <p className="text-xs text-muted-foreground">
          点击按钮观察相同字符在不同状态词汇间的丝滑位移与形变。
        </p>
      </div>

      <Button
        type="button"
        size="default"
        disabled={state === "loading"}
        onClick={handleClick}
        className={`min-w-36 transition-all duration-300 ${
          state === "success"
            ? "bg-emerald-600 hover:bg-emerald-600 text-white"
            : ""
        }`}
      >
        {state === "idle" && <Sparkles className="size-3.5 mr-1.5" />}
        {state === "loading" && (
          <Loader2 className="size-3.5 mr-1.5 animate-spin" />
        )}
        {state === "success" && <Check className="size-3.5 mr-1.5" />}
        <TextMorph as="span">{labelMap[state]}</TextMorph>
      </Button>
    </div>
  )
}
