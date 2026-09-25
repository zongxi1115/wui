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

const formats = [
  { value: "bold", label: "加粗", icon: BoldIcon },
  { value: "italic", label: "斜体", icon: ItalicIcon },
  { value: "underline", label: "下划线", icon: UnderlineIcon },
  { value: "code", label: "行内代码", icon: CodeIcon },
]

export default function ButtonGroupToolbar() {
  const [active, setActive] = React.useState<string[]>(["bold"])

  const toggle = (value: string) =>
    setActive((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonGroup aria-label="历史记录">
        <Button variant="outline" size="icon" aria-label="撤销">
          <UndoIcon />
        </Button>
        <Button variant="outline" size="icon" aria-label="重做" disabled>
          <RedoIcon />
        </Button>
      </ButtonGroup>

      <ButtonGroup aria-label="文本格式">
        {formats.map(({ value, label, icon: Icon }) => {
          const pressed = active.includes(value)
          return (
            <Button
              key={value}
              variant="outline"
              size="icon"
              aria-label={label}
              aria-pressed={pressed}
              onClick={() => toggle(value)}
              className="aria-pressed:bg-accent aria-pressed:text-accent-foreground"
            >
              <Icon />
            </Button>
          )
        })}
      </ButtonGroup>
    </div>
  )
}
