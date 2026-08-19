"use client"

import * as React from "react"
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  RedoIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react"
import { Button } from "@/registry/ui/button"
import { ButtonGroup } from "@/registry/ui/button-group"

export default function ButtonGroupToolbar() {
  const [activeStyles, setActiveStyles] = React.useState<string[]>([])

  const toggleStyle = (style: string) => {
    setActiveStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-2 text-card-foreground shadow-xs">
      <ButtonGroup aria-label="历史记录">
        <Button variant="outline" size="icon" aria-label="撤销">
          <UndoIcon />
        </Button>
        <Button variant="outline" size="icon" aria-label="重做">
          <RedoIcon />
        </Button>
      </ButtonGroup>

      <ButtonGroup aria-label="文本格式化">
        <Button
          variant={activeStyles.includes("bold") ? "secondary" : "outline"}
          size="icon"
          aria-label="加粗"
          aria-pressed={activeStyles.includes("bold")}
          onClick={() => toggleStyle("bold")}
        >
          <BoldIcon />
        </Button>
        <Button
          variant={activeStyles.includes("italic") ? "secondary" : "outline"}
          size="icon"
          aria-label="斜体"
          aria-pressed={activeStyles.includes("italic")}
          onClick={() => toggleStyle("italic")}
        >
          <ItalicIcon />
        </Button>
        <Button
          variant={activeStyles.includes("underline") ? "secondary" : "outline"}
          size="icon"
          aria-label="下划线"
          aria-pressed={activeStyles.includes("underline")}
          onClick={() => toggleStyle("underline")}
        >
          <UnderlineIcon />
        </Button>
        <Button
          variant={activeStyles.includes("code") ? "secondary" : "outline"}
          size="icon"
          aria-label="行内代码"
          aria-pressed={activeStyles.includes("code")}
          onClick={() => toggleStyle("code")}
        >
          <CodeIcon />
        </Button>
      </ButtonGroup>
    </div>
  )
}
