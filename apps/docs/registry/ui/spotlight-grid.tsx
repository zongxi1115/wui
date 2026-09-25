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
  /** Fade the always-visible pattern out toward the edges. @default false */
  fadeEdges?: boolean
  /** Let the spotlight trail the pointer with eased motion instead of snapping to it. @default true */
  smooth?: boolean
  /** Classes applied to both pattern layers. */
  patternClassName?: string
}

function patternImage(pattern: NonNullable<SpotlightGridProps["pattern"]>) {
  return pattern === "dots"
    ? "radial-gradient(circle, currentColor 1px, transparent 1.2px)"
    : "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)"
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Reveals a grid or dot pattern around the current pointer position. */
function SpotlightGrid({
  children,
  pattern = "grid",
  size = 28,
  radius = 240,
  patternColor = "currentColor",
  baseOpacity = 0.1,
  fadeEdges = false,
  smooth = true,
  className,
  style,
  patternClassName,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: SpotlightGridProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const target = React.useRef({ x: 0, y: 0 })
  const current = React.useRef({ x: 0, y: 0 })
  const frame = React.useRef(0)
  const lastTime = React.useRef(0)
  const backgroundImage = patternImage(pattern)
  const backgroundSize = `${size}px ${size}px`
  const edgeMask = "radial-gradient(ellipse at center, black 30%, transparent 80%)"

  React.useEffect(() => () => cancelAnimationFrame(frame.current), [])

  function paint() {
    const root = rootRef.current
    if (!root) return
    root.style.setProperty("--grid-x", `${current.current.x}px`)
    root.style.setProperty("--grid-y", `${current.current.y}px`)
  }

  function tick(time: number) {
    const dt = Math.min((time - lastTime.current) / 1000, 0.064)
    lastTime.current = time
    const ease = 1 - Math.exp(-dt * 12)
    current.current.x += (target.current.x - current.current.x) * ease
    current.current.y += (target.current.y - current.current.y) * ease
    paint()

    const remaining =
      Math.abs(target.current.x - current.current.x) +
      Math.abs(target.current.y - current.current.y)
    frame.current = remaining > 0.5 ? requestAnimationFrame(tick) : 0
  }

  function track(event: React.PointerEvent<HTMLDivElement>, jump: boolean) {
    const rect = event.currentTarget.getBoundingClientRect()
    target.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    if (jump || !smooth || prefersReducedMotion()) {
      current.current = { ...target.current }
      paint()
      return
    }

    if (!frame.current) {
      lastTime.current = performance.now()
      frame.current = requestAnimationFrame(tick)
    }
  }

  return (
    <div
      ref={rootRef}
      data-slot="spotlight-grid"
      data-pattern={pattern}
      className={cn("group/grid relative isolate overflow-hidden", className)}
      style={
        {
          "--grid-x": "50%",
          "--grid-y": "50%",
          ...style,
        } as React.CSSProperties
      }
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") {
          track(event, true)
          rootRef.current?.setAttribute("data-spotlight", "on")
        }
        onPointerEnter?.(event)
      }}
      onPointerMove={(event) => {
        if (event.pointerType !== "touch") track(event, false)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        rootRef.current?.removeAttribute("data-spotlight")
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
          maskImage: fadeEdges ? edgeMask : undefined,
        }}
      />
      <div
        aria-hidden="true"
        data-slot="spotlight-grid-reveal"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-data-[spotlight=on]/grid:opacity-100",
          patternClassName
        )}
        style={{
          color: patternColor,
          backgroundImage,
          backgroundSize,
          maskImage: `radial-gradient(circle ${radius}px at var(--grid-x) var(--grid-y), black, transparent)`,
        }}
      />
      {children}
    </div>
  )
}

export { SpotlightGrid }
