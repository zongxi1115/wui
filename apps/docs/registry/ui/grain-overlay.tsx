"use client"

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
  /** Jitter the grain like projected film. The parent must clip overflow. @default false */
  animated?: boolean
  /** Grain frames per second when `animated` is enabled. @default 10 */
  fps?: number
}

/** Adds a scalable SVG fractal-noise texture over a positioned surface. */
function GrainOverlay({
  opacity = 0.16,
  frequency = 0.72,
  octaves = 3,
  seed = 8,
  blendMode = "soft-light",
  animated = false,
  fps = 10,
  className,
  style,
  ...props
}: GrainOverlayProps) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const filterId = `grain-${React.useId().replaceAll(":", "")}`

  React.useEffect(() => {
    const svg = svgRef.current
    if (!animated || !svg) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // The oversized layer is shifted between random offsets; the noise itself is rasterized once.
    const timer = window.setInterval(() => {
      const x = (Math.random() * 2 - 1) * 10
      const y = (Math.random() * 2 - 1) * 10
      svg.style.transform = `translate3d(${x}%, ${y}%, 0)`
    }, 1000 / fps)

    return () => window.clearInterval(timer)
  }, [animated, fps])

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      data-slot="grain-overlay"
      className={cn(
        "pointer-events-none absolute inset-0 size-full select-none",
        className
      )}
      style={{
        ...(animated && {
          inset: "-50%",
          width: "200%",
          height: "200%",
          willChange: "transform",
        }),
        ...style,
        opacity,
        mixBlendMode: blendMode,
      }}
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
