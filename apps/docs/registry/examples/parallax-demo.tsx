"use client"

import * as React from "react"
import { Activity, ArrowDown, Compass, Radio, Satellite } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Parallax } from "@/registry/ui/parallax"

export default function ParallaxDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-[32rem] w-full overflow-y-auto rounded-2xl border border-border bg-card text-card-foreground shadow-lg [scrollbar-width:thin]"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Radio className="size-4 text-sky-500 animate-pulse" />
            <span className="text-xs font-semibold text-foreground">
              Orbital Telemetry Stream
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400">
            <span>Scroll for multi-layer parallax</span>
            <ArrowDown className="size-3.5 animate-bounce" />
          </div>
        </div>

        <div className="my-5">
          <Badge variant="outline" className="text-xs">
            <Satellite className="size-3 text-sky-500" />
            DEEP SPACE EXPLORATION
          </Badge>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Multi-Speed Spatial Depth
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Each layer below translates with independent velocities relative to
            container scrolling.
          </p>
        </div>
      </div>

      {/* Visual Parallax Stage */}
      <div className="relative mx-6 my-2 h-96 overflow-hidden rounded-xl border border-border bg-muted/40 sm:mx-8">
        {/* Layer 1: Background Landscape / Space Photo (Slow Drift) */}
        <Parallax
          container={container}
          distance={[-100, 100]}
          scale={[1.1, 1.25]}
          className="absolute -inset-12"
        >
          <img
            src="https://picsum.photos/seed/space-station/1100/700"
            alt="Space Landscape"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </Parallax>

        {/* Fixed HUD frame overlay */}
        <div className="pointer-events-none absolute inset-4 z-10 rounded-lg border border-white/30 flex flex-col justify-between p-3">
          <div className="flex justify-between text-[10px] font-mono text-white/80 uppercase">
            <span>[ TARGET: ORBIT-04 ]</span>
            <span>[ LOCK: STABLE ]</span>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/80 uppercase">
            <span>FIXED HUD FRAME</span>
            <span>FREQ: 1420.4 MHZ</span>
          </div>
        </div>

        {/* Layer 2: Fast Horizontal Layer (Top) */}
        <Parallax
          container={container}
          axis="x"
          distance={[120, -120]}
          className="absolute inset-x-0 top-10 z-20 flex justify-center px-4"
        >
          <div className="flex items-center gap-2 rounded-full border border-white/30 bg-black/60 px-4 py-1.5 text-xs font-medium text-white shadow-xl backdrop-blur-md">
            <Activity className="size-3.5 text-sky-400" />
            <span>Velocity: 7.82 km/s (Fast Layer →)</span>
          </div>
        </Parallax>

        {/* Layer 3: Slower Horizontal Layer (Bottom) */}
        <Parallax
          container={container}
          axis="x"
          distance={[-80, 80]}
          className="absolute inset-x-0 bottom-10 z-20 flex justify-center px-4"
        >
          <div className="flex items-center gap-2 rounded-full border border-white/30 bg-black/60 px-4 py-1.5 text-xs font-medium text-white shadow-xl backdrop-blur-md">
            <Compass className="size-3.5 text-indigo-400" />
            <span>Altitude: 418 km (← Counter Vector)</span>
          </div>
        </Parallax>
      </div>

      <div className="p-6 pb-24 text-xs leading-relaxed text-muted-foreground sm:p-8 sm:pb-28">
        <p className="rounded-xl border border-border bg-muted/40 p-4">
          Notice how the fixed HUD outline stays anchored while the background
          imagery expands and the two telemetry badges glide horizontally in
          opposing directions.
        </p>
      </div>
    </div>
  )
}
