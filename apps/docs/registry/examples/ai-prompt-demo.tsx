"use client"

import * as React from "react"

import {
  AiModelSelector,
  AiModelSelectorContent,
  AiModelSelectorItem,
  AiModelSelectorTrigger,
  AiPrompt,
  AiPromptAttachmentButton,
  AiPromptContent,
  AiPromptFooter,
  AiPromptSubmit,
  AiPromptTextarea,
  AiPromptTools,
  type AiModelProvider,
} from "@/registry/ui/ai-prompt"

const models: Array<{
  value: string
  provider: AiModelProvider
  label: string
}> = [
  {
    value: "gpt-5.4",
    provider: "openai",
    label: "GPT-5.4",
  },
  {
    value: "claude-opus-4.8",
    provider: "anthropic",
    label: "Claude Opus 4.8",
  },
  {
    value: "grok-4.20",
    provider: "xai",
    label: "Grok 4.20",
  },
]

export default function AiPromptDemo() {
  const [value, setValue] = React.useState("")
  const [model, setModel] = React.useState("gpt-5.4")
  const selectedModel =
    models.find((item) => item.value === model) ?? models[0]

  return (
    <AiPrompt
      className="mx-auto max-w-4xl"
      onSubmit={(event) => {
        event.preventDefault()
        if (!value.trim()) return
        setValue("")
      }}
    >
      <AiPromptFooter>
        <AiPromptTools>
          <AiPromptAttachmentButton aria-label="添加附件" />
        </AiPromptTools>
        <AiPromptContent className="min-w-0 flex-1">
          <AiPromptTextarea
            value={value}
            placeholder="描述你想完成的任务…"
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
        <div className="flex items-center gap-1.5">
          <AiModelSelector value={model} onValueChange={setModel}>
            <AiModelSelectorTrigger
              aria-label="选择模型"
              provider={selectedModel.provider}
              model={selectedModel.label}
            />
            <AiModelSelectorContent>
              {models.map((item) => (
                <AiModelSelectorItem
                  key={item.value}
                  value={item.value}
                  provider={item.provider}
                >
                  {item.label}
                </AiModelSelectorItem>
              ))}
            </AiModelSelectorContent>
          </AiModelSelector>
          <AiPromptSubmit disabled={!value.trim()} />
        </div>
      </AiPromptFooter>
    </AiPrompt>
  )
}
