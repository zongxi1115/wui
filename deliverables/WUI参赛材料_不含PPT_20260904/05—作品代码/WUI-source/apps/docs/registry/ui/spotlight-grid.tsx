"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

export interface SpotlightGridProps extends React.ComponentProps<"div"> {
  /** Content rendered above the pattern. */
  children?: React.ReactNode
  /** Background pattern. @default "grid" */
  pattern?: "grid" | "dots"
  /** Pattern cell size in pixels. @default 28 */
  size?: number
  /** Radius of the revealed pointer spotlight in pixels. @default 240 */
  radius?: number
  /** CSS color used by the pattern. @default "currentColor" */
  patternColor?: string
  /** Opacity of the always-visible pattern. @default 0.1 */
  baseOpacity?: number
  /** Classes applied to both pattern layers. */
  patternClassName?: string
}

function patternImage(pattern: NonNullable<SpotlightGridProps["pattern"]>) {
  return pattern === "dots"
    ? "radial-gradient(circle, currentColor 1px, transparent 1.2px)"
    : "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)"
}

/** Reveals a grid or dot pattern around the current pointer position. */
function SpotlightGrid({
  children,
  pattern = "grid",
  size = 28,
  radius = 240,
  patternColor = "currentColor",
  baseOpacity = 0.1,
  className,
  patternClassName,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: SpotlightGridProps) {
  const revealRef = React.useRef<HTMLDivElement>(null)
  const backgroundImage = patternImage(pattern)
  const backgroundSize = `${size}px ${size}px`

  function update(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    const layer = revealRef.current
    if (!layer) return
    layer.style.setProperty("--grid-x", `${event.clientX - rect.left}px`)
    layer.style.setProperty("--grid-y", `${event.clientY - rect.top}px`)
  }

  return (
    <div
      data-slot="spotlight-grid"
      data-pattern={pattern}
      className={cn("relative isolate overflow-hidden", className)}
      onPointerEnter={(event) => {
        update(event)
        if (event.pointerType !== "touch" && revealRef.current)
          revealRef.current.style.opacity = "1"
        onPointerEnter?.(event)
      }}
      onPointerMove={(event) => {
        update(event)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        if (revealRef.current) revealRef.current.style.opacity = "0"
        onPointerLeave?.(event)
      }}
      {...props}
    >
      <div
        aria-hidden="true"
        data-slot="spotlight-grid-pattern"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10",
          patternClassName
        )}
        style={{
          color: patternColor,
          opacity: baseOpacity,
          backgroundImage,
          backgroundSize,
        }}
      />
      <div
        ref={revealRef}
        aria-hidden="true"
        data-slot="spotlight-grid-reveal"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-200",
          patternClassName
        )}
        style={
          {
            "--grid-x": "50%",
            "--grid-y": "50%",
            color: patternColor,
            backgroundImage,
            backgroundSize,
            maskImage: `radial-gradient(circle ${radius}px at var(--grid-x) var(--grid-y), black, transparent)`,
          } as React.CSSProperties
        }
      />
      {children}
    </div>
  )
}

export { SpotlightGrid }
