"use client"

import * as React from "react"
import { BrainCircuitIcon, SparklesIcon, ZapIcon, InfoIcon } from "lucide-react"
import { Badge } from "@/registry/ui/badge"
import {
  AiModelGroup,
  AiModelItem,
  AiModelSelector,
  AiModelSelectorContent,
  AiModelSelectorTrigger,
  AiTokenUsage,
} from "@/registry/ui/ai-model-selector"

const ALL_MODELS = [
  {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet",
    description: "具备混合推理（Hybrid Thinking）与强代码生成能力",
    group: "Flagship / 旗舰推理",
    icon: <SparklesIcon className="size-3.5 text-amber-500" />,
    badge: <Badge variant="secondary" className="text-[10px] py-0">200k</Badge>,
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    description: "开源推理之王，擅长数学论证与算法解题",
    group: "Flagship / 旗舰推理",
    icon: <BrainCircuitIcon className="size-3.5 text-blue-500" />,
    badge: <Badge variant="outline" className="text-[10px] py-0 text-blue-600 border-blue-300">Reasoning</Badge>,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "多模态全能旗舰，兼具视觉理解与实时对话",
    group: "Flagship / 旗舰推理",
    icon: <SparklesIcon className="size-3.5 text-emerald-500" />,
    badge: <Badge variant="secondary" className="text-[10px] py-0">128k</Badge>,
  },
  {
    id: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    description: "超高速响应与低延迟轻量处理",
    group: "Fast / 极速轻量",
    icon: <ZapIcon className="size-3.5 text-amber-500" />,
    badge: <Badge variant="secondary" className="text-[10px] py-0">Fast</Badge>,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    description: "高性价比日常任务与格式化提取",
    group: "Fast / 极速轻量",
    icon: <ZapIcon className="size-3.5 text-emerald-500" />,
    badge: <Badge variant="secondary" className="text-[10px] py-0">Low Latency</Badge>,
  },
]

export default function AiModelSelectorAdvanced() {
  const [selectedId, setSelectedId] = React.useState("claude-3-7-sonnet")
  const [open, setOpen] = React.useState(false)
  const usedTokens = 78200

  const selectedModel = ALL_MODELS.find((m) => m.id === selectedId) ?? ALL_MODELS[0]

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 mx-auto">
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">当前运行模型:</span>
        <AiModelSelector open={open} onOpenChange={setOpen}>
          <AiModelSelectorTrigger icon={selectedModel.icon}>
            {selectedModel.name}
          </AiModelSelectorTrigger>

          <AiModelSelectorContent className="w-80">
            <AiModelGroup heading="Flagship / 旗舰推理">
              {ALL_MODELS.filter((m) => m.group.startsWith("Flagship")).map((model) => (
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

            <AiModelGroup heading="Fast / 极速轻量">
              {ALL_MODELS.filter((m) => m.group.startsWith("Fast")).map((model) => (
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

            <AiTokenUsage
              used={usedTokens}
              limit={200000}
              label="上下文窗口 (Context Window)"
            />
          </AiModelSelectorContent>
        </AiModelSelector>
      </div>

      <div className="w-full rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <InfoIcon className="size-3.5 text-primary" />
          <span>模型参数与能力摘要</span>
        </div>
        <p>{selectedModel.description}</p>
      </div>
    </div>
  )
}
