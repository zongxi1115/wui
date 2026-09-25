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
  /**
   * What activates the swap. `"hover"` listens on the component itself;
   * `"parent"` listens on the closest link or button (or the parent element),
   * so hovering the whole control — padding included — or focusing it with
   * the keyboard plays the swap. @default "hover"
   */
  trigger?: "hover" | "parent"
  /** Force the swapped state from outside the component. */
  active?: boolean
  /** Transition shared by both content layers. */
  transition?: Transition
}

/** Slides one whole content layer out while an identical layer enters. */
function SlideSwap({
  children,
  direction = "up",
  trigger = "hover",
  active,
  transition = { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  className,
  onPointerEnter,
  onPointerLeave,
  ...props
}: SlideSwapProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [hovered, setHovered] = React.useState(false)
  const reduceMotion = useReducedMotion()
  const swapped = active ?? hovered
  const travel = direction === "up" ? "-100%" : "100%"
  const incomingStart = direction === "up" ? "100%" : "-100%"
  const outgoingTarget = reduceMotion ? { y: 0 } : { y: swapped ? travel : 0 }
  const incomingTarget = reduceMotion
    ? { y: 0 }
    : { y: swapped ? 0 : incomingStart }

  React.useEffect(() => {
    const element = ref.current
    if (trigger !== "parent" || !element) return
    const target =
      element.parentElement?.closest<HTMLElement>(
        "a, button, [role='button'], [data-slide-swap-trigger]"
      ) ?? element.parentElement
    if (!target) return

    const enter = () => setHovered(true)
    const leave = () => setHovered(false)
    const focusIn = () => {
      if (target.matches(":focus-visible")) setHovered(true)
    }
    target.addEventListener("pointerenter", enter)
    target.addEventListener("pointerleave", leave)
    target.addEventListener("focusin", focusIn)
    target.addEventListener("focusout", leave)
    return () => {
      target.removeEventListener("pointerenter", enter)
      target.removeEventListener("pointerleave", leave)
      target.removeEventListener("focusin", focusIn)
      target.removeEventListener("focusout", leave)
    }
  }, [trigger])

  return (
    <motion.span
      ref={ref}
      data-slot="slide-swap"
      data-state={swapped ? "swapped" : "idle"}
      className={cn("relative inline-block overflow-hidden", className)}
      onPointerEnter={(event) => {
        if (trigger === "hover") setHovered(true)
        onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        if (trigger === "hover") setHovered(false)
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
