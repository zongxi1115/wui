"use client"

import * as React from "react"

import { Tree, type TreeNode } from "@/registry/ui/tree"

const departments: TreeNode[] = [
  {
    value: "product",
    label: "产品中心",
    children: [
      { value: "design", label: "设计团队" },
      { value: "research", label: "用户研究" },
    ],
  },
  {
    value: "engineering",
    label: "研发中心",
    children: [
      { value: "frontend", label: "前端团队" },
      { value: "backend", label: "服务端团队" },
      { value: "legacy", label: "归档团队", disabled: true },
    ],
  },
]

export default function TreeControlled() {
  const [value, setValue] = React.useState("frontend")
  const [expanded, setExpanded] = React.useState(["engineering"])

  return (
    <div className="w-full max-w-sm space-y-3">
      <Tree
        items={departments}
        value={value}
        expanded={expanded}
        onValueChange={setValue}
        onExpandedChange={setExpanded}
        aria-label="组织架构"
      />
      <p className="text-muted-foreground text-xs">
        已展开 {expanded.length} 组，当前值：{value}
      </p>
    </div>
  )
}
