"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

export interface SpotlightCardProps extends React.ComponentProps<"div"> {
  /** Content rendered above the pointer spotlight. */
  children: React.ReactNode
  /** Spotlight radius in pixels. @default 220 */
  radius?: number
  /** CSS color used at the center of the spotlight. @default "color-mix(in oklab, var(--foreground) 16%, transparent)" */
  color?: string
  /** Classes applied to the spotlight layer. */
  spotlightClassName?: string
}

/** Illuminates a surface around the current pointer position. */
function SpotlightCard({
  children,
  radius = 220,
  color = "color-mix(in oklab, var(--foreground) 16%, transparent)",
  className,
  spotlightClassName,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: SpotlightCardProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const spotlightRef = React.useRef<HTMLDivElement>(null)

  function updateSpotlight(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    const layer = spotlightRef.current
    if (!layer) return
    layer.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`)
    layer.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={rootRef}
      data-slot="spotlight-card"
      className={cn("relative isolate overflow-hidden", className)}
      onPointerEnter={(event) => {
        updateSpotlight(event)
        if (event.pointerType !== "touch" && spotlightRef.current) {
          spotlightRef.current.style.opacity = "1"
        }
        onPointerEnter?.(event)
      }}
      onPointerMove={(event) => {
        updateSpotlight(event)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        if (spotlightRef.current) spotlightRef.current.style.opacity = "0"
        onPointerLeave?.(event)
      }}
      {...props}
    >
      <div
        ref={spotlightRef}
        aria-hidden="true"
        data-slot="spotlight-card-light"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-200",
          spotlightClassName
        )}
        style={
          {
            "--spotlight-x": "50%",
            "--spotlight-y": "50%",
            background: `radial-gradient(circle ${radius}px at var(--spotlight-x) var(--spotlight-y), ${color}, transparent 72%)`,
          } as React.CSSProperties
        }
      />
      {children}
    </div>
  )
}

export { SpotlightCard }
