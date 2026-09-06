"use client"

import * as React from "react"

import { ScrollText } from "@/registry/ui/scroll-text"

export default function ScrollTextReveal() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-80 w-full max-w-xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-md [scrollbar-width:thin]"
    >
      <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">
        Scroll Reveal / Word Granularity
      </div>

      <div className="my-6">
        <ScrollText
          container={container}
          mode="reveal"
          per="word"
          offset={["start 0.8", "end 0.3"]}
          overlap={0.3}
          className="text-xl font-semibold leading-relaxed text-foreground sm:text-2xl"
        >
          Precision engineering meets natural fluidity. Every micro-interaction
          in WUI is calibrated for instant cognitive clarity.
        </ScrollText>
      </div>

      <div className="h-40" />
    </div>
  )
}
