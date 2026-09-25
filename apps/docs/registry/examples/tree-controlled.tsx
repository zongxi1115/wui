"use client"

import * as React from "react"
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Tree, type TreeNode } from "@/registry/ui/tree"

const departments: TreeNode[] = [
  {
    value: "product",
    label: "产品中心",
    children: [
      { value: "design", label: "体验设计部" },
      { value: "research", label: "用户研究组" },
      { value: "pm", label: "产品规划组" },
    ],
  },
  {
    value: "engineering",
    label: "研发中心",
    children: [
      {
        value: "client",
        label: "客户端研发部",
        children: [
          { value: "frontend", label: "Web 前端组" },
          { value: "mobile", label: "移动端组" },
        ],
      },
      { value: "backend", label: "服务端研发部" },
      { value: "legacy", label: "旧版系统维护组（已归档）", disabled: true },
    ],
  },
  {
    value: "operations",
    label: "运营中心",
    children: [
      { value: "growth", label: "增长运营部" },
      { value: "support", label: "客户成功部" },
    ],
  },
]

function collectParents(nodes: TreeNode[]): string[] {
  return nodes.flatMap((node) =>
    node.children?.length && !node.disabled
      ? [node.value, ...collectParents(node.children)]
      : []
  )
}

function findPath(nodes: TreeNode[], value: string): string[] {
  for (const node of nodes) {
    if (node.value === value) return [String(node.label)]
    const rest = node.children ? findPath(node.children, value) : []
    if (rest.length) return [String(node.label), ...rest]
  }
  return []
}

const allParents = collectParents(departments)

export default function TreeControlled() {
  const [value, setValue] = React.useState("frontend")
  const [expanded, setExpanded] = React.useState(["engineering", "client"])
  const allExpanded = expanded.length === allParents.length

  return (
    <div className="w-full max-w-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">组织架构</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(allExpanded ? [] : allParents)}
        >
          {allExpanded ? <ChevronsDownUpIcon /> : <ChevronsUpDownIcon />}
          {allExpanded ? "全部收起" : "全部展开"}
        </Button>
      </div>
      <Tree
        items={departments}
        value={value}
        expanded={expanded}
        onValueChange={setValue}
        onExpandedChange={setExpanded}
        aria-label="组织架构"
      />
      <p className="text-muted-foreground mt-3 border-t pt-3 text-xs">
        当前部门：{findPath(departments, value).join(" / ")}
      </p>
    </div>
  )
}
