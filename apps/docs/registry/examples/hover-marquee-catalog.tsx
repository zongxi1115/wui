import { ArrowRightIcon, BoxIcon } from "lucide-react"

import { HoverMarquee } from "@/registry/ui/hover-marquee"

const services = [
  {
    code: "PKG-01",
    name: "Design Engineering",
    highlights: ["React 19", "Tailwind CSS v4", "Motion v12", "Accessible Primitives"],
  },
  {
    code: "PKG-02",
    name: "Generative AI Workflows",
    highlights: ["Speculative Stream", "Agent Protocol", "Vector Search", "LLM Reasoning"],
  },
  {
    code: "PKG-03",
    name: "Interactive Graphics",
    highlights: ["WebGL Shaders", "Canvas 2D", "Fluid Particles", "Spatial Layout"],
  },
]

export default function HoverMarqueeCatalogDemo() {
  return (
    <div className="w-full max-w-2xl border-y">
      {services.map((service, index) => (
        <HoverMarquee
          key={service.code}
          tabIndex={0}
          speed={90}
          reverse={index % 2 === 1}
          marquee={
            <div className="flex shrink-0 items-center gap-4 whitespace-nowrap px-4 font-mono text-xs uppercase tracking-wider">
              {service.highlights.map((item) => (
                <span
                  key={item}
                  className="bg-background/20 rounded-md px-2.5 py-1 text-[11px]"
                >
                  {item}
                </span>
              ))}
            </div>
          }
          className="focus-visible:ring-ring/40 border-b outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 last:border-b-0"
          marqueeClassName="bg-primary text-primary-foreground"
        >
          <div className="flex h-14 items-center justify-between px-4 text-sm">
            <div className="flex items-center gap-3">
              <BoxIcon className="text-muted-foreground size-4" />
              <span className="font-mono text-xs text-muted-foreground">
                {service.code}
              </span>
              <span className="font-medium">{service.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Preview stack</span>
              <ArrowRightIcon className="size-3.5" />
            </div>
          </div>
        </HoverMarquee>
      ))}
    </div>
  )
}
