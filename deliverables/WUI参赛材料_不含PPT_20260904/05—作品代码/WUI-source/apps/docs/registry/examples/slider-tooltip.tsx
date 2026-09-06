"use client"

import * as React from "react"
import { Slider } from "@/registry/ui/slider"

export default function SliderTooltip() {
  return (
    <div className="w-full max-w-sm space-y-8 pt-6">
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">
          总是显示数值气泡 (showValue="always")
        </span>
        <Slider
          defaultValue={[24]}
          min={16}
          max={32}
          step={0.5}
          showValue="always"
          formatValue={(val) => `${val}°C`}
          aria-label="空调设定温度"
        />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">
          悬停或聚焦时显示 (showValue="hover")
        </span>
        <Slider
          defaultValue={[75]}
          showValue="hover"
          formatValue={(val) => `${val}%`}
          aria-label="透明度百分比"
        />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">
          无浮动标签 (showValue="never")
        </span>
        <Slider
          defaultValue={[40]}
          showValue="never"
          aria-label="无标签滑块"
        />
      </div>
    </div>
  )
}
