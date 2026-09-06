"use client"

import * as React from "react"
import { ArrowDown, Maximize2 } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { ScrollExpand } from "@/registry/ui/scroll-expand"

export default function ScrollExpandDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-[32rem] w-full overflow-y-auto rounded-2xl border border-border bg-card text-card-foreground shadow-lg [scrollbar-width:thin]"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Maximize2 className="size-3 text-sky-500" />
              EXPAND VIEWPORT
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400">
            <span>Scroll down to expand to full bleed</span>
            <ArrowDown className="size-3.5 animate-bounce" />
          </div>
        </div>

        <div className="my-5">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Immersive Media Expansion
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Watch the framed visual canvas seamlessly expand to full container
            edges as you scroll.
          </p>
        </div>
      </div>

      <ScrollExpand
        container={container}
        scrollLength={2.2}
        inset={8}
        radius={18}
      >
        <div className="relative size-full overflow-hidden border border-border/80 bg-muted/40 shadow-xl">
          <img
            src="https://picsum.photos/seed/mountain-pass/1200/700"
            alt="Panoramic Landscape"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-white sm:inset-x-8 sm:bottom-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/70">
                PANORAMIC HORIZON
              </span>
              <h4 className="text-xl font-semibold tracking-tight text-white sm:text-3xl">
                The Alpine Ridge Route
              </h4>
            </div>

            <span className="rounded-md bg-black/40 px-2.5 py-1 font-mono text-xs text-white backdrop-blur-md">
              FULL BLEED
            </span>
          </div>
        </div>
      </ScrollExpand>
    </div>
  )
}
