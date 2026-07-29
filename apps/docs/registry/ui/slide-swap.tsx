"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface SlideSwapProps extends Omit<
  HTMLMotionProps<"span">,
  "children" | "transition"
> {
  /** Content duplicated for the outgoing and incoming layers. */
  children: React.ReactNode
  /** Direction the visible layer leaves. @default "up" */
  direction?: "up" | "down"
  /** Force the swapped state from outside the component. */
  active?: boolean
  /** Transition shared by both content layers. */
  transition?: Transition
}

/** Slides one whole content layer out while an identical layer enters. */
function SlideSwap({
  children,
  direction = "up",
  active,
  transition = { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  className,
  onPointerEnter,
  onPointerLeave,
  ...props
}: SlideSwapProps) {
  const [hovered, setHovered] = React.useState(false)
  const reduceMotion = useReducedMotion()
  const swapped = active ?? hovered
  const travel = direction === "up" ? "-100%" : "100%"
  const incomingStart = direction === "up" ? "100%" : "-100%"
  const outgoingTarget = reduceMotion ? { y: 0 } : { y: swapped ? travel : 0 }
  const incomingTarget = reduceMotion
    ? { y: 0 }
    : { y: swapped ? 0 : incomingStart }

  return (
    <motion.span
      data-slot="slide-swap"
      className={cn("relative inline-block overflow-hidden", className)}
      onPointerEnter={(event) => {
        setHovered(true)
        onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        setHovered(false)
        onPointerLeave?.(event)
      }}
      {...props}
    >
      <motion.span
        data-slot="slide-swap-layer"
        className="block"
        initial={false}
        animate={outgoingTarget}
        transition={transition}
      >
        {children}
      </motion.span>
      <motion.span
        aria-hidden="true"
        inert
        data-slot="slide-swap-layer"
        className="absolute inset-x-0 top-0 block"
        initial={false}
        animate={incomingTarget}
        transition={transition}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

export { SlideSwap }
