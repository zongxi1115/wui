"use client"

import * as React from "react"
import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition,
  type UseInViewOptions,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface TextHighlightProps
  extends Omit<HTMLMotionProps<"span">, "children" | "transition" | "color"> {
  /** Text to highlight. Wrapped lines are swept one after another. */
  children: React.ReactNode
  /** When the sweep plays. @default "inView" */
  trigger?: "inView" | "hover" | "always"
  /** Controlled highlight state, e.g. driven by hovering a parent row. Overrides `trigger`. */
  active?: boolean
  /** `block` covers the full line height, `underline` a marker band at the bottom. @default "block" */
  variant?: "block" | "underline"
  /** Highlight colour. Any CSS colour or variable. */
  color?: string
  /** Side the sweep starts from. @default "left" */
  from?: "left" | "right"
  /** Seconds before the sweep starts. @default 0 */
  delay?: number
  /** Seconds the sweep takes. @default 0.8 */
  duration?: number
  /** Transition of the sweep; overrides `delay` and `duration`. */
  transition?: Transition
  /** Play only the first time the text enters the viewport. @default true */
  once?: boolean
  /** Intersection options used when `trigger` is `inView`. */
  viewOptions?: Omit<UseInViewOptions, "once">
}

const bandHeight = { block: "100%", underline: "38%" } as const

/**
 * Sweeps a marker-style highlight behind inline text when it scrolls into
 * view, on hover, or immediately.
 */
function TextHighlight({
  children,
  trigger = "inView",
  active: activeProp,
  variant = "block",
  color = "color-mix(in oklab, var(--primary) 12%, transparent)",
  from = "left",
  delay = 0,
  duration = 0.8,
  transition,
  once = true,
  viewOptions,
  className,
  style,
  onPointerEnter,
  onPointerLeave,
  ...props
}: TextHighlightProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, { ...viewOptions, once })
  const [hovered, setHovered] = React.useState(false)

  const active =
    activeProp ??
    (trigger === "always" ? true : trigger === "hover" ? hovered : inView)
  const height = bandHeight[variant]

  return (
    <motion.span
      ref={ref}
      data-slot="text-highlight"
      data-active={active ? "" : undefined}
      className={cn("bg-no-repeat", className)}
      style={{
        backgroundImage: `linear-gradient(${color}, ${color})`,
        backgroundPosition: `${from === "left" ? "0%" : "100%"} 100%`,
        ...style,
      }}
      initial={{ backgroundSize: `0% ${height}` }}
      animate={{ backgroundSize: `${active ? 100 : 0}% ${height}` }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              duration,
              delay: active ? delay : 0,
              ease: [0.22, 1, 0.36, 1],
              ...transition,
            }
      }
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
      {children}
    </motion.span>
  )
}

export { TextHighlight }
