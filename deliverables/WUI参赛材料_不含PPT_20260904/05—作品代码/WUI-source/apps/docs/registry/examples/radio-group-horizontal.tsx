"use client"

import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group"

export default function RadioGroupHorizontal() {
  const priorities = [
    { value: "low", label: "低优先级" },
    { value: "medium", label: "中等" },
    { value: "high", label: "高优先级" },
    { value: "urgent", label: "紧急" },
  ]

  return (
    <div className="w-full max-w-lg space-y-2">
      <span className="text-xs font-medium text-muted-foreground">任务处理优先级</span>
      <RadioGroup defaultValue="medium" orientation="horizontal" className="flex flex-wrap items-center gap-5">
        {priorities.map((item) => (
          <label
            key={item.value}
            htmlFor={`priority-${item.value}`}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <RadioGroupItem value={item.value} id={`priority-${item.value}`} size="sm" />
            <span>{item.label}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}
