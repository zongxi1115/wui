"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface HorizontalScrollProps extends Omit<
  HTMLMotionProps<"section">,
  "children"
> {
  /** Wide content translated horizontally while the section is pinned. */
  children: React.ReactNode
  /** Scrollable element to observe instead of the page. */
  container?: React.RefObject<HTMLElement | null>
  /** Extra vertical scrolling distance in pixels. @default 0 */
  scrollPadding?: number
  /** Ease the track through a spring so wheel steps glide instead of jump. @default true */
  smooth?: boolean
  /** Classes applied to the pinned viewport. */
  viewportClassName?: string
  /** Classes applied to the horizontally translated track. */
  trackClassName?: string
}

interface HorizontalMetrics {
  distance: number
  viewportHeight: number
}

function getViewportHeight(container?: HTMLElement | null) {
  if (!container) return window.innerHeight
  const style = window.getComputedStyle(container)
  return (
    container.clientHeight -
    parseFloat(style.paddingTop) -
    parseFloat(style.paddingBottom)
  )
}

/** Converts vertical section progress into a pinned horizontal track. */
function HorizontalScroll({
  children,
  container,
  scrollPadding = 0,
  smooth = true,
  className,
  viewportClassName,
  trackClassName,
  style,
  ...props
}: HorizontalScrollProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [metrics, setMetrics] = React.useState<HorizontalMetrics>({
    distance: 0,
    viewportHeight: 0,
  })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container,
    offset: ["start start", "end end"],
  })
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    mass: 0.35,
    restDelta: 0.0005,
  })
  const progress = smooth ? springProgress : scrollYProgress
  const x = useTransform(progress, [0, 1], [0, -metrics.distance])

  React.useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const measure = () => {
      setMetrics({
        distance: Math.max(track.scrollWidth - section.clientWidth, 0),
        viewportHeight: getViewportHeight(container?.current),
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(section)
    observer.observe(track)
    if (container?.current) observer.observe(container.current)
    window.addEventListener("resize", measure)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [container, reduceMotion])

  if (reduceMotion) {
    return (
      <motion.section
        ref={sectionRef}
        data-slot="horizontal-scroll"
        className={cn("overflow-x-auto", className)}
        style={style}
        {...props}
      >
        <div
          ref={trackRef}
          data-slot="horizontal-scroll-track"
          className={cn("flex w-max", trackClassName)}
        >
          {children}
        </div>
      </motion.section>
    )
  }

  const sectionHeight =
    metrics.viewportHeight + metrics.distance + scrollPadding

  return (
    <motion.section
      ref={sectionRef}
      data-slot="horizontal-scroll"
      className={cn("relative", className)}
      style={{ ...style, height: sectionHeight || undefined }}
      {...props}
    >
      <div
        data-slot="horizontal-scroll-viewport"
        className={cn("sticky top-0 overflow-hidden", viewportClassName)}
        style={{ height: metrics.viewportHeight || "100vh" }}
      >
        <motion.div
          ref={trackRef}
          data-slot="horizontal-scroll-track"
          className={cn(
            "flex h-full w-max will-change-transform",
            trackClassName
          )}
          style={{ x }}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  )
}

export { HorizontalScroll }
