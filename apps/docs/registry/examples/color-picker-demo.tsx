"use client"

import * as React from "react"

import { ColorPicker } from "@/registry/ui/color-picker"

export default function ColorPickerDemo() {
  const [value, setValue] = React.useState("oklch(0.546 0.245 262.881)")

  return (
    <div className="flex items-center gap-3">
      <ColorPicker value={value} onValueChange={setValue} />
      <code className="text-xs text-muted-foreground">{value}</code>
    </div>
  )
}
