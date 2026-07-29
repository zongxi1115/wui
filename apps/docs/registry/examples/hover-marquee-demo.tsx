import { ArrowUpRightIcon } from "lucide-react"

import { HoverMarquee } from "@/registry/ui/hover-marquee"

const projects = [
  { number: "01", title: "Editorial Systems", year: "2026" },
  { number: "02", title: "Spatial Archive", year: "2025" },
  { number: "03", title: "Motion Studies", year: "2024" },
  { number: "04", title: "Object Index", year: "2023" },
]

export default function HoverMarqueeDemo() {
  return (
    <div className="w-full max-w-2xl border-t">
      {projects.map((project, index) => (
        <HoverMarquee
          key={project.number}
          tabIndex={0}
          reverse={index % 2 === 1}
          marquee={
            <div className="flex shrink-0 items-center gap-8 whitespace-nowrap px-2 text-sm font-medium uppercase tracking-[0.14em]">
              <span>{project.title}</span>
              <span className="bg-foreground size-1.5 rounded-full" />
              <span>View project</span>
              <ArrowUpRightIcon className="size-4" />
            </div>
          }
          className="focus-visible:ring-ring/40 border-b outline-none focus-visible:ring-2"
          marqueeClassName="bg-foreground text-background"
        >
          <div className="grid h-12 grid-cols-[3rem_1fr_auto] items-center gap-3 px-2 text-sm">
            <span className="text-muted-foreground tabular-nums">
              {project.number}
            </span>
            <span className="font-medium">{project.title}</span>
            <span className="text-muted-foreground tabular-nums">
              {project.year}
            </span>
          </div>
        </HoverMarquee>
      ))}
    </div>
  )
}
