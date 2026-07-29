"use client"

import * as React from "react"
import {
  motion,
  useAnimationFrame,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface VelocityMarqueeProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  /** Items repeated across the seamless track. */
  children: React.ReactNode
  /** Idle track speed in pixels per second. @default 36 */
  baseSpeed?: number
  /** Added speed for each pixel per second of scroll velocity. @default 0.08 */
  sensitivity?: number
  /** Maximum velocity-driven speed boost in pixels per second. @default 180 */
  maxBoost?: number
  /** Gap between repeated groups in pixels. @default 32 */
  gap?: number
  /** Invert the base and scroll-driven direction. @default false */
  reverse?: boolean
  /** Scrollable element to observe instead of the page. */
  container?: React.RefObject<HTMLElement | null>
  /** Classes applied to each repeated group. */
  groupClassName?: string
}

function wrap(value: number, size: number) {
  return ((value % size) + size) % size
}

/** A seamless marquee that accelerates and changes direction with scrolling. */
function VelocityMarquee({
  children,
  baseSpeed = 36,
  sensitivity = 0.08,
  maxBoost = 180,
  gap = 32,
  reverse = false,
  container,
  className,
  groupClassName,
  ...props
}: VelocityMarqueeProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const groupRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const positionRef = React.useRef(0)
  const directionRef = React.useRef(reverse ? -1 : 1)
  const [groupSize, setGroupSize] = React.useState(0)
  const reduceMotion = useReducedMotion()
  const inView = useInView(rootRef)
  const { scrollY } = useScroll({ container })
  const scrollVelocity = useSpring(useVelocity(scrollY), {
    stiffness: 120,
    damping: 30,
    mass: 0.35,
  })

  React.useLayoutEffect(() => {
    const group = groupRef.current
    if (!group) return

    const measure = () => setGroupSize(group.getBoundingClientRect().width)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(group)
    return () => observer.disconnect()
  }, [children, gap])

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !inView || groupSize === 0) return

    const velocity = scrollVelocity.get()
    if (Math.abs(velocity) > 4) {
      directionRef.current = (velocity < 0 ? -1 : 1) * (reverse ? -1 : 1)
    }

    const boost = Math.min(Math.abs(velocity) * sensitivity, maxBoost)
    positionRef.current +=
      directionRef.current * (baseSpeed + boost) * (delta / 1000)

    if (trackRef.current) {
      const offset = -wrap(positionRef.current, groupSize)
      trackRef.current.style.transform = `translate3d(${offset}px, 0, 0)`
    }
  })

  const groupClasses = cn("flex shrink-0 items-center", groupClassName)
  const groupStyle = { gap, paddingRight: gap }

  return (
    <motion.div
      ref={rootRef}
      data-slot="velocity-marquee"
      className={cn(
        reduceMotion ? "overflow-x-auto" : "overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        ref={trackRef}
        data-slot="velocity-marquee-track"
        className="flex w-max will-change-transform"
      >
        <div
          ref={groupRef}
          data-slot="velocity-marquee-group"
          className={groupClasses}
          style={groupStyle}
        >
          {children}
        </div>
        {reduceMotion ? null : (
          <div
            aria-hidden="true"
            inert
            data-slot="velocity-marquee-group"
            className={groupClasses}
            style={groupStyle}
          >
            {children}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export { VelocityMarquee }
