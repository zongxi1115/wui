import { ArrowDown, Bot, Globe, Zap } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { ScrollSnap, ScrollSnapItem } from "@/registry/ui/scroll-snap"

const slides = [
  {
    number: "01",
    tag: "REACTIVITY",
    title: "Sub-Millisecond State Flow",
    description:
      "Fine-grained reactive primitives update the DOM directly with zero unnecessary component re-renders.",
    metric: "< 1ms Jitter",
    image: "https://picsum.photos/seed/snap-ocean/1000/600",
    icon: Zap,
  },
  {
    number: "02",
    tag: "AI CO-PILOT",
    title: "Agentic Reasoning Pipeline",
    description:
      "Deploy context-aware AI tools and token-streaming workflows directly into your edge infrastructure.",
    metric: "140 tps Stream Rate",
    image: "https://picsum.photos/seed/snap-monolith/1000/600",
    icon: Bot,
  },
  {
    number: "03",
    tag: "ENTERPRISE MESH",
    title: "Zero-Downtime Edge Distribution",
    description:
      "Synchronize distributed state across 320+ edge regions with automated cryptographic key rotation.",
    metric: "99.999% SLA",
    image: "https://picsum.photos/seed/snap-geometric/1000/600",
    icon: Globe,
  },
]

export default function ScrollSnapDemo() {
  return (
    <ScrollSnap
      className="h-[32rem] w-full rounded-2xl border border-border bg-card text-card-foreground shadow-lg"
      hideScrollbar
    >
      {slides.map((slide) => {
        const Icon = slide.icon
        return (
          <ScrollSnapItem
            key={slide.number}
            stop
            className="relative flex h-full flex-col justify-between overflow-hidden border-b border-border p-8 last:border-0 sm:p-10"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-white/30 bg-black/40 text-xs text-white backdrop-blur-md"
                >
                  <Icon className="size-3 text-sky-300" />
                  {slide.tag}
                </Badge>
                <span className="font-mono text-xs text-white/80">
                  SLIDE {slide.number} / 03
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-white/80">
                <span>Scroll to snap</span>
                <ArrowDown className="size-3.5 animate-bounce text-white" />
              </div>
            </div>

            <div className="relative z-10 my-auto max-w-xl space-y-3 text-white">
              <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                {slide.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                {slide.description}
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-4 text-white">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-400">
                  Benchmark
                </div>
                <div className="text-base font-bold tracking-tight text-white">
                  {slide.metric}
                </div>
              </div>

              <Button
                size="sm"
                className="bg-white text-zinc-950 hover:bg-zinc-100"
              >
                Learn More
              </Button>
            </div>
          </ScrollSnapItem>
        )
      })}
    </ScrollSnap>
  )
}
