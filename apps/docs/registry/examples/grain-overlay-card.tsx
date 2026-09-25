import { GrainOverlay } from "@/registry/ui/grain-overlay"

const surfaces = [
  { label: "无颗粒", opacity: 0 },
  { label: "soft-light 0.25", opacity: 0.25 },
  { label: "soft-light 0.5", opacity: 0.5 },
]

export default function GrainOverlayCard() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
      {surfaces.map((surface) => (
        <figure key={surface.label}>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-[var(--chart-1)]">
            {surface.opacity > 0 ? (
              <GrainOverlay opacity={surface.opacity} />
            ) : null}
            <p className="absolute bottom-4 left-4 text-lg font-semibold text-white">
              Aa
            </p>
          </div>
          <figcaption className="text-muted-foreground mt-2 font-mono text-xs">
            {surface.label}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
