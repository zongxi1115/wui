"use client"

import * as React from "react"
import { ArrowDown, Cpu, Gauge, Zap } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { VelocityMarquee } from "@/registry/ui/velocity-marquee"

const techTags = [
  "Next.js 15",
  "TypeScript",
  "Tailwind CSS v4",
  "WebAssembly",
  "Rust Core Engine",
  "Motion 12",
  "PostgreSQL",
  "Distributed Edge",
]

const benchmarkTags = [
  "✦ 99.999% SLA",
  "✦ Sub-10ms Latency",
  "✦ Zero-Config CLI",
  "✦ Hardware Enclave",
  "✦ 120 FPS Rendering",
  "✦ Type-Safe APIs",
]

export default function VelocityMarqueeDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-[30rem] w-full overflow-y-auto rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-lg [scrollbar-width:thin] sm:p-10"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Gauge className="size-3 text-sky-500" />
            VELOCITY OBSERVER
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400">
          <span>Scroll to accelerate velocity</span>
          <ArrowDown className="size-3.5 animate-bounce" />
        </div>
      </div>

      <div className="my-8 text-center">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Dynamic Scroll-Driven Marquee
        </h3>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Marquee tracks continuously glide at idle speed and dynamically boost
          velocity in real-time when scroll events occur.
        </p>
      </div>

      <div className="my-8 space-y-3.5 overflow-hidden rounded-xl border border-border bg-muted/30 py-5">
        {/* Forward Track */}
        <VelocityMarquee
          container={container}
          baseSpeed={40}
          sensitivity={0.12}
          maxBoost={240}
          gap={20}
        >
          {techTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 font-mono text-xs font-medium text-sky-700 dark:text-sky-300 shadow-xs"
            >
              <Cpu className="size-3 text-sky-500" />
              {tag}
            </span>
          ))}
        </VelocityMarquee>

        {/* Reverse Track */}
        <VelocityMarquee
          container={container}
          reverse
          baseSpeed={36}
          sensitivity={0.12}
          maxBoost={240}
          gap={20}
        >
          {benchmarkTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 font-mono text-xs font-medium text-emerald-700 dark:text-emerald-300 shadow-xs"
            >
              <Zap className="size-3 text-emerald-500" />
              {tag}
            </span>
          ))}
        </VelocityMarquee>
      </div>

      <div className="h-40 flex items-center justify-center text-xs text-muted-foreground">
        Scroll faster inside to see maximum speed boost and directional inertia
      </div>
    </div>
  )
}
