"use client"

import * as React from "react"
import { RotateCw } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  TextEffect,
  type TextEffectPreset,
} from "@/registry/ui/text-effect"

const presets: { label: string; value: TextEffectPreset; desc: string }[] = [
  {
    label: "Fade In Blur",
    value: "fade-in-blur",
    desc: "带有 8px 模糊与纵向位移的优雅渐入效果，适合主标题。",
  },
  {
    label: "Fade",
    value: "fade",
    desc: "经典纯透明度过渡，克制稳重，适合长段落或辅助说明。",
  },
  {
    label: "Blur SM",
    value: "blur-sm",
    desc: "轻量级高斯模糊对焦入场，适合现代感科技风界面。",
  },
  {
    label: "Scale",
    value: "scale",
    desc: "自 85% 缩放微弹入场，适合高能量的通知与引人注目的标签。",
  },
  {
    label: "Slide",
    value: "slide",
    desc: "18px 纵向滑入位移，适合时间线与卡片列表项内容。",
  },
]

export default function TextEffectPresets() {
  const [activePreset, setActivePreset] =
    React.useState<TextEffectPreset>("fade-in-blur")
  const [trigger, setTrigger] = React.useState(true)

  const handleSelect = (preset: TextEffectPreset) => {
    setActivePreset(preset)
    setTrigger(false)
    window.setTimeout(() => setTrigger(true), 80)
  }

  const handleReplay = () => {
    setTrigger(false)
    window.setTimeout(() => setTrigger(true), 80)
  }

  const currentInfo = presets.find((p) => p.value === activePreset)!

  return (
    <div className="flex w-full max-w-xl flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-4">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => handleSelect(preset.value)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activePreset === preset.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex min-h-32 flex-col justify-center rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
        <TextEffect
          key={activePreset}
          as="h4"
          per="word"
          preset={activePreset}
          trigger={trigger}
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          Dynamic Typography Presets
        </TextEffect>
        <p className="mt-2 text-xs text-muted-foreground">{currentInfo.desc}</p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">
          当前预设: <code className="font-mono text-foreground font-semibold">{activePreset}</code>
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReplay}
          className="gap-1.5 text-xs"
        >
          <RotateCw className="size-3" />
          重播动画
        </Button>
      </div>
    </div>
  )
}
