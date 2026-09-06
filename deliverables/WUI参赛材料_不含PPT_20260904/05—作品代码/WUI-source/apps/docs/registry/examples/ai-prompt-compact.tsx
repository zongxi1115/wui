"use client"

import * as React from "react"
import { SparklesIcon, PaperclipIcon } from "lucide-react"

import {
  AiPrompt,
  AiPromptContent,
  AiPromptFooter,
  AiPromptSubmit,
  AiPromptTextarea,
  AiPromptTools,
} from "@/registry/ui/ai-prompt"
import { Button } from "@/registry/ui/button"

export default function AiPromptCompact() {
  const [value, setValue] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "streaming">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || status === "streaming") return

    setStatus("streaming")
    setTimeout(() => {
      setStatus("idle")
      setValue("")
    }, 2500)
  }

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <AiPrompt
        size="compact"
        className="rounded-full border border-border/80 bg-background/95 shadow-sm transition-all focus-within:shadow-md focus-within:border-ring"
        onSubmit={handleSubmit}
      >
        <AiPromptFooter className="min-h-10 items-center px-2 py-1 gap-1">
          <AiPromptTools>
            <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <SparklesIcon className="size-3.5" />
            </div>
          </AiPromptTools>

          <AiPromptContent className="min-w-0 flex-1">
            <AiPromptTextarea
              value={value}
              placeholder="向 AI Copilot 提问或快速执行指令…"
              className="py-1 text-xs"
              maxHeight={80}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  e.currentTarget.form?.requestSubmit()
                }
              }}
            />
          </AiPromptContent>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="上传附件"
            >
              <PaperclipIcon className="size-3.5" />
            </Button>
            <AiPromptSubmit
              status={status}
              disabled={!value.trim() && status === "idle"}
              className="size-7 rounded-full text-xs"
            />
          </div>
        </AiPromptFooter>
      </AiPrompt>
    </div>
  )
}
