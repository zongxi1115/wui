"use client"

import * as React from "react"

import { TextMorph } from "@/registry/ui/text-morph"
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

const filters = [
  { id: "all", label: "全部", summary: "共 24 个任务" },
  { id: "active", label: "进行中", summary: "14 个任务进行中" },
  { id: "review", label: "待评审", summary: "6 个任务待评审" },
  { id: "done", label: "已完成", summary: "4 个任务已完成" },
]

export default function TextMorphTabs() {
  const [active, setActive] = React.useState("all")
  const current = filters.find((filter) => filter.id === active)

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <ToggleGroup
        type="single"
        value={active}
        onValueChange={(value) => value && setActive(value)}
        aria-label="任务筛选"
      >
        {filters.map((filter) => (
          <ToggleGroupItem key={filter.id} value={filter.id}>
            {filter.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <TextMorph as="p" className="text-muted-foreground text-sm">
        {current?.summary ?? ""}
      </TextMorph>
    </div>
  )
}
