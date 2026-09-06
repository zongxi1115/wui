"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
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
  /** Classes applied to the pinned viewport. */
  viewportClassName?: string
  /** Classes applied to the horizontally translated track. */
  trackClassName?: string
}

interface HorizontalMetrics {
  distance: number
  viewportHeight: number
}

/** Converts vertical section progress into a pinned horizontal track. */
function HorizontalScroll({
  children,
  container,
  scrollPadding = 0,
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
  const x = useTransform(scrollYProgress, [0, 1], [0, -metrics.distance])

  React.useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const measure = () => {
      const viewportHeight =
        container?.current?.clientHeight ?? window.innerHeight
      setMetrics({
        distance: Math.max(track.scrollWidth - section.clientWidth, 0),
        viewportHeight,
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
  }, [children, container])

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
