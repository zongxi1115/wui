"use client"

import * as React from "react"

import { MultiSelect } from "@/registry/ui/multi-select"

const labels = [
  { value: "bug", label: "缺陷", keywords: ["bug", "qx"] },
  { value: "feature", label: "新功能", keywords: ["feature", "xgn"] },
  { value: "performance", label: "性能", keywords: ["perf", "xn"] },
  { value: "a11y", label: "无障碍", keywords: ["a11y", "wza"] },
  { value: "docs", label: "文档", keywords: ["docs", "wd"] },
  { value: "design", label: "设计走查", keywords: ["design", "sjzc"] },
  { value: "blocked", label: "阻塞中", keywords: ["blocked", "zsz"] },
]

export default function MultiSelectDemo() {
  const [value, setValue] = React.useState(["bug", "performance"])

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium">Issue 标签</label>
      <MultiSelect
        options={labels}
        value={value}
        onValueChange={setValue}
        maxDisplay={3}
        placeholder="添加标签"
        searchPlaceholder="搜索标签或拼音首字母"
      />
      <p className="text-muted-foreground text-xs">
        已选择 {value.length} 个标签，超过 3 个时折叠为数量摘要。
      </p>
    </div>
  )
}
