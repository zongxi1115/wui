"use client"

import * as React from "react"
import { ArrowDown, Bot, Check, Globe, Layers, ShieldCheck } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { StickyStack, StickyStackItem } from "@/registry/ui/sticky-stack"

const pillars = [
  {
    number: "01",
    tag: "ORCHESTRATION",
    title: "Autonomous Agent Graph",
    description:
      "Coordinate multi-agent workflows with real-time token streaming, parallel tool synthesis, and dynamic fallback pipelines.",
    stat: "10M+ daily runs",
    image: "https://picsum.photos/seed/agent-stack/800/350",
    icon: Bot,
  },
  {
    number: "02",
    tag: "SECURITY",
    title: "Zero-Trust Enclave Guard",
    description:
      "Hardware-enforced encryption with sub-millisecond cryptographic verification and automated compliance auditing.",
    stat: "SOC-2 Type II Verified",
    image: "https://picsum.photos/seed/security-stack/800/350",
    icon: ShieldCheck,
  },
  {
    number: "03",
    tag: "INFRASTRUCTURE",
    title: "Global Low-Latency Mesh",
    description:
      "Distribute state and serverless compute across 320+ edge data centers worldwide with sub-14ms median round-trip times.",
    stat: "320+ Edge Pops",
    image: "https://picsum.photos/seed/cloud-stack/800/350",
    icon: Globe,
  },
]

export default function StickyStackDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-[32rem] w-full overflow-y-auto rounded-2xl border border-border bg-card px-6 py-8 text-card-foreground shadow-lg [scrollbar-width:thin] sm:px-10"
    >
      <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-sky-500" />
            <h3 className="font-semibold text-foreground">Platform Pillars</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Scroll down to watch capabilities stack and scale dynamically
          </p>
        </div>
        <ArrowDown className="size-4 animate-bounce text-sky-500" />
      </div>

      <StickyStack container={container} top={20} gap={14} className="pb-32">
        {pillars.map((pillar) => {
          const Icon = pillar.icon
          return (
            <StickyStackItem
              key={pillar.number}
              className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Icon className="size-3 text-sky-500" />
                    {pillar.tag}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    PILLAR {pillar.number}
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {pillar.stat}
                </span>
              </div>

              <div className="my-4 relative h-36 w-full overflow-hidden rounded-xl sm:h-44">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="size-full object-cover"
                />
              </div>

              <h4 className="text-xl font-semibold text-foreground sm:text-2xl">
                {pillar.title}
              </h4>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {pillar.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Check className="size-3.5 text-emerald-500" />
                  <span>Enterprise Ready</span>
                </div>
                <Button size="sm" variant="outline">
                  Explore Architecture
                </Button>
              </div>
            </StickyStackItem>
          )
        })}
      </StickyStack>
    </div>
  )
}
