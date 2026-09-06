"use client"

import * as React from "react"

import { MultiSelect } from "@/registry/ui/multi-select"

const options = [
  { value: "2025", label: "2025年" },
  { value: "2026", label: "2026年" },
  { value: "2027", label: "2027年" },
  { value: "2028", label: "2028年" },
]

export default function MultiSelectDemo() {
  const [value, setValue] = React.useState(["2026", "2027"])

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium">服务年度</label>
      <MultiSelect
        options={options}
        value={value}
        onValueChange={setValue}
        placeholder="请选择服务年度"
        searchPlaceholder="搜索年度"
      />
    </div>
  )
}
