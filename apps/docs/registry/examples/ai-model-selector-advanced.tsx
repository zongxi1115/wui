"use client"

import * as React from "react"

import {
  BrandAnthropicIcon,
  BrandGeminiIcon,
  BrandOpenaiIcon,
  BrandXaiIcon,
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
    id: "claude-opus",
    name: "Claude Opus",
    description: "复杂任务规划与长时间自主执行",
    context: 200_000,
    icon: <BrandAnthropicIcon size={14} />,
    tier: "旗舰",
  },
  {
    id: "gpt",
    name: "GPT",
    description: "通用推理、工具调用与视觉理解",
    context: 400_000,
    icon: <BrandOpenaiIcon size={14} />,
    tier: "旗舰",
  },
  {
    id: "grok",
    name: "Grok",
    description: "实时信息检索与长文本分析",
    context: 256_000,
    icon: <BrandXaiIcon size={14} />,
    tier: "旗舰",
  },
  {
    id: "gemini-flash",
    name: "Gemini Flash",
    description: "低成本高吞吐，适合批量处理",
    context: 1_000_000,
    icon: <BrandGeminiIcon size={14} />,
    tier: "轻量",
  },
]

const USED_TOKENS = 212_400

function formatContext(value: number) {
  return value >= 1_000_000 ? `${value / 1_000_000}M` : `${value / 1000}K`
}

export default function AiModelSelectorAdvanced() {
  const [selectedId, setSelectedId] = React.useState("gpt")
  const [open, setOpen] = React.useState(false)
  const selected = MODELS.find((model) => model.id === selectedId) ?? MODELS[0]

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">对话模型</span>
        <AiModelSelector open={open} onOpenChange={setOpen}>
          <AiModelSelectorTrigger variant="ghost" icon={selected.icon}>
            {selected.name}
          </AiModelSelectorTrigger>
          <AiModelSelectorContent align="end" className="w-80">
            {(["旗舰", "轻量"] as const).map((tier) => (
              <AiModelGroup key={tier} heading={tier}>
                {MODELS.filter((model) => model.tier === tier).map((model) => {
                  const overflow = USED_TOKENS > model.context
                  return (
                    <AiModelItem
                      key={model.id}
                      name={model.name}
                      description={
                        overflow
                          ? "当前会话已超出该模型的上下文窗口"
                          : model.description
                      }
                      icon={model.icon}
                      disabled={overflow}
                      badge={
                        <Badge variant="outline" size="sm" className="font-mono">
                          {formatContext(model.context)}
                        </Badge>
                      }
                      selected={model.id === selectedId}
                      onClick={() => {
                        setSelectedId(model.id)
                        setOpen(false)
                      }}
                    />
                  )
                })}
              </AiModelGroup>
            ))}
            <AiTokenUsage
              used={USED_TOKENS}
              limit={selected.context}
              label={`${selected.name} 上下文`}
            />
          </AiModelSelectorContent>
        </AiModelSelector>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        切换模型时保留当前会话；超出上下文窗口的模型不可选。
      </p>
    </div>
  )
}
