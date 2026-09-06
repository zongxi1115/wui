"use client"

import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"

export default function RadioGroupDemo() {
  const [value, setValue] = React.useState("automatic")

  const options = [
    { value: "automatic", label: "跟随系统外观", description: "自动根据操作系统的深色/浅色模式切换界面配色" },
    { value: "light", label: "浅色模式 (Light)", description: "始终使用高对比度的明亮浅色主题" },
    { value: "dark", label: "深色模式 (Dark)", description: "适合暗光环境，减轻眼部疲劳并更节省电量" },
  ]

  return (
    <div className="w-full max-w-md space-y-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs">
      <div className="border-b border-border pb-2">
        <h4 className="text-sm font-medium">主题偏好设置</h4>
        <p className="text-xs text-muted-foreground">选择适合您工作习惯的界面外观</p>
      </div>

      <RadioGroup value={value} onValueChange={setValue} className="gap-2 pt-1">
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={`theme-${option.value}`}
            className="flex cursor-pointer items-start gap-3 rounded-md p-1.5 transition-colors hover:bg-muted/50"
          >
            <RadioGroupItem value={option.value} id={`theme-${option.value}`} className="mt-0.5" />
            <div className="grid gap-0.5 leading-none">
              <span className="text-sm font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}
