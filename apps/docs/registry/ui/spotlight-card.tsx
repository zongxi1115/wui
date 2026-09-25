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
  /** CSS color of a 1px edge highlight that follows the pointer. Omit to disable. */
  borderColor?: string
  /** Let the light trail the pointer with eased motion instead of snapping to it. @default true */
  smooth?: boolean
  /** Classes applied to the spotlight layer. */
  spotlightClassName?: string
}

const edgeMask: React.CSSProperties = {
  maskImage: "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
  maskClip: "content-box, border-box",
  maskOrigin: "content-box, border-box",
  maskComposite: "exclude",
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Illuminates a surface around the current pointer position. */
function SpotlightCard({
  children,
  radius = 220,
  color = "color-mix(in oklab, var(--foreground) 16%, transparent)",
  borderColor,
  smooth = true,
  className,
  style,
  spotlightClassName,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: SpotlightCardProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const target = React.useRef({ x: 0, y: 0 })
  const current = React.useRef({ x: 0, y: 0 })
  const frame = React.useRef(0)
  const lastTime = React.useRef(0)

  React.useEffect(() => () => cancelAnimationFrame(frame.current), [])

  function paint() {
    const root = rootRef.current
    if (!root) return
    root.style.setProperty("--spotlight-x", `${current.current.x}px`)
    root.style.setProperty("--spotlight-y", `${current.current.y}px`)
  }

  function tick(time: number) {
    const dt = Math.min((time - lastTime.current) / 1000, 0.064)
    lastTime.current = time
    const ease = 1 - Math.exp(-dt * 14)
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
      data-slot="spotlight-card"
      className={cn("group/spotlight relative isolate overflow-hidden", className)}
      style={
        {
          "--spotlight-x": "50%",
          "--spotlight-y": "50%",
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
        data-slot="spotlight-card-light"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-data-[spotlight=on]/spotlight:opacity-100",
          spotlightClassName
        )}
        style={{
          background: `radial-gradient(circle ${radius}px at var(--spotlight-x) var(--spotlight-y), ${color}, transparent 72%)`,
        }}
      />
      {borderColor ? (
        <div
          aria-hidden="true"
          data-slot="spotlight-card-edge"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] p-px opacity-0 transition-opacity duration-300 group-data-[spotlight=on]/spotlight:opacity-100"
          style={{
            background: `radial-gradient(circle ${radius * 0.75}px at var(--spotlight-x) var(--spotlight-y), ${borderColor}, transparent 70%)`,
            ...edgeMask,
          }}
        />
      ) : null}
      {children}
    </div>
  )
}

export { SpotlightCard }
