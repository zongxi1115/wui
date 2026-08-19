"use client"

import * as React from "react"
import { CheckIcon, FilterIcon, RefreshCcwIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/ui/popover"

export default function PopoverFilter() {
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([
    "published",
  ])

  const toggleStatus = (val: string) => {
    setSelectedStatus((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FilterIcon className="size-3.5 text-muted-foreground" />
          <span>筛选条件</span>
          {selectedStatus.length > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {selectedStatus.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" showArrow className="w-80 p-4">
        <div className="space-y-1 border-b pb-3">
          <PopoverTitle>快速筛选</PopoverTitle>
          <PopoverDescription>
            自定义数据表格的过滤维度与显示范围。
          </PopoverDescription>
        </div>

        <div className="space-y-3 py-3">
          <label className="text-xs font-medium text-muted-foreground">
            发布状态
          </label>
          <div className="flex flex-col gap-2">
            {[
              { id: "published", label: "已发布上线 (Published)" },
              { id: "draft", label: "草稿暂存 (Draft)" },
              { id: "archived", label: "已归档历史 (Archived)" },
            ].map((item) => {
              const active = selectedStatus.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleStatus(item.id)}
                  className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-muted"
                >
                  <span className={active ? "font-medium text-foreground" : "text-muted-foreground"}>
                    {item.label}
                  </span>
                  {active && <CheckIcon className="size-3.5 text-primary" />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedStatus([])}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCcwIcon className="mr-1 size-3" />
            重置
          </Button>

          <PopoverClose asChild>
            <Button size="sm" className="h-7 px-3 text-xs">
              确认筛选
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
