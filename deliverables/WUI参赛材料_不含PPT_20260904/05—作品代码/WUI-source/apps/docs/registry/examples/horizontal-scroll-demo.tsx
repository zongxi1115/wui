"use client"

import * as React from "react"
import { ArrowRight, Sparkles } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { HorizontalScroll } from "@/registry/ui/horizontal-scroll"

const caseStudies = [
  {
    tag: "FINTECH",
    title: "High-Frequency Settlement Engine",
    company: "Apex Global Capital",
    metric: "80k tx/sec",
    image: "https://picsum.photos/seed/fintech-trading/700/400",
    desc: "Migrated mission-critical trading pipeline with zero packet drop and sub-millisecond edge resolution.",
  },
  {
    tag: "AI RESEARCH",
    title: "Autonomous Agent Clusters",
    company: "Synthetix AI Lab",
    metric: "16x faster",
    image: "https://picsum.photos/seed/neural-agent/700/400",
    desc: "Parallelized multi-step reasoning models with dynamic vector caching and instant state hydration.",
  },
  {
    tag: "MEDIA STREAMING",
    title: "Low-Latency Global Distribution",
    company: "Vortex Media Cloud",
    metric: "150M viewers",
    image: "https://picsum.photos/seed/media-stream/700/400",
    desc: "Synchronized live 4K video canvas and interactive chat streams across 320+ edge point-of-presence nodes.",
  },
]

export default function HorizontalScrollDemo() {
  const container = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={container}
      className="relative h-[32rem] w-full overflow-y-auto rounded-2xl border border-border bg-card text-card-foreground shadow-lg [scrollbar-width:thin]"
    >
      <HorizontalScroll container={container} trackClassName="items-stretch gap-6 p-6 sm:p-8">
        {/* Intro Section */}
        <section className="flex h-full w-[20rem] shrink-0 flex-col justify-between rounded-2xl border border-border bg-muted/40 p-6 sm:w-[22rem]">
          <div>
            <Badge variant="outline" className="text-xs">
              <Sparkles className="size-3 text-sky-500" />
              CASE STUDIES
            </Badge>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Proven at Global Scale
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Scroll down inside this box to glide horizontally through featured
              enterprise deployments.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-400">
            <span>Scroll vertically to slide</span>
            <ArrowRight className="size-4 animate-pulse" />
          </div>
        </section>

        {/* Case Study Cards */}
        {caseStudies.map((item, idx) => (
          <article
            key={item.title}
            className="relative flex h-full w-[24rem] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-md sm:w-[26rem]"
          >
            <div>
              <div className="relative h-40 w-full overflow-hidden rounded-xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="size-full object-cover"
                />
                <div className="absolute left-3 top-3">
                  <Badge
                    variant="outline"
                    className="border-white/30 bg-black/40 text-[10px] text-white backdrop-blur-md"
                  >
                    {item.tag}
                  </Badge>
                </div>
                <span className="absolute bottom-2 right-3 font-mono text-xs text-white drop-shadow">
                  0{idx + 1} / 03
                </span>
              </div>

              <div className="mt-3 text-xs font-medium text-muted-foreground">
                {item.company}
              </div>
              <h4 className="mt-1 text-lg font-semibold text-foreground">
                {item.title}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {item.desc}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Impact Benchmark
                </div>
                <div className="text-base font-bold tracking-tight text-foreground">
                  {item.metric}
                </div>
              </div>
              <Button size="sm" variant="outline">
                View Report
              </Button>
            </div>
          </article>
        ))}
      </HorizontalScroll>
    </div>
  )
}
