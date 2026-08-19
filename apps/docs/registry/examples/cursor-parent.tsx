import * as React from "react"
import { EyeIcon } from "lucide-react"

import { Cursor } from "@/registry/ui/cursor"

export default function CursorParent() {
  const [pos, setPos] = React.useState({ x: 0, y: 0 })

  return (
    <div className="relative flex h-72 w-full max-w-xl flex-col items-center justify-center overflow-hidden rounded-2xl border bg-card p-6 shadow-xs">
      <Cursor
        attachToParent
        springConfig={{ stiffness: 400, damping: 30, mass: 0.2 }}
        onPositionChange={setPos}
      >
        <div className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-md backdrop-blur-xs">
          <EyeIcon className="size-3.5" />
          <span>Inspect ({Math.round(pos.x)}, {Math.round(pos.y)})</span>
        </div>
      </Cursor>

      <div className="text-center">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Interactive Canvas Surface
        </h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          The custom cursor tracks pointer movement exclusively within this parent
          boundary with real-time coordinate inspection.
        </p>
      </div>

      <div className="mt-6 flex gap-3 text-xs text-muted-foreground">
        <span className="rounded-md border bg-muted/50 px-2.5 py-1">Pointer: Fine</span>
        <span className="rounded-md border bg-muted/50 px-2.5 py-1">Spring: 400/30</span>
      </div>
    </div>
  )
}
