"use client"

import * as React from "react"

import { TreeSelect } from "@/registry/ui/tree-select"

const categories = [
  {
    value: "design",
    label: "设计资源",
    children: [
      { value: "icons", label: "图标" },
      { value: "illustrations", label: "插画" },
    ],
  },
  {
    value: "development",
    label: "开发资源",
    children: [
      { value: "components", label: "组件" },
      { value: "templates", label: "模板" },
    ],
  },
]

export default function TreeSelectDemo() {
  const [value, setValue] = React.useState("")

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium">资源分类</label>
      <TreeSelect
        items={categories}
        value={value}
        onValueChange={setValue}
        placeholder="选择分类"
      />
      <p className="text-muted-foreground text-xs">
        {value ? `当前值：${value}` : "尚未选择"}
      </p>
    </div>
  )
}
