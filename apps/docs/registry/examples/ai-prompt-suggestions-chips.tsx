"use client"

import * as React from "react"

import {
  AiPrompt,
  AiPromptContent,
  AiPromptFooter,
  AiPromptSubmit,
  AiPromptTextarea,
} from "@/registry/ui/ai-prompt"
import {
  AiPromptSuggestionItem,
  AiPromptSuggestions,
} from "@/registry/ui/ai-prompt-suggestions"

const FOLLOW_UPS = [
  { title: "提炼 3 条要点", prompt: "把上面的回答整理成 3 条要点，每条不超过 20 字。" },
  { title: "改成邮件语气", prompt: "把这段内容改写成发给客户的正式邮件。" },
  { title: "翻译成英文", prompt: "把回答翻译成自然的英文商务表达。" },
  { title: "列出风险点", prompt: "这个方案上线前还有哪些风险需要确认？" },
]

export default function AiPromptSuggestionsChips() {
  const [value, setValue] = React.useState("")
  const [sent, setSent] = React.useState<string[]>([])

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {sent.length ? (
        <div className="flex flex-col items-end gap-2">
          {sent.map((message, index) => (
            <div
              key={index}
              className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-primary-foreground duration-300 animate-in fade-in-0 slide-in-from-right-2"
            >
              {message}
            </div>
          ))}
        </div>
      ) : null}

      <AiPromptSuggestions layout="chips">
        {FOLLOW_UPS.map((item) => (
          <AiPromptSuggestionItem
            key={item.title}
            variant="chip"
            title={item.title}
            promptText={item.prompt}
            onSelectPrompt={setValue}
          />
        ))}
      </AiPromptSuggestions>

      <AiPrompt
        onSubmit={(event) => {
          event.preventDefault()
          if (!value.trim()) return
          setSent((current) => [...current, value.trim()])
          setValue("")
        }}
      >
        <AiPromptFooter>
          <AiPromptContent className="min-w-0 flex-1">
            <AiPromptTextarea
              value={value}
              placeholder="继续追问，或选择上方的建议…"
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
          <AiPromptSubmit disabled={!value.trim()} />
        </AiPromptFooter>
      </AiPrompt>
    </div>
  )
}
