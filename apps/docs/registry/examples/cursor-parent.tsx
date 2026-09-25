"use client"

import * as React from "react"

import { Cursor } from "@/registry/ui/cursor"

export default function CursorParent() {
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  return (
    <div className="relative h-72 w-full max-w-xl overflow-hidden rounded-lg border bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px]">
      <Cursor
        attachToParent
        springConfig={{ stiffness: 600, damping: 40, mass: 0.2 }}
        onPositionChange={setPosition}
        variants={{
          initial: { opacity: 0, scale: 0.5 },
          animated: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.5 },
        }}
      >
        <span className="relative block">
          <span className="border-foreground block size-5 rounded-full border-2" />
          <span className="bg-foreground text-background absolute left-6 top-4 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums">
            {Math.round(position.x)}, {Math.round(position.y)}
          </span>
        </span>
      </Cursor>

      <div className="pointer-events-none absolute left-4 top-4">
        <p className="text-sm font-medium">画布取点</p>
        <p className="text-muted-foreground text-xs">
          通过 onPositionChange 实时读取光标在容器内的坐标
        </p>
      </div>
    </div>
  )
}
