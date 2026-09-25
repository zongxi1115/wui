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

import { cn } from "@/registry/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group"

const alignClass: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
}

export default function ToggleGroupAlignment() {
  const [alignment, setAlignment] = React.useState("left")
  const [formats, setFormats] = React.useState<string[]>(["bold"])

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          type="single"
          size="sm"
          value={alignment}
          onValueChange={(value) => value && setAlignment(value)}
          aria-label="文本对齐方式"
        >
          <ToggleGroupItem value="left" aria-label="左对齐">
            <AlignLeftIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="居中对齐">
            <AlignCenterIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="右对齐">
            <AlignRightIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="justify" aria-label="两端对齐">
            <AlignJustifyIcon />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="bg-border mx-1 h-5 w-px" />

        <ToggleGroup
          type="multiple"
          size="sm"
          value={formats}
          onValueChange={setFormats}
          aria-label="文字格式"
        >
          <ToggleGroupItem value="bold" aria-label="加粗">
            <BoldIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="斜体">
            <ItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="下划线">
            <UnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <p
        className={cn(
          "text-muted-foreground border-t pt-4 text-sm leading-6",
          alignClass[alignment],
          formats.includes("bold") && "text-foreground font-semibold",
          formats.includes("italic") && "italic",
          formats.includes("underline") && "underline underline-offset-4"
        )}
      >
        本季度新增 12 家企业客户，续费率提升至 94%，客服平均响应时长缩短到 3
        分钟以内。
      </p>
    </div>
  )
}
