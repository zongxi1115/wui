"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type SpringOptions,
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
  /** Optional rotation range in degrees. */
  rotate?: [number, number]
  /** Optional opacity range. */
  opacity?: [number, number]
  /** Follow scroll through a spring for a softer, trailing layer. Pass spring options to tune it. @default false */
  smooth?: boolean | SpringOptions
  /** Scrollable element to observe instead of the page. */
  container?: React.RefObject<HTMLElement | null>
  /** Motion scroll offsets for the wrapper. @default ["start end", "end start"] */
  offset?: UseScrollOptions["offset"]
}

const defaultSpring: SpringOptions = {
  stiffness: 120,
  damping: 24,
  mass: 0.4,
  restDelta: 0.0005,
}

/** Moves a layer at a different rate while it crosses the viewport. */
function Parallax({
  children,
  axis = "y",
  distance = [-48, 48],
  scale,
  rotate,
  opacity,
  smooth = false,
  container,
  offset = ["start end", "end start"],
  className,
  style,
  ...props
}: ParallaxProps) {
  const target = React.useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, container, offset })
  const springProgress = useSpring(
    scrollYProgress,
    typeof smooth === "object" ? smooth : defaultSpring
  )
  const progress = smooth ? springProgress : scrollYProgress
  const translation = useTransform(progress, [0, 1], distance)
  const scaleValue = useTransform(progress, [0, 1], scale ?? [1, 1])
  const rotateValue = useTransform(progress, [0, 1], rotate ?? [0, 0])
  const opacityValue = useTransform(progress, [0, 1], opacity ?? [1, 1])

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
        rotate: reduceMotion ? 0 : rotateValue,
        opacity: reduceMotion || !opacity ? style?.opacity : opacityValue,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export { Parallax }
