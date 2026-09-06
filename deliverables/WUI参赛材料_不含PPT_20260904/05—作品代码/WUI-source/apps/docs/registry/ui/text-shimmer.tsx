"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface TextShimmerProps extends React.ComponentProps<"span"> {
  /** Text carrying the shimmer. */
  children: string
  /** HTML element rendered by the component. @default "span" */
  as?: React.ElementType
  /** Seconds for one shimmer pass. @default 2 */
  duration?: number
  /** Gradient width relative to the text. @default 2 */
  spread?: number
}

/** Sweeps a theme-aware highlight across text. */
function TextShimmer({
  children,
  as = "span",
  duration = 2,
  spread = 2,
  className,
  style,
  ...props
}: TextShimmerProps) {
  const reduceMotion = useReducedMotion()
  const Component = React.useMemo(() => motion.create(as), [as])
  const shimmerSpread = `${Math.max(Array.from(children).length * spread, 0)}px`

  return (
    <Component
      data-slot="text-shimmer"
      className={cn(
        "inline-block bg-clip-text text-transparent [--shimmer-base:var(--muted-foreground)] [--shimmer-highlight:var(--foreground)]",
        className
      )}
      style={{
        backgroundImage: reduceMotion
          ? "linear-gradient(var(--shimmer-base),var(--shimmer-base))"
          : "linear-gradient(90deg,transparent calc(50% - var(--shimmer-spread)),var(--shimmer-highlight),transparent calc(50% + var(--shimmer-spread))),linear-gradient(var(--shimmer-base),var(--shimmer-base))",
        backgroundRepeat: "no-repeat",
        backgroundSize: "250% 100%, auto",
        "--shimmer-spread": shimmerSpread,
        ...style,
      } as React.CSSProperties}
      animate={
        reduceMotion
          ? { backgroundPosition: "100% center" }
          : { backgroundPosition: ["100% center", "0% center"] }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration, ease: "linear", repeat: Infinity }
      }
      {...props}
    >
      {children}
    </Component>
  )
}

export { TextShimmer }
