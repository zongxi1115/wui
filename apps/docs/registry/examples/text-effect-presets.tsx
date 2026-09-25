"use client"

import * as React from "react"

import {
  TextEffect,
  type TextEffectPreset,
} from "@/registry/ui/text-effect"
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

const presets: { value: TextEffectPreset; desc: string }[] = [
  { value: "fade", desc: "纯透明度过渡，克制稳妥，适合长段落。" },
  { value: "blur", desc: "由强模糊对焦到清晰，适合沉浸式首屏。" },
  { value: "blur-sm", desc: "轻量模糊对焦，适合界面内的说明文字。" },
  { value: "fade-in-blur", desc: "模糊对焦并轻微上浮，适合主标题。" },
  { value: "scale", desc: "自 85% 缩放入场，适合短促的强调词。" },
  { value: "slide", desc: "18px 纵向滑入，适合列表与时间线。" },
  { value: "rise", desc: "逐字从下方弹起，带弹簧质感。" },
  { value: "drop", desc: "逐字从上方落下，适合数字与标签。" },
  { value: "flip", desc: "沿 X 轴翻转立起，适合品牌字与大标题。" },
]

export default function TextEffectPresets() {
  const [preset, setPreset] = React.useState<TextEffectPreset>("rise")
  const [key, setKey] = React.useState(0)
  const current = presets.find((item) => item.value === preset)

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-8">
      <ToggleGroup
        type="single"
        size="sm"
        value={preset}
        onValueChange={(value) => {
          if (!value) return
          setPreset(value as TextEffectPreset)
          setKey((k) => k + 1)
        }}
        className="flex-wrap justify-center"
        aria-label="选择预设"
      >
        {presets.map((item) => (
          <ToggleGroupItem
            key={item.value}
            value={item.value}
            className="font-mono text-xs"
          >
            {item.value}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <button
        type="button"
        onClick={() => setKey((k) => k + 1)}
        className="focus-visible:ring-ring/50 flex min-h-24 flex-col items-center justify-center gap-2 rounded-md px-4 text-center outline-none focus-visible:ring-[3px]"
        aria-label="重播当前预设"
      >
        <TextEffect
          key={`${preset}-${key}`}
          as="span"
          per="char"
          preset={preset}
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          灵感从不按时到来
        </TextEffect>
        <span className="text-muted-foreground text-xs">
          {current?.desc} 点击文字重播。
        </span>
      </button>
    </div>
  )
}
