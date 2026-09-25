"use client"

import * as React from "react"

import {
  BrandAnthropicIcon,
  BrandGeminiIcon,
  BrandOpenaiIcon,
  BrandQwenIcon,
} from "@/registry/icons/animated"
import { Badge } from "@/registry/ui/badge"
import {
  AiModelGroup,
  AiModelItem,
  AiModelSelector,
  AiModelSelectorContent,
  AiModelSelectorTrigger,
  AiTokenUsage,
} from "@/registry/ui/ai-model-selector"

const MODELS = [
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    description: "长上下文编码与多步推理",
    group: "reasoning",
    icon: <BrandAnthropicIcon size={14} />,
    badge: "200K",
  },
  {
    id: "gpt",
    name: "GPT",
    description: "通用对话、工具调用与多模态理解",
    group: "reasoning",
    icon: <BrandOpenaiIcon size={14} />,
    badge: "推理",
  },
  {
    id: "gemini-flash",
    name: "Gemini Flash",
    description: "低延迟，适合实时补全与摘要",
    group: "fast",
    icon: <BrandGeminiIcon size={14} />,
    badge: "极速",
  },
  {
    id: "qwen",
    name: "Qwen",
    description: "中文写作与本地化部署",
    group: "fast",
    icon: <BrandQwenIcon size={14} />,
  },
]

export default function AiModelSelectorDemo() {
  const [selectedId, setSelectedId] = React.useState("claude-sonnet")
  const [open, setOpen] = React.useState(false)
  const selected = MODELS.find((model) => model.id === selectedId) ?? MODELS[0]

  function renderGroup(group: string) {
    return MODELS.filter((model) => model.group === group).map((model) => (
      <AiModelItem
        key={model.id}
        name={model.name}
        description={model.description}
        icon={model.icon}
        badge={
          model.badge ? (
            <Badge variant="secondary" size="sm">
              {model.badge}
            </Badge>
          ) : null
        }
        selected={model.id === selectedId}
        onClick={() => {
          setSelectedId(model.id)
          setOpen(false)
        }}
      />
    ))
  }

  return (
    <AiModelSelector open={open} onOpenChange={setOpen}>
      <AiModelSelectorTrigger icon={selected.icon}>
        {selected.name}
      </AiModelSelectorTrigger>
      <AiModelSelectorContent>
        <AiModelGroup heading="深度推理">{renderGroup("reasoning")}</AiModelGroup>
        <AiModelGroup heading="快速响应">{renderGroup("fast")}</AiModelGroup>
        <AiTokenUsage used={24500} limit={128000} label="当前会话上下文" />
      </AiModelSelectorContent>
    </AiModelSelector>
  )
}
