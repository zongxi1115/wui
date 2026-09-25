"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

const statuses = [
  { value: "pending", label: "待处理", count: 12 },
  { value: "in_progress", label: "处理中", count: 5 },
  { value: "review", label: "待复核", count: 3 },
  { value: "resolved", label: "已解决", count: 28 },
]

export default function ToggleGroupFilter() {
  const [selected, setSelected] = React.useState<string[]>([
    "pending",
    "in_progress",
  ])

  const total = statuses
    .filter((item) => selected.length === 0 || selected.includes(item.value))
    .reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <ToggleGroup
        type="multiple"
        variant="outline"
        size="sm"
        value={selected}
        onValueChange={setSelected}
        aria-label="按工单状态筛选"
        className="flex-wrap"
      >
        {statuses.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value} className="px-3">
            {item.label}
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {item.count}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>
          {selected.length === 0 ? "全部状态" : `已选 ${selected.length} 个状态`}
          ，共 <span className="text-foreground font-medium tabular-nums">{total}</span> 条工单
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={selected.length === 0}
          onClick={() => setSelected([])}
        >
          清除筛选
        </Button>
      </div>
    </div>
  )
}
