"use client"

import * as React from "react"
import {
  motion,
  useAnimationFrame,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface InfiniteSliderProps extends Omit<
  HTMLMotionProps<"div">,
  "children" | "direction"
> {
  /** Items displayed in the continuously looping track. */
  children: React.ReactNode
  /** Space between items in pixels. @default 16 */
  gap?: number
  /** Track speed in pixels per second. @default 64 */
  speed?: number
  /** Track speed while hovered. Set to `0` to pause on hover. */
  speedOnHover?: number
  /** Slider axis. @default "horizontal" */
  direction?: "horizontal" | "vertical"
  /** Move in the opposite direction. @default false */
  reverse?: boolean
}

/** A continuously looping horizontal or vertical content track. */
function InfiniteSlider({
  children,
  className,
  gap = 16,
  speed = 64,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  onMouseEnter,
  onMouseLeave,
  ...props
}: InfiniteSliderProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const groupRef = React.useRef<HTMLDivElement>(null)
  const progressRef = React.useRef(0)
  const hoveredRef = React.useRef(false)
  const currentSpeedRef = React.useRef(speed)
  const [groupSize, setGroupSize] = React.useState(0)
  const reduceMotion = useReducedMotion()
  const inView = useInView(containerRef)
  // Switch to the static, scrollable layout only after hydration so the
  // server and client markup always match.
  const [staticLayout, setStaticLayout] = React.useState(false)

  React.useEffect(() => {
    setStaticLayout(Boolean(reduceMotion))
    if (reduceMotion && trackRef.current) trackRef.current.style.transform = ""
  }, [reduceMotion])

  React.useEffect(() => {
    const group = groupRef.current
    if (!group) return

    const measure = () => {
      const rect = group.getBoundingClientRect()
      setGroupSize(direction === "horizontal" ? rect.width : rect.height)
    }
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(group)
    return () => observer.disconnect()
  }, [direction])

  useAnimationFrame((_, delta) => {
    const track = trackRef.current
    if (staticLayout || !inView || groupSize === 0 || !track) return

    // Ease toward the target speed so hover slow-downs and pauses glide
    // instead of snapping.
    const targetSpeed =
      hoveredRef.current && speedOnHover !== undefined ? speedOnHover : speed
    const smoothing = 1 - Math.exp(-delta / 180)
    currentSpeedRef.current +=
      (targetSpeed - currentSpeedRef.current) * smoothing

    const next = progressRef.current + (currentSpeedRef.current * delta) / 1000
    progressRef.current = ((next % groupSize) + groupSize) % groupSize

    const progress = progressRef.current
    const offset = reverse ? progress - groupSize : -progress
    track.style.transform =
      direction === "horizontal"
        ? `translate3d(${offset}px, 0, 0)`
        : `translate3d(0, ${offset}px, 0)`
  })

  const groupClassName = cn(
    "flex shrink-0",
    direction === "horizontal" ? "flex-row" : "flex-col"
  )
  const groupStyle =
    direction === "horizontal"
      ? { gap, paddingRight: gap }
      : { gap, paddingBottom: gap }

  return (
    <motion.div
      ref={containerRef}
      data-slot="infinite-slider"
      className={cn(
        staticLayout
          ? direction === "horizontal"
            ? "overflow-x-auto"
            : "overflow-y-auto"
          : "overflow-hidden",
        className
      )}
      onMouseEnter={(event) => {
        hoveredRef.current = true
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        hoveredRef.current = false
        onMouseLeave?.(event)
      }}
      {...props}
    >
      <div
        ref={trackRef}
        data-slot="infinite-slider-track"
        className={cn(
          "flex w-max will-change-transform",
          direction === "vertical" && "flex-col"
        )}
      >
        <div
          ref={groupRef}
          data-slot="infinite-slider-group"
          className={groupClassName}
          style={groupStyle}
        >
          {children}
        </div>
        {staticLayout ? null : (
          <div
            aria-hidden="true"
            inert
            data-slot="infinite-slider-group"
            className={groupClassName}
            style={groupStyle}
          >
            {children}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export { InfiniteSlider }
