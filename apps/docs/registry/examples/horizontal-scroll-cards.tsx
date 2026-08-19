"use client"

import * as React from "react"
import { BarChart3Icon, CloudIcon, CpuIcon, LockIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { HorizontalScroll } from "@/registry/ui/horizontal-scroll"

const modules = [
  {
    icon: CpuIcon,
    title: "Inference Engine",
    desc: "Sub-5ms model dispatch with speculative decoding pipelines.",
    stat: "128k context",
  },
  {
    icon: CloudIcon,
    title: "Edge Mesh",
    desc: "Global DNS routing with automatic geo-distributed state sync.",
    stat: "99.999% SLA",
  },
  {
    icon: LockIcon,
    title: "Key Vault",
    desc: "Hardware Security Module (HSM) key rotation and token signing.",
    stat: "FIPS 140-3",
  },
  {
    icon: BarChart3Icon,
    title: "Telemetry Stream",
    desc: "High-throughput metric indexing with millisecond query responses.",
    stat: "50M metrics/s",
  },
]

export default function HorizontalScrollCards() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-96 w-full max-w-2xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-md [scrollbar-width:thin]"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Core Engine Subsystems
        </h3>
        <p className="text-xs text-muted-foreground">
          Scroll vertically to pan through modular architecture cards.
        </p>
      </div>

      <HorizontalScroll container={container} trackClassName="gap-4 pb-4">
        {modules.map((m) => {
          const Icon = m.icon
          return (
            <div
              key={m.title}
              className="flex w-64 shrink-0 flex-col justify-between rounded-xl border bg-muted/30 p-5 shadow-xs"
            >
              <div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h4 className="mt-3 font-semibold text-foreground">{m.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>
              </div>
              <div className="mt-4 border-t pt-3">
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {m.stat}
                </Badge>
              </div>
            </div>
          )
        })}
      </HorizontalScroll>
    </div>
  )
}
