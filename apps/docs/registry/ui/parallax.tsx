"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
  type UseScrollOptions,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface ParallaxProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  /** Content translated as the wrapper crosses the viewport. */
  children: React.ReactNode
  /** Translation axis. @default "y" */
  axis?: "x" | "y"
  /** Translation range in pixels from scroll start to end. @default [-48, 48] */
  distance?: [number, number]
  /** Optional scale range, useful for image-within-frame parallax. */
  scale?: [number, number]
  /** Scrollable element to observe instead of the page. */
  container?: React.RefObject<HTMLElement | null>
  /** Motion scroll offsets for the wrapper. @default ["start end", "end start"] */
  offset?: UseScrollOptions["offset"]
}

/** Moves a layer at a different rate while it crosses the viewport. */
function Parallax({
  children,
  axis = "y",
  distance = [-48, 48],
  scale,
  container,
  offset = ["start end", "end start"],
  className,
  style,
  ...props
}: ParallaxProps) {
  const target = React.useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, container, offset })
  const translation = useTransform(scrollYProgress, [0, 1], distance)
  const scaleValue = useTransform(scrollYProgress, [0, 1], scale ?? [1, 1])

  return (
    <motion.div
      ref={target}
      data-slot="parallax"
      data-axis={axis}
      className={cn("will-change-transform", className)}
      style={{
        ...style,
        x: reduceMotion || axis === "y" ? 0 : translation,
        y: reduceMotion || axis === "x" ? 0 : translation,
        scale: reduceMotion ? 1 : scaleValue,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export { Parallax }
