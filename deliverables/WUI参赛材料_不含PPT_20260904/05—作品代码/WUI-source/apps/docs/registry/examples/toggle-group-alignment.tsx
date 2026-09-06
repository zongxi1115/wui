"use client"

import * as React from "react"
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

export default function ToggleGroupAlignment() {
  const [alignment, setAlignment] = React.useState("left")
  const [formats, setFormats] = React.useState<string[]>(["bold"])

  return (
    <div className="bg-background flex flex-wrap items-center gap-3 rounded-xl border p-3 shadow-xs">
      {/* 单选：对齐方式 */}
      <ToggleGroup
        type="single"
        value={alignment}
        onValueChange={(val) => val && setAlignment(val)}
        variant="outline"
        size="sm"
        aria-label="文本对齐方式"
      >
        <ToggleGroupItem value="left" aria-label="左对齐">
          <AlignLeftIcon className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="居中对齐">
          <AlignCenterIcon className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="右对齐">
          <AlignRightIcon className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify" aria-label="两端对齐">
          <AlignJustifyIcon className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="bg-border h-4 w-px" />

      {/* 多选：文字格式 */}
      <ToggleGroup
        type="multiple"
        value={formats}
        onValueChange={setFormats}
        variant="outline"
        size="sm"
        aria-label="文字排版格式"
      >
        <ToggleGroupItem value="bold" aria-label="加粗">
          <BoldIcon className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="斜体">
          <ItalicIcon className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="下划线">
          <UnderlineIcon className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="text-muted-foreground ml-auto text-xs">
        排版：<span className="text-foreground font-mono">{alignment}</span> | 样式：
        <span className="text-foreground font-mono">[{formats.join(", ") || "none"}]</span>
      </div>
    </div>
  )
}
