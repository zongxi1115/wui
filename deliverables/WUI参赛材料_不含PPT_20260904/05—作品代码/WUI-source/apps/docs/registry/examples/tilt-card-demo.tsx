import { ArrowUpRight, Camera } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { TiltCard } from "@/registry/ui/tilt-card"

const cards = [
  {
    tag: "ARCHITECTURAL",
    title: "The Concrete Monolith",
    series: "№ 01 / 03",
    image: "https://picsum.photos/seed/arch-monolith/600/700",
  },
  {
    tag: "AERIAL COAST",
    title: "The Azure Horizon",
    series: "№ 02 / 03",
    image: "https://picsum.photos/seed/azure-horizon/600/700",
  },
  {
    tag: "SPATIAL STUDIO",
    title: "Kinetic Geometry",
    series: "№ 03 / 03",
    image: "https://picsum.photos/seed/kinetic-geo/600/700",
  },
]

export default function TiltCardDemo() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 [perspective:1000px] md:grid-cols-3">
      {cards.map((card) => (
        <TiltCard
          key={card.title}
          maxTilt={10}
          hoverScale={1.03}
          glare
          className="relative h-80 w-full overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-lg"
          glareClassName="mix-blend-overlay opacity-40"
        >
          <img
            src={card.image}
            alt={card.title}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

          {/* 3D Floating Layers */}
          <div className="relative flex h-full flex-col justify-between p-6 text-white [transform:translateZ(32px)]">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="border-white/30 bg-black/40 text-[10px] text-white backdrop-blur-md"
              >
                <Camera className="size-3 text-sky-300" />
                {card.tag}
              </Badge>

              <span className="font-mono text-xs text-white/70">
                {card.series}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold tracking-tight text-white">
                  {card.title}
                </h4>
                <ArrowUpRight className="size-4 text-white/80" />
              </div>
              <p className="mt-1 text-[11px] text-white/70">
                Hover to tilt perspective in 3D space
              </p>
            </div>
          </div>
        </TiltCard>
      ))}
    </div>
  )
}
