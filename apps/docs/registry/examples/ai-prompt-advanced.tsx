"use client"

import * as React from "react"
import {
  BrainCircuitIcon,
  WorldIcon,
} from "@/registry/icons/animated"

import {
  AiModelSelector,
  AiModelSelectorContent,
  AiModelSelectorGroup,
  AiModelSelectorItem,
  AiModelSelectorLabel,
  AiModelSelectorSeparator,
  AiModelSelectorTrigger,
  AiPrompt,
  AiPromptAction,
  AiPromptAttachment,
  AiPromptAttachmentButton,
  AiPromptAttachments,
  AiPromptCapabilitySelector,
  AiPromptContent,
  AiPromptFooter,
  AiPromptHeader,
  AiPromptQuote,
  AiPromptSubmit,
  AiPromptTextarea,
  AiPromptTools,
  type AiPromptCapabilitySelectorProps,
  type AiModelProvider,
} from "@/registry/ui/ai-prompt"

type Attachment = {
  id: string
  name: string
  metadata: string
}

const models: Array<{
  value: string
  provider: AiModelProvider
  providerName: string
  label: string
}> = [
  {
    value: "gpt-5.4",
    provider: "openai",
    providerName: "OpenAI",
    label: "GPT-5.4",
  },
  {
    value: "claude-opus-4.8",
    provider: "anthropic",
    providerName: "Anthropic",
    label: "Claude Opus 4.8",
  },
  {
    value: "grok-4.20",
    provider: "xai",
    providerName: "xAI",
    label: "Grok 4.20",
  },
]

const thinkingOptions: AiPromptCapabilitySelectorProps["options"] = [
  {
    value: "fast",
    label: "快速响应",
  },
  {
    value: "thinking",
    label: "深度思考",
    children: [
      { value: "low", label: "低" },
      { value: "medium", label: "中" },
      { value: "high", label: "高" },
      { value: "maximum", label: "最高" },
    ],
  },
]

export default function AiPromptAdvanced() {
  const [value, setValue] = React.useState("")
  const [model, setModel] = React.useState("gpt-5.4")
  const [thinking, setThinking] = React.useState(["thinking", "medium"])
  const [webSearch, setWebSearch] = React.useState(false)
  const [showQuote, setShowQuote] = React.useState(true)
  const [attachments, setAttachments] = React.useState<Attachment[]>([
    { id: "brief", name: "用户研究报告.pdf", metadata: "2.4 MB" },
  ])
  const selectedModel =
    models.find((item) => item.value === model) ?? models[0]

  return (
    <AiPrompt className="mx-auto max-w-4xl">
      {showQuote || attachments.length ? (
        <AiPromptHeader>
          {showQuote ? (
            <AiPromptQuote onRemove={() => setShowQuote(false)}>
              “设计不是产品的外观和感觉，设计是产品如何运作。”
            </AiPromptQuote>
          ) : null}
          {attachments.length ? (
            <AiPromptAttachments
              className={showQuote ? "border-l pl-3" : undefined}
            >
              {attachments.map((attachment) => (
                <AiPromptAttachment
                  key={attachment.id}
                  name={attachment.name}
                  metadata={attachment.metadata}
                  onRemove={() =>
                    setAttachments((current) =>
                      current.filter((item) => item.id !== attachment.id)
                    )
                  }
                />
              ))}
            </AiPromptAttachments>
          ) : null}
        </AiPromptHeader>
      ) : null}

      <AiPromptFooter>
        <AiPromptTools>
          <AiPromptAttachmentButton
            aria-label="添加附件"
            multiple
            onFilesChange={(files) =>
              setAttachments((current) => [
                ...current,
                ...files.map((file) => ({
                  id: `${file.name}-${file.lastModified}`,
                  name: file.name,
                  metadata:
                    file.size > 1024 * 1024
                      ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
                      : `${Math.max(1, Math.round(file.size / 1024))} KB`,
                })),
              ])
            }
          />
          <AiPromptCapabilitySelector
            aria-label="选择思考强度"
            panelLabel="思考模式与强度"
            options={thinkingOptions}
            value={thinking}
            onValueChange={setThinking}
            placeholder="思考模式"
            icon={<BrainCircuitIcon size={18} />}
          />
          <AiPromptAction
            active={webSearch}
            icon={<WorldIcon size={18} />}
            label="联网搜索"
            aria-label="联网搜索"
            onClick={() => setWebSearch((current) => !current)}
          />
        </AiPromptTools>

        <AiPromptContent className="min-w-0 flex-1">
          <AiPromptTextarea
            value={value}
            placeholder="描述你想完成的任务，@ 提及成员或助手…"
            onChange={(event) => setValue(event.currentTarget.value)}
          />
        </AiPromptContent>

        <div className="flex items-center gap-1">
          <AiModelSelector value={model} onValueChange={setModel}>
            <AiModelSelectorTrigger
              aria-label="选择模型"
              provider={selectedModel.provider}
              model={selectedModel.label}
            />
            <AiModelSelectorContent>
              {models.map((item, index) => (
                <React.Fragment key={item.value}>
                  {index ? <AiModelSelectorSeparator /> : null}
                  <AiModelSelectorGroup>
                    <AiModelSelectorLabel>
                      {item.providerName}
                    </AiModelSelectorLabel>
                    <AiModelSelectorItem
                      value={item.value}
                      provider={item.provider}
                    >
                      {item.label}
                    </AiModelSelectorItem>
                  </AiModelSelectorGroup>
                </React.Fragment>
              ))}
            </AiModelSelectorContent>
          </AiModelSelector>
          <AiPromptSubmit disabled={!value.trim()} />
        </div>
      </AiPromptFooter>
    </AiPrompt>
  )
}
