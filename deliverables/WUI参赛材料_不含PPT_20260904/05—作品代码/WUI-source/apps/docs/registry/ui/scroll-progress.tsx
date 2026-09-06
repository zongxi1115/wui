"use client"

import * as React from "react"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  type HTMLMotionProps,
  type UseScrollOptions,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface ScrollProgressProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  /** Visual form of the progress indicator. @default "bar" */
  variant?: "bar" | "circle"
  /** Edge used by a fixed bar. Use `inline` to keep it in normal flow. @default "top" */
  position?: "top" | "bottom" | "inline"
  /** Scrollable element to observe instead of the page. */
  container?: React.RefObject<HTMLElement | null>
  /** Element whose passage through the viewport defines the progress. */
  target?: React.RefObject<HTMLElement | null>
  /** Motion scroll offsets used when `target` is supplied. */
  offset?: UseScrollOptions["offset"]
  /** Diameter of the circular indicator in pixels. @default 44 */
  size?: number
  /** Stroke width of the circular indicator in pixels. @default 3 */
  strokeWidth?: number
  /** Smooth abrupt scroll updates with a spring. @default true */
  smooth?: boolean
  /** Classes applied to the inactive track. */
  trackClassName?: string
  /** Classes applied to the moving indicator. */
  indicatorClassName?: string
}

/** Shows page, container, or section scroll completion as a bar or ring. */
function ScrollProgress({
  variant = "bar",
  position = "top",
  container,
  target,
  offset,
  size = 44,
  strokeWidth = 3,
  smooth = true,
  className,
  trackClassName,
  indicatorClassName,
  ...props
}: ScrollProgressProps) {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ container, target, offset })
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.35,
  })
  const progress = smooth && !reduceMotion ? springProgress : scrollYProgress
  const [value, setValue] = React.useState(0)

  useMotionValueEvent(progress, "change", (latest) => {
    setValue(Math.round(latest * 100))
  })

  if (variant === "circle") {
    const radius = Math.max((size - strokeWidth) / 2, 1)
    const center = size / 2

    return (
      <motion.div
        role="progressbar"
        aria-label="Scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        data-slot="scroll-progress"
        data-variant="circle"
        className={cn("relative inline-grid place-items-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 -rotate-90 overflow-visible"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className={cn("text-border", trackClassName)}
          />
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            pathLength={1}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={cn("text-foreground", indicatorClassName)}
            style={{ pathLength: progress }}
          />
        </svg>
        <span className="text-[10px] font-medium tabular-nums">{value}</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      role="progressbar"
      aria-label="Scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      data-slot="scroll-progress"
      data-variant="bar"
      data-position={position}
      className={cn(
        "bg-border z-50 h-0.5 overflow-hidden",
        position === "top" && "fixed inset-x-0 top-0",
        position === "bottom" && "fixed inset-x-0 bottom-0",
        position === "inline" && "relative w-full",
        trackClassName,
        className
      )}
      {...props}
    >
      <motion.div
        data-slot="scroll-progress-indicator"
        className={cn("bg-foreground h-full origin-left", indicatorClassName)}
        style={{ scaleX: progress }}
      />
    </motion.div>
  )
}

export { ScrollProgress }
