"use client"

import * as React from "react"
import { LayoutGridIcon, ListIcon, Share2Icon } from "lucide-react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/registry/ui/context-menu"

export default function ContextMenuAdvanced() {
  const [showDetails, setShowDetails] = React.useState(true)
  const [view, setView] = React.useState("grid")

  return (
    <ContextMenu>
      <ContextMenuTrigger className="border-border bg-background grid h-56 w-full max-w-lg place-items-center border">
        <div className="text-center">
          <p className="font-medium">设计资源</p>
          <p className="text-muted-foreground mt-1 text-sm">
            右键调整视图或共享
          </p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>显示方式</ContextMenuLabel>
        <ContextMenuRadioGroup value={view} onValueChange={setView}>
          <ContextMenuRadioItem value="grid">
            <LayoutGridIcon className="mr-2 size-4" />
            网格
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="list">
            <ListIcon className="mr-2 size-4" />
            列表
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          checked={showDetails}
          onCheckedChange={(checked) => setShowDetails(checked === true)}
        >
          显示详细信息
        </ContextMenuCheckboxItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Share2Icon />
            共享
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>复制链接</ContextMenuItem>
            <ContextMenuItem>发送给团队</ContextMenuItem>
            <ContextMenuItem disabled>发布到社区</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  )
}
