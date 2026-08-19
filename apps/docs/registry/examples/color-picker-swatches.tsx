"use client"

import * as React from "react"

import { ColorPicker } from "@/registry/ui/color-picker"

const brandTokens = [
  "oklch(0.55 0.22 260)", // Deep Indigo
  "oklch(0.60 0.18 200)", // Cyan
  "oklch(0.62 0.19 145)", // Emerald
  "oklch(0.70 0.18 80)",  // Amber Gold
  "oklch(0.58 0.23 25)",  // Coral Red
  "oklch(0.52 0.24 310)", // Purple Pink
  "oklch(0.20 0.02 260)", // Dark Neutral
  "oklch(0.95 0.01 260)", // Light Neutral
]

export default function ColorPickerSwatches() {
  const [color, setColor] = React.useState(brandTokens[0])

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <label className="text-sm font-medium text-foreground">
        企业设计系统 Token 预设色板
      </label>
      <div className="flex items-center gap-3">
        <ColorPicker
          value={color}
          onValueChange={setColor}
          swatches={brandTokens}
        />
        <div className="flex flex-col">
          <code className="text-xs font-mono font-medium text-foreground">{color}</code>
          <span className="text-[11px] text-muted-foreground">面板底部呈现 8 种设计规范色</span>
        </div>
      </div>
    </div>
  )
}
