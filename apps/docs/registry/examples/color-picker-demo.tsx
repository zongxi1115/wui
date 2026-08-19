"use client"

import * as React from "react"
import { Palette } from "lucide-react"

import { ColorPicker } from "@/registry/ui/color-picker"

export default function ColorPickerDemo() {
  const [color, setColor] = React.useState("oklch(0.546 0.245 262.881)")

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
        <Palette className="size-4 text-muted-foreground" />
        <span>品牌主色调配置</span>
      </label>
      <div className="flex items-center gap-3">
        <ColorPicker value={color} onValueChange={setColor} />
        <div className="flex flex-col">
          <code className="text-xs font-mono font-medium text-foreground">{color}</code>
          <span className="text-[11px] text-muted-foreground">点击色块展开色彩面板调节</span>
        </div>
      </div>
    </div>
  )
}
