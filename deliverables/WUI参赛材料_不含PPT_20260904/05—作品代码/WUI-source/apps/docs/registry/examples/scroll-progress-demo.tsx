"use client"

import * as React from "react"
import { BookOpen, Clock } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { ScrollProgress } from "@/registry/ui/scroll-progress"

export default function ScrollProgressDemo() {
  const container = React.useRef<HTMLDivElement>(null)
  const article = React.useRef<HTMLElement>(null)

  return (
    <div
      ref={container}
      className="relative h-[32rem] w-full overflow-y-auto rounded-2xl border border-border bg-card text-card-foreground shadow-lg [scrollbar-width:thin]"
    >
      {/* Top linear progress bar */}
      <ScrollProgress
        container={container}
        target={article}
        position="inline"
        className="sticky top-0 z-30 h-1 bg-muted"
        indicatorClassName="bg-primary"
        offset={["start start", "end end"]}
      />

      {/* Floating circular progress indicator */}
      <div className="sticky top-4 z-20 flex justify-end px-5 pointer-events-none">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1 text-xs text-foreground shadow-lg backdrop-blur-md">
          <span className="text-[11px] text-muted-foreground">Read</span>
          <ScrollProgress
            container={container}
            target={article}
            variant="circle"
            size={28}
            strokeWidth={3}
            className="text-foreground"
            trackClassName="text-muted"
            indicatorClassName="text-primary"
            offset={["start start", "end end"]}
          />
        </div>
      </div>

      <article ref={article} className="space-y-8 px-6 pb-20 pt-2 sm:px-10">
        <div className="relative h-56 w-full overflow-hidden rounded-xl sm:h-64">
          <img
            src="https://picsum.photos/seed/editorial-motion/1000/500"
            alt="Engineering Motion"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <BookOpen className="size-3" />
              Engineering Guide
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" /> 4 min read
            </span>
          </div>

          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Zero-Jank Motion Pipelines
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A comprehensive study on coordinating GPU transforms, passive scroll
            observers, and spring physics for stutter-free web animations.
          </p>
        </div>

        <section className="space-y-2.5 rounded-xl border border-border bg-muted/40 p-5">
          <h4 className="text-sm font-semibold text-foreground">
            01. Spring Physics in the Render Loop
          </h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Traditional linear transitions often feel artificial and abrupt. By
            employing critically damped harmonic oscillator springs, motion
            adapts naturally to user gesture velocity and direction changes.
          </p>
        </section>

        <section className="space-y-2.5 rounded-xl border border-border bg-muted/40 p-5">
          <h4 className="text-sm font-semibold text-foreground">
            02. GPU Compositing & Off-Thread Layers
          </h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Isolating animated elements into dedicated compositor layers
            prevents expensive layout reflows and repaints. We leverage 3D matrix
            transforms to maintain a rock-solid 120 FPS.
          </p>
        </section>

        <section className="space-y-2.5 rounded-xl border border-border bg-muted/40 p-5">
          <h4 className="text-sm font-semibold text-foreground">
            03. Layout Containment & Resize Observability
          </h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Dynamic content injection often breaks scroll calculations. Using
            isolated resize observers attached directly to container boundaries
            ensures offset precision across all device viewports.
          </p>
        </section>
      </article>
    </div>
  )
}
