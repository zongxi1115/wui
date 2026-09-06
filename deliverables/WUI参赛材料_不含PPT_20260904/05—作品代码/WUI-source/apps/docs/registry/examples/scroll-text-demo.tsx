"use client"

import * as React from "react"
import { ArrowDown, Sparkles } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { ScrollText } from "@/registry/ui/scroll-text"

export default function ScrollTextDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-[32rem] w-full overflow-y-auto rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-lg [scrollbar-width:thin] sm:p-10"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Sparkles className="size-3 text-sky-500" />
            DESIGN MANIFESTO
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400">
          <span>Scroll to illuminate</span>
          <ArrowDown className="size-3.5 animate-bounce" />
        </div>
      </div>

      <div className="relative my-6 h-40 w-full overflow-hidden rounded-xl sm:h-52">
        <img
          src="https://picsum.photos/seed/sculpture-minimal/1000/400"
          alt="Design Architecture"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
      </div>

      <div className="space-y-20 py-6">
        {/* Highlight Mode Showcase */}
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400">
            01 / Progressive Word Highlight
          </span>
          <div className="mt-4">
            <ScrollText
              container={container}
              mode="highlight"
              per="word"
              offset={["start 0.8", "end 0.4"]}
              overlap={0.4}
              className="text-2xl font-medium leading-relaxed tracking-tight text-foreground sm:text-4xl"
            >
              We believe great software is not merely functional. Every
              interaction should feel instantaneous, intuitive, and remarkably
              crafted with obsessive attention to detail.
            </ScrollText>
          </div>
        </div>

        {/* Reveal Mode Showcase */}
        <div className="rounded-xl border border-border bg-muted/40 p-6 sm:p-8">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            02 / Line-by-Line Spatial Reveal
          </span>
          <div className="mt-4">
            <ScrollText
              container={container}
              mode="reveal"
              per="line"
              offset={["start 0.85", "end 0.35"]}
              overlap={0.5}
              className="text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl"
            >
              {
                "Fast by default.\nAccessible by design.\nEngineered for modern builders."
              }
            </ScrollText>
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  )
}
