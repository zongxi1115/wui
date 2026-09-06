import { MousePointer2 } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { ImageTrail } from "@/registry/ui/image-trail"

const trailImages = [
  <div
    key="trail-1"
    className="h-24 w-36 overflow-hidden rounded-xl border border-border/80 bg-card p-1 shadow-xl"
  >
    <img
      src="https://picsum.photos/seed/trail-art1/300/200"
      alt="Gallery Snapshot 1"
      className="size-full rounded-lg object-cover"
    />
  </div>,
  <div
    key="trail-2"
    className="h-24 w-36 overflow-hidden rounded-xl border border-border/80 bg-card p-1 shadow-xl"
  >
    <img
      src="https://picsum.photos/seed/trail-art2/300/200"
      alt="Gallery Snapshot 2"
      className="size-full rounded-lg object-cover"
    />
  </div>,
  <div
    key="trail-3"
    className="h-24 w-36 overflow-hidden rounded-xl border border-border/80 bg-card p-1 shadow-xl"
  >
    <img
      src="https://picsum.photos/seed/trail-art3/300/200"
      alt="Gallery Snapshot 3"
      className="size-full rounded-lg object-cover"
    />
  </div>,
  <div
    key="trail-4"
    className="h-24 w-36 overflow-hidden rounded-xl border border-border/80 bg-card p-1 shadow-xl"
  >
    <img
      src="https://picsum.photos/seed/trail-art4/300/200"
      alt="Gallery Snapshot 4"
      className="size-full rounded-lg object-cover"
    />
  </div>,
]

export default function ImageTrailDemo() {
  return (
    <ImageTrail
      items={trailImages}
      distance={52}
      lifetime={750}
      className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/20 p-8 text-foreground shadow-sm"
      itemClassName="pointer-events-none drop-shadow-xl"
    >
      {/* Background dot pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:20px_20px] opacity-70" />

      <div className="pointer-events-none relative z-20 flex max-w-md flex-col items-center text-center">
        <Badge
          variant="outline"
          className="mb-4 bg-background/80 text-xs text-foreground backdrop-blur-sm"
        >
          <MousePointer2 className="size-3 text-sky-500" />
          Interactive Cursor Canvas
        </Badge>

        <h3 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Move your cursor around
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Leave dynamic visual photo cards trailing along your movement path in
          real time.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-md border border-border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground shadow-xs">
            Spatial Physics
          </span>
          <span className="rounded-md border border-border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground shadow-xs">
            Auto-Fade Cleanup
          </span>
          <span className="rounded-md border border-border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground shadow-xs">
            Smooth Velocity
          </span>
        </div>
      </div>
    </ImageTrail>
  )
}
