"use client"

import * as React from "react"
import { SparklesIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Parallax } from "@/registry/ui/parallax"

export default function ParallaxScale() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-96 w-full max-w-xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-md [scrollbar-width:thin]"
    >
      <div className="mb-4">
        <Badge variant="outline" className="text-xs">
          <SparklesIcon className="mr-1 size-3 text-primary" />
          Depth Scaling
        </Badge>
        <h3 className="mt-2 text-lg font-semibold text-foreground">
          Scroll Inside Frame
        </h3>
        <p className="text-xs text-muted-foreground">
          The image subtly scales from 1.0 to 1.2 while shifting vertically.
        </p>
      </div>

      <div className="relative h-64 overflow-hidden rounded-xl border bg-muted">
        <Parallax
          container={container}
          distance={[-40, 40]}
          scale={[1.0, 1.25]}
          className="size-full"
        >
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
            alt="Scenic valley"
            className="size-full object-cover"
          />
        </Parallax>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-xs font-mono uppercase tracking-widest text-white/70">
            Yosemite Valley
          </span>
          <h4 className="text-base font-semibold">Morning Mist & Granite Peaks</h4>
        </div>
      </div>

      <div className="h-48" />
    </div>
  )
}
