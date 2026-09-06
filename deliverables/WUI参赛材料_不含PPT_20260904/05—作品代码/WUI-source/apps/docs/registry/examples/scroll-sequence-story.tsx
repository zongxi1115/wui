"use client"

import * as React from "react"
import { CpuIcon, DatabaseIcon, ShieldCheckIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { ScrollSequence } from "@/registry/ui/scroll-sequence"

const phases = [
  {
    icon: DatabaseIcon,
    title: "1. Vector Hydration",
    desc: "100k embedding vectors loaded into GPU memory cache in under 12ms.",
  },
  {
    icon: CpuIcon,
    title: "2. Parallel Beam Search",
    desc: "8-head speculative exploration tracks top candidate reasoning paths simultaneously.",
  },
  {
    icon: ShieldCheckIcon,
    title: "3. Cryptographic Guardrail",
    desc: "All output tokens undergo zero-trust validation before client transmission.",
  },
]

export default function ScrollSequenceStory() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-96 w-full max-w-xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-md [scrollbar-width:thin]"
    >
      <div className="mb-4">
        <Badge variant="secondary" className="text-xs">
          Interactive Pipeline
        </Badge>
        <h3 className="mt-2 text-lg font-semibold text-foreground">
          Scroll Down to Advance
        </h3>
        <p className="text-xs text-muted-foreground">
          Step transitions seamlessly in place as you scroll.
        </p>
      </div>

      <ScrollSequence
        container={container}
        stepLength={0.8}
        viewportClassName="min-h-[14rem] rounded-xl border bg-muted/40 p-6 flex flex-col justify-center"
      >
        {phases.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h4 className="text-base font-semibold text-foreground">
                {item.title}
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          )
        })}
      </ScrollSequence>
    </div>
  )
}
