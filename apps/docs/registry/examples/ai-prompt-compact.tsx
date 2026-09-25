"use client"

import * as React from "react"
import { PaperclipIcon } from "lucide-react"

import {
  AiPrompt,
  AiPromptContent,
  AiPromptFooter,
  AiPromptSubmit,
  AiPromptTextarea,
  AiPromptTools,
  type AiPromptStatus,
} from "@/registry/ui/ai-prompt"
import { Button } from "@/registry/ui/button"

export default function AiPromptCompact() {
  const [value, setValue] = React.useState("")
  const [status, setStatus] = React.useState<AiPromptStatus>("idle")

  // submitted → streaming → idle, so the submit button morphs through
  // loading and stop before returning to send.
  React.useEffect(() => {
    if (status === "idle") return
    const timer = window.setTimeout(
      () => setStatus(status === "submitted" ? "streaming" : "idle"),
      status === "submitted" ? 900 : 2400
    )
    return () => window.clearTimeout(timer)
  }, [status])

  const busy = status !== "idle"

  return (
    <AiPrompt
      size="compact"
      className="mx-auto max-w-xl"
      onSubmit={(event) => {
        event.preventDefault()
        if (!value.trim() || busy) return
        setValue("")
        setStatus("submitted")
      }}
    >
      <AiPromptFooter className="min-h-11 items-center gap-1 px-1.5 py-1">
        <AiPromptTools>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground"
            aria-label="添加附件"
          >
            <PaperclipIcon />
          </Button>
        </AiPromptTools>

        <AiPromptContent className="min-w-0 flex-1">
          <AiPromptTextarea
            value={value}
            placeholder={busy ? "正在生成，可随时停止…" : "问点什么，Enter 发送"}
            className="py-1.5 text-sm"
            maxHeight={96}
            onChange={(event) => setValue(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
          />
        </AiPromptContent>

        <AiPromptSubmit
          status={status}
          disabled={!busy && !value.trim()}
          className="size-8"
          onClick={() => {
            if (busy) setStatus("idle")
          }}
        />
      </AiPromptFooter>
    </AiPrompt>
  )
}
