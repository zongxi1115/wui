"use client"

import * as React from "react"
import { Minimize2Icon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { ScrollExpand } from "@/registry/ui/scroll-expand"

export default function ScrollExpandCollapse() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-96 w-full max-w-xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-md [scrollbar-width:thin]"
    >
      <div className="mb-4">
        <Badge variant="outline" className="text-xs">
          <Minimize2Icon className="mr-1 size-3 text-primary" />
          Direction: Collapse
        </Badge>
        <h3 className="mt-2 text-lg font-semibold text-foreground">
          Scroll Down to Collapse
        </h3>
        <p className="text-xs text-muted-foreground">
          The full-bleed canvas transitions into a compact rounded card.
        </p>
      </div>

      <ScrollExpand
        container={container}
        direction="collapse"
        scrollLength={1.8}
        inset={12}
        radius={24}
      >
        <div className="relative size-full overflow-hidden bg-muted">
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80"
            alt="Neon architecture"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/70">
              Cyberpunk Metropolis
            </span>
            <h4 className="text-base font-semibold">Neo Tokyo Night Corridor</h4>
          </div>
        </div>
      </ScrollExpand>

      <div className="h-24" />
    </div>
  )
}
