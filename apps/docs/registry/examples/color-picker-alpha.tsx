"use client"

import * as React from "react"

import { ColorPicker } from "@/registry/ui/color-picker"

export default function ColorPickerAlpha() {
  const [solidColor, setSolidColor] = React.useState("oklch(0.666 0.179 58.318)")
  const [transColor, setTransColor] = React.useState("oklch(0.546 0.245 262.881 / 65%)")

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          禁用透明度通道 (showAlpha=false)
        </label>
        <div className="flex items-center gap-3">
          <ColorPicker
            value={solidColor}
            onValueChange={setSolidColor}
            showAlpha={false}
          />
          <span className="text-xs text-muted-foreground font-mono">
            纯色模式（仅调节颜色，禁止半透明）
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          启用透明度通道 (showAlpha=true, 默认)
        </label>
        <div className="flex items-center gap-3">
          <ColorPicker
            value={transColor}
            onValueChange={setTransColor}
            showAlpha={true}
          />
          <span className="text-xs text-muted-foreground font-mono">
            支持 0%–100% Alpha 透明度控制
          </span>
        </div>
      </div>
    </div>
  )
}
