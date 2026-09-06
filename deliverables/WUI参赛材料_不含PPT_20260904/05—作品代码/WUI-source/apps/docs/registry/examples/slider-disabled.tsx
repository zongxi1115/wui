"use client"

import * as React from "react"
import { Slider } from "@/registry/ui/slider"

export default function SliderDisabled() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          单滑块禁用（只读模式）
        </span>
        <Slider defaultValue={[60]} disabled aria-label="禁用单滑块" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          双端范围滑块禁用
        </span>
        <Slider defaultValue={[20, 80]} disabled aria-label="禁用双滑块" />
      </div>
    </div>
  )
}
