"use client"

import * as React from "react"
import { BoldIcon } from "lucide-react"

import { Toggle } from "@/registry/ui/toggle"

export default function ToggleDemo() {
  const [pressed, setPressed] = React.useState(false)

  return (
    <Toggle
      pressed={pressed}
      onPressedChange={setPressed}
      variant="outline"
      aria-label="切换粗体"
    >
      <BoldIcon />
      粗体
    </Toggle>
  )
}
