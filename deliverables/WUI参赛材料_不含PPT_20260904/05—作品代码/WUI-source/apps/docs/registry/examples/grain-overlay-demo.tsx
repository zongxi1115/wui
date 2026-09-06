import { ArrowUpRight, BookOpen, Clock, Sparkles } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { GrainOverlay } from "@/registry/ui/grain-overlay"

export default function GrainOverlayDemo() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-lg">
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <img
          src="https://picsum.photos/seed/arch-grain/1200/600"
          alt="Modern Architecture"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        {/* Grain overlay on top of photo */}
        <GrainOverlay opacity={0.35} blendMode="overlay" />

        <div className="absolute left-6 top-6 flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-white/30 bg-black/40 text-xs text-white backdrop-blur-md"
          >
            <Sparkles className="size-3 text-amber-300" />
            ESSAY № 04
          </Badge>
        </div>
      </div>

      <div className="relative z-10 -mt-10 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Design Systems Lab
          </span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            <span>5 min read</span>
          </div>
        </div>

        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Tactile Digitality: When Noise Becomes Atmosphere
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Digital photography and UI surfaces often look flat without texture.
          By introducing a subtle SVG fractal grain overlay, surfaces acquire
          tactile depth, material presence, and cinematic warmth across high-density layouts.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-muted font-mono text-xs font-bold text-foreground">
              WL
            </div>
            <div>
              <div className="text-xs font-medium text-foreground">
                WUI Editorial
              </div>
              <div className="text-[11px] text-muted-foreground">
                Visual Research Team
              </div>
            </div>
          </div>

          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <BookOpen className="size-3.5" />
            Read Full Piece
            <ArrowUpRight className="size-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  )
}
