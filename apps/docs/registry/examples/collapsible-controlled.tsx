"use client"

import * as React from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible"

export default function CollapsibleControlled() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="w-full max-w-md">
      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>部署详情</span>
        <span aria-live="polite">{open ? "已展开" : "已收起"}</span>
      </div>
      <Collapsible open={open} onOpenChange={setOpen} className="border">
        <CollapsibleTrigger>production / v2.8.0</CollapsibleTrigger>
        <CollapsibleContent>
          <dl className="grid grid-cols-[6rem_1fr] gap-y-2 border-t px-3 py-4 text-sm">
            <dt className="text-muted-foreground">状态</dt>
            <dd>运行中</dd>
            <dt className="text-muted-foreground">区域</dt>
            <dd>Asia Pacific</dd>
            <dt className="text-muted-foreground">更新时间</dt>
            <dd>2 分钟前</dd>
          </dl>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
