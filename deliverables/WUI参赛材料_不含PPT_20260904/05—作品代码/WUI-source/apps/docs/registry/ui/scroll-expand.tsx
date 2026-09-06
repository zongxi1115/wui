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

export interface ScrollExpandProps extends Omit<
  HTMLMotionProps<"section">,
  "children"
> {
  /** Media or hero content that expands or collapses in the pinned viewport. */
  children: React.ReactNode
  /** Scroll direction of the visual transformation. @default "expand" */
  direction?: "expand" | "collapse"
  /** Initial inset on every edge, as a percentage. @default 10 */
  inset?: number
  /** Corner radius at the compact state in pixels. @default 28 */
  radius?: number
  /** Section length in viewport heights. @default 1.8 */
  scrollLength?: number
  /** Scrollable element to observe instead of the page. */
  container?: React.RefObject<HTMLElement | null>
  /** Classes applied to the sticky viewport. */
  viewportClassName?: string
  /** Classes applied to the transformed content frame. */
  frameClassName?: string
}

/** Pins media while scroll progress expands it to full bleed or collapses it away. */
function ScrollExpand({
  children,
  direction = "expand",
  inset = 10,
  radius = 28,
  scrollLength = 1.8,
  container,
  className,
  viewportClassName,
  frameClassName,
  style,
  ...props
}: ScrollExpandProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const [viewportHeight, setViewportHeight] = React.useState(0)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container,
    offset: ["start start", "end end"],
  })
  const compactClip = `inset(${inset}% round ${radius}px)`
  const expandedClip = "inset(0% round 0px)"
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "expand"
      ? [compactClip, expandedClip]
      : [expandedClip, compactClip]
  )
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "expand" ? [1.08, 1] : [1, 1.08]
  )

  React.useLayoutEffect(() => {
    const measure = () => {
      setViewportHeight(container?.current?.clientHeight ?? window.innerHeight)
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (container?.current) observer.observe(container.current)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [container])

  return (
    <motion.section
      ref={sectionRef}
      data-slot="scroll-expand"
      data-direction={direction}
      className={cn("relative", className)}
      style={{
        ...style,
        height: viewportHeight
          ? viewportHeight * scrollLength
          : `${scrollLength * 100}vh`,
      }}
      {...props}
    >
      <div
        data-slot="scroll-expand-viewport"
        className={cn("sticky top-0 overflow-hidden", viewportClassName)}
        style={{ height: viewportHeight || "100vh" }}
      >
        <motion.div
          data-slot="scroll-expand-frame"
          className={cn("h-full w-full overflow-hidden", frameClassName)}
          style={{
            clipPath: reduceMotion ? expandedClip : clipPath,
          }}
        >
          <motion.div
            data-slot="scroll-expand-content"
            className="h-full w-full will-change-transform"
            style={{ scale: reduceMotion ? 1 : scale }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export { ScrollExpand }
