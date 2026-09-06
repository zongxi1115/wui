import { ArrowUpRightIcon, SparklesIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { HoverMarquee } from "@/registry/ui/hover-marquee"

const projects = [
  {
    number: "01",
    title: "Hyperion Design System",
    category: "Tokens & Motion",
    client: "Acme Platform",
    year: "2026",
  },
  {
    number: "02",
    title: "Neural Canvas Studio",
    category: "WebGL Shaders",
    client: "Studio Flux",
    year: "2025",
  },
  {
    number: "03",
    title: "Kinetic Gesture Engine",
    category: "Physics & Touch",
    client: "Monolith Labs",
    year: "2025",
  },
  {
    number: "04",
    title: "Spatial Vector Cache",
    category: "HNSW Clustering",
    client: "Vector AI",
    year: "2024",
  },
]

export default function HoverMarqueeDemo() {
  return (
    <div className="w-full max-w-3xl border-y">
      {projects.map((project, index) => (
        <HoverMarquee
          key={project.number}
          tabIndex={0}
          speed={110}
          reverse={index % 2 === 1}
          marquee={
            <div className="flex shrink-0 items-center gap-6 whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-[0.14em]">
              <span className="flex items-center gap-1.5">
                <SparklesIcon className="size-3.5" />
                {project.title}
              </span>
              <span className="size-1.5 rounded-full bg-background/50" />
              <span className="font-mono text-[11px] opacity-80">
                [{project.category}]
              </span>
              <span className="size-1.5 rounded-full bg-background/50" />
              <span className="flex items-center gap-1">
                View Case Study
                <ArrowUpRightIcon className="size-3.5" />
              </span>
            </div>
          }
          className="focus-visible:ring-ring/40 border-b outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 last:border-b-0"
          marqueeClassName="bg-foreground text-background"
        >
          <div className="flex h-14 items-center justify-between gap-4 px-4 text-sm sm:h-16">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {project.number}
              </span>
              <span className="font-medium tracking-tight sm:text-base">
                {project.title}
              </span>
              <Badge
                variant="secondary"
                className="hidden text-[11px] font-normal text-muted-foreground sm:inline-flex"
              >
                {project.category}
              </Badge>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-muted-foreground hidden text-xs md:inline-flex">
                {project.client}
              </span>
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {project.year}
              </span>
              <ArrowUpRightIcon className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </HoverMarquee>
      ))}
    </div>
  )
}
