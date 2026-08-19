import { LayersIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { GrainOverlay } from "@/registry/ui/grain-overlay"

export default function GrainOverlayCard() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2 p-4">
      {/* Clean Gradient with Subtle Grain */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 text-white shadow-lg">
        <GrainOverlay opacity={0.28} blendMode="soft-light" />
        <div className="relative z-10">
          <Badge variant="outline" className="border-white/20 text-[10px] text-white">
            <LayersIcon className="mr-1 size-3" />
            Tactile Surface
          </Badge>
          <h4 className="mt-4 text-base font-semibold">Film Grain Texture</h4>
          <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
            Procedural SVG noise removes artificial banding from dark mode gradients.
          </p>
        </div>
      </div>

      {/* Vibrant Gradient with Grain */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 p-6 text-white shadow-lg">
        <GrainOverlay opacity={0.35} blendMode="overlay" />
        <div className="relative z-10">
          <Badge variant="outline" className="border-white/20 text-[10px] text-white">
            Cinematic
          </Badge>
          <h4 className="mt-4 text-base font-semibold">Atmospheric Depth</h4>
          <p className="mt-1 text-xs text-indigo-200 leading-relaxed">
            Adds organic, tactile warmth to cards, banners, and modal surfaces.
          </p>
        </div>
      </div>
    </div>
  )
}
