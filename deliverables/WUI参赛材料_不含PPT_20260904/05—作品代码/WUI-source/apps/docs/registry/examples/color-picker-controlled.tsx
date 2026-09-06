"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { ColorPicker } from "@/registry/ui/color-picker"

export default function ColorPickerControlled() {
  const [color, setColor] = React.useState("oklch(0.585 0.233 277.117)")

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          主视觉焦点色 (受控模式)
        </label>
        <div className="flex items-center gap-3">
          <ColorPicker value={color} onValueChange={setColor} />
          <code className="text-xs font-mono text-foreground truncate">{color}</code>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3 text-xs">
        <span className="text-muted-foreground">快捷设为：</span>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setColor("oklch(0.577 0.245 27.325)")}
          >
            鲜红
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setColor("oklch(0.527 0.154 150.069)")}
          >
            翠绿
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setColor("oklch(0.585 0.233 277.117)")}
          >
            <RotateCcw className="mr-1 size-3" />
            重置
          </Button>
        </div>
      </div>
    </div>
  )
}
