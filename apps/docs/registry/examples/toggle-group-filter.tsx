"use client"

import * as React from "react"
import { FilterIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"
import { Badge } from "@/registry/ui/badge"

export default function ToggleGroupFilter() {
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([
    "pending",
    "in_progress",
  ])

  return (
    <div className="bg-background w-full max-w-lg rounded-xl border p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <FilterIcon className="size-3.5 text-primary" />
          <span>工单状态多维筛选</span>
        </div>
        <button
          type="button"
          onClick={() => setSelectedStatus([])}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          重置筛选
        </button>
      </div>

      <ToggleGroup
        type="multiple"
        value={selectedStatus}
        onValueChange={setSelectedStatus}
        variant="outline"
        className="flex-wrap"
        aria-label="工单状态多选"
      >
        <ToggleGroupItem value="pending" className="gap-2">
          <span>待处理</span>
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
            12
          </Badge>
        </ToggleGroupItem>

        <ToggleGroupItem value="in_progress" className="gap-2">
          <span>处理中</span>
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
            5
          </Badge>
        </ToggleGroupItem>

        <ToggleGroupItem value="review" className="gap-2">
          <span>待复核</span>
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
            3
          </Badge>
        </ToggleGroupItem>

        <ToggleGroupItem value="resolved" className="gap-2">
          <span>已解决</span>
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
            28
          </Badge>
        </ToggleGroupItem>
      </ToggleGroup>

      <p className="text-muted-foreground mt-3 text-xs">
        已选筛选项：
        <span className="font-mono text-foreground ml-1">
          {selectedStatus.length ? selectedStatus.join(", ") : "全部状态（无筛选）"}
        </span>
      </p>
    </div>
  )
}
