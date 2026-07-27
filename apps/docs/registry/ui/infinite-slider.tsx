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
  const groupRef = React.useRef<HTMLDivElement>(null)
  const progressRef = React.useRef(0)
  const [groupSize, setGroupSize] = React.useState(0)
  const [hovered, setHovered] = React.useState(false)
  const reduceMotion = useReducedMotion()
  const inView = useInView(containerRef)

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
  }, [direction, gap, children])

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !inView || groupSize === 0) return
    const currentSpeed =
      hovered && speedOnHover !== undefined ? speedOnHover : speed
    progressRef.current =
      (progressRef.current + (currentSpeed * delta) / 1000) % groupSize

    const track = groupRef.current?.parentElement
    if (!track) return
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
        reduceMotion
          ? direction === "horizontal"
            ? "overflow-x-auto"
            : "overflow-y-auto"
          : "overflow-hidden",
        className
      )}
      onMouseEnter={(event) => {
        setHovered(true)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        setHovered(false)
        onMouseLeave?.(event)
      }}
      {...props}
    >
      <div
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
        {reduceMotion ? null : (
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
