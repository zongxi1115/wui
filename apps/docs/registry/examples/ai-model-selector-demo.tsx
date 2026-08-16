"use client"

import * as React from "react"
import { BrainCircuitIcon, SparklesIcon, ZapIcon } from "lucide-react"
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
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    description: "最强编码与深度推理能力",
    group: "Flagship / 深度推理",
    icon: <SparklesIcon className="size-3.5 text-amber-500" />,
    badge: <Badge variant="secondary" className="text-[10px] py-0">200k</Badge>,
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    description: "极致性价比的长链思考模型",
    group: "Flagship / 深度推理",
    icon: <BrainCircuitIcon className="size-3.5 text-blue-500" />,
    badge: <Badge variant="outline" className="text-[10px] py-0">Reasoning</Badge>,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    description: "轻量级高频调用与流式快速响应",
    group: "Fast / 高速轻量",
    icon: <ZapIcon className="size-3.5 text-emerald-500" />,
    badge: <Badge variant="secondary" className="text-[10px] py-0">Fast</Badge>,
  },
]

export default function AiModelSelectorDemo() {
  const [selectedId, setSelectedId] = React.useState("claude-3-5-sonnet")
  const [open, setOpen] = React.useState(false)

  const selectedModel = MODELS.find((m) => m.id === selectedId) ?? MODELS[0]

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <AiModelSelector open={open} onOpenChange={setOpen}>
        <AiModelSelectorTrigger icon={selectedModel.icon}>
          {selectedModel.name}
        </AiModelSelectorTrigger>

        <AiModelSelectorContent>
          <AiModelGroup heading="Flagship / 深度推理">
            {MODELS.filter((m) => m.group.startsWith("Flagship")).map((model) => (
              <AiModelItem
                key={model.id}
                name={model.name}
                description={model.description}
                icon={model.icon}
                badge={model.badge}
                selected={selectedId === model.id}
                onClick={() => {
                  setSelectedId(model.id)
                  setOpen(false)
                }}
              />
            ))}
          </AiModelGroup>

          <AiModelGroup heading="Fast / 高速轻量">
            {MODELS.filter((m) => m.group.startsWith("Fast")).map((model) => (
              <AiModelItem
                key={model.id}
                name={model.name}
                description={model.description}
                icon={model.icon}
                badge={model.badge}
                selected={selectedId === model.id}
                onClick={() => {
                  setSelectedId(model.id)
                  setOpen(false)
                }}
              />
            ))}
          </AiModelGroup>

          <AiTokenUsage used={24500} limit={128000} />
        </AiModelSelectorContent>
      </AiModelSelector>
    </div>
  )
}
