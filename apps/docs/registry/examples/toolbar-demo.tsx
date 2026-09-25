"use client"

import * as React from "react"
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  RedoIcon,
  Share2Icon,
  StrikethroughIcon,
  UndoIcon,
} from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarToggleItem,
} from "@/registry/ui/toolbar"

export default function ToolbarDemo() {
  const [align, setAlign] = React.useState("left")
  const [marks, setMarks] = React.useState<string[]>(["bold"])

  return (
    <Toolbar aria-label="文档编辑工具">
      <ToolbarButton>
        <Button variant="ghost" size="icon" className="size-8" aria-label="撤销">
          <UndoIcon />
        </Button>
      </ToolbarButton>
      <ToolbarButton disabled>
        <Button variant="ghost" size="icon" className="size-8" aria-label="重做">
          <RedoIcon />
        </Button>
      </ToolbarButton>

      <ToolbarSeparator />

      <ToolbarGroup
        type="multiple"
        value={marks}
        onValueChange={setMarks}
        aria-label="文字格式"
      >
        <ToolbarToggleItem value="bold" aria-label="加粗">
          <BoldIcon />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="italic" aria-label="斜体">
          <ItalicIcon />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="strike" aria-label="删除线">
          <StrikethroughIcon />
        </ToolbarToggleItem>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup
        type="single"
        value={align}
        onValueChange={(value) => value && setAlign(value)}
        aria-label="对齐方式"
      >
        <ToolbarToggleItem value="left" aria-label="左对齐">
          <AlignLeftIcon />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="center" aria-label="居中对齐">
          <AlignCenterIcon />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="right" aria-label="右对齐">
          <AlignRightIcon />
        </ToolbarToggleItem>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarButton>
        <Button size="sm">
          <Share2Icon />
          分享
        </Button>
      </ToolbarButton>
    </Toolbar>
  )
}
