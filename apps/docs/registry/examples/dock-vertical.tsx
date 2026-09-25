"use client"

import * as React from "react"
import {
  HandIcon,
  MousePointer2Icon,
  PenToolIcon,
  ShapesIcon,
  StickyNoteIcon,
  TypeIcon,
} from "lucide-react"

import { Dock, DockItem, DockSeparator } from "@/registry/ui/dock"

const tools = [
  { id: "select", label: "选择", icon: MousePointer2Icon },
  { id: "hand", label: "抓手", icon: HandIcon },
  { id: "pen", label: "钢笔", icon: PenToolIcon },
  { id: "shape", label: "形状", icon: ShapesIcon },
  { id: "text", label: "文本", icon: TypeIcon },
]

export default function DockVertical() {
  const [tool, setTool] = React.useState("select")

  return (
    <div className="bg-muted/40 relative flex h-80 w-full max-w-xl items-center rounded-lg border bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] px-4">
      <Dock direction="vertical" magnification={52} distance={110}>
        {tools.map(({ id, label, icon: Icon }) => (
          <DockItem
            key={id}
            size={36}
            label={label}
            active={tool === id}
            aria-pressed={tool === id}
            onClick={() => setTool(id)}
          >
            <Icon />
          </DockItem>
        ))}
        <DockSeparator />
        <DockItem size={36} label="便签">
          <StickyNoteIcon />
        </DockItem>
      </Dock>
    </div>
  )
}
