"use client"

import * as React from "react"
import { Checkbox } from "@/registry/ui/checkbox"

export default function CheckboxDemo() {
  const [selected, setSelected] = React.useState<string[]>(["icloud", "handoff"])

  const options = [
    { id: "icloud", label: "同步 iCloud 设置", description: "在所有登录相同 Apple ID 的设备间同步偏好设置" },
    { id: "handoff", label: "允许接力 (Handoff)", description: "在 Mac、iPad 和 iPhone 之间无缝继续工作" },
    { id: "analytics", label: "共享设备分析数据", description: "帮助改进产品体验，数据将以匿名方式汇总上传" },
  ]

  const toggleOption = (id: string, checked: boolean | "indeterminate") => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    )
  }

  return (
    <div className="w-full max-w-md space-y-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs">
      <div className="border-b border-border pb-2">
        <h4 className="text-sm font-medium">设备与同步设置</h4>
        <p className="text-xs text-muted-foreground">管理跨设备协作与数据同步偏好</p>
      </div>
      <div className="space-y-3 pt-1">
        {options.map((option) => (
          <label
            key={option.id}
            htmlFor={option.id}
            className="flex cursor-pointer items-start gap-3 rounded-md p-1.5 transition-colors hover:bg-muted/50"
          >
            <Checkbox
              id={option.id}
              checked={selected.includes(option.id)}
              onCheckedChange={(checked) => toggleOption(option.id, checked)}
              className="mt-0.5"
            />
            <div className="grid gap-0.5 leading-none">
              <span className="text-sm font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
