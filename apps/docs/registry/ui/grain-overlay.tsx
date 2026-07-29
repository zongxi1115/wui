import * as React from "react"

import { cn } from "@/registry/lib/utils"

export interface GrainOverlayProps extends Omit<
  React.ComponentProps<"svg">,
  "opacity"
> {
  /** Grain opacity. @default 0.16 */
  opacity?: number
  /** Base turbulence frequency. @default 0.72 */
  frequency?: number
  /** Number of fractal noise octaves. @default 3 */
  octaves?: number
  /** Deterministic noise seed. @default 8 */
  seed?: number
  /** CSS blend mode used by the overlay. @default "soft-light" */
  blendMode?: React.CSSProperties["mixBlendMode"]
}

/** Adds a scalable SVG fractal-noise texture over a positioned surface. */
function GrainOverlay({
  opacity = 0.16,
  frequency = 0.72,
  octaves = 3,
  seed = 8,
  blendMode = "soft-light",
  className,
  style,
  ...props
}: GrainOverlayProps) {
  const filterId = `grain-${React.useId().replaceAll(":", "")}`

  return (
    <svg
      aria-hidden="true"
      data-slot="grain-overlay"
      className={cn(
        "pointer-events-none absolute inset-0 size-full select-none",
        className
      )}
      style={{ ...style, opacity, mixBlendMode: blendMode }}
      {...props}
    >
      <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={frequency}
          numOctaves={octaves}
          seed={seed}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  )
}

export { GrainOverlay }
