"use client"

import * as React from "react"
import {
  easeInOut,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
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
  /** Scale of the inner content at the compact state, creating a subtle zoom as it expands. @default 1.08 */
  contentScale?: number
  /** Ease scroll progress through a spring so the frame settles softly. @default true */
  smooth?: boolean
  /** Scrollable element to observe instead of the page. */
  container?: React.RefObject<HTMLElement | null>
  /** Classes applied to the sticky viewport. */
  viewportClassName?: string
  /** Classes applied to the transformed content frame. */
  frameClassName?: string
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

/** Pins media while scroll progress expands it to full bleed or collapses it away. */
function ScrollExpand({
  children,
  direction = "expand",
  inset = 10,
  radius = 28,
  scrollLength = 1.8,
  contentScale = 1.08,
  smooth = true,
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
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.35,
    restDelta: 0.0005,
  })
  const progress = smooth ? springProgress : scrollYProgress
  const compactClip = `inset(${inset}% round ${radius}px)`
  const expandedClip = "inset(0% round 0px)"
  const clipPath = useTransform(
    progress,
    [0, 1],
    direction === "expand"
      ? [compactClip, expandedClip]
      : [expandedClip, compactClip],
    { ease: easeInOut }
  )
  const scale = useTransform(
    progress,
    [0, 1],
    direction === "expand" ? [contentScale, 1] : [1, contentScale],
    { ease: easeInOut }
  )

  React.useLayoutEffect(() => {
    const measure = () => {
      setViewportHeight(getViewportHeight(container?.current))
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
