"use client"

import * as React from "react"
import { motion, useReducedMotion, type Transition } from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface BorderBeamProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Length of the beam along the border, in pixels. @default 80 */
  size?: number
  /** Seconds for one full lap. @default 6 */
  duration?: number
  /** Seconds to offset the start, useful to stagger several beams. @default 0 */
  delay?: number
  /** Thickness of the beam; match the border width of the parent. @default 1 */
  borderWidth?: number
  /** Beam colour. Any CSS colour or variable. @default "var(--primary)" */
  color?: string
  /** Travel counter-clockwise. @default false */
  reverse?: boolean
  /** Starting position along the border, from 0 to 100. @default 0 */
  initialOffset?: number
  /** Overrides the looping transition. */
  transition?: Transition
}

/**
 * A short light beam that travels along the border of its parent. Place it as
 * the last child of a `relative` element with a border radius; the beam sits
 * exactly on the parent's border and inherits its radius.
 */
function BorderBeam({
  size = 80,
  duration = 6,
  delay = 0,
  borderWidth = 1,
  color = "var(--primary)",
  reverse = false,
  initialOffset = 0,
  transition,
  className,
  style,
  ...props
}: BorderBeamProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [radius, setRadius] = React.useState(0)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    setRadius(Number.parseFloat(getComputedStyle(node).borderTopLeftRadius))
  }, [])

  if (reduceMotion) return null

  const start = `${initialOffset}%`
  const end = `${reverse ? initialOffset - 100 : initialOffset + 100}%`

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="border-beam"
      className={cn("pointer-events-none absolute rounded-[inherit]", className)}
      style={{
        inset: -borderWidth,
        padding: borderWidth,
        maskImage: "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
        maskClip: "content-box, border-box",
        maskComposite: "exclude",
        ...style,
      }}
      {...props}
    >
      <motion.div
        data-slot="border-beam-light"
        className="absolute aspect-square"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${radius}px)`,
          background: `linear-gradient(${reverse ? "to right" : "to left"}, ${color}, transparent)`,
        }}
        initial={{ offsetDistance: start }}
        animate={{ offsetDistance: [start, end] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  )
}

export { BorderBeam }
