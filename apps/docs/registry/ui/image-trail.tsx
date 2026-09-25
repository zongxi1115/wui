"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

interface TrailItem {
  id: number
  itemIndex: number
  x: number
  y: number
  rotate: number
  dx: number
  dy: number
}

export interface ImageTrailProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  /** Visual items cycled through as the pointer moves. */
  items: React.ReactNode[]
  /** Static content rendered inside the interaction region. */
  children?: React.ReactNode
  /** Pointer distance required before adding another item, in pixels. @default 72 */
  distance?: number
  /** Lifetime of each trail item in milliseconds. @default 720 */
  lifetime?: number
  /** Maximum number of trail items rendered at once. @default 8 */
  maxItems?: number
  /** Maximum random rotation applied to each item, in degrees. @default 8 */
  rotation?: number
  /** Classes applied to every positioned trail item. */
  itemClassName?: string
}

/** Leaves a short-lived sequence of visual items behind the pointer. */
function ImageTrail({
  items,
  children,
  distance = 72,
  lifetime = 720,
  maxItems = 8,
  rotation = 8,
  className,
  itemClassName,
  onPointerMove,
  onPointerLeave,
  ...props
}: ImageTrailProps) {
  const reduceMotion = useReducedMotion()
  const [trail, setTrail] = React.useState<TrailItem[]>([])
  const lastPosition = React.useRef<{ x: number; y: number } | null>(null)
  const sequence = React.useRef(0)
  const timers = React.useRef<Set<number>>(new Set())

  React.useEffect(() => {
    const activeTimers = timers.current
    return () => {
      activeTimers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  function addItem(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType === "touch" || items.length === 0)
      return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const previous = lastPosition.current
    if (previous && Math.hypot(x - previous.x, y - previous.y) < distance)
      return

    // Items drift slightly along the pointer's direction as they fade out.
    const dx = previous ? (x - previous.x) * 0.25 : 0
    const dy = previous ? (y - previous.y) * 0.25 : 0
    lastPosition.current = { x, y }
    const id = sequence.current++
    const nextItem = {
      id,
      itemIndex: id % items.length,
      x,
      y,
      rotate: (Math.random() * 2 - 1) * rotation,
      dx,
      dy,
    }
    setTrail((current) => [...current, nextItem].slice(-maxItems))

    const timer = window.setTimeout(() => {
      setTrail((current) => current.filter((item) => item.id !== id))
      timers.current.delete(timer)
    }, lifetime)
    timers.current.add(timer)
  }

  return (
    <motion.div
      data-slot="image-trail"
      className={cn("relative isolate overflow-hidden", className)}
      onPointerMove={(event) => {
        addItem(event)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        lastPosition.current = null
        onPointerLeave?.(event)
      }}
      {...props}
    >
      {children}
      <AnimatePresence>
        {trail.map((item) => (
          <motion.div
            key={item.id}
            aria-hidden="true"
            data-slot="image-trail-item"
            className={cn(
              "pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 will-change-transform",
              itemClassName
            )}
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0.6, rotate: item.rotate * 1.6 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: item.rotate,
              transition: { type: "spring", stiffness: 380, damping: 26 },
            }}
            exit={{
              opacity: 0,
              scale: 0.86,
              x: item.dx,
              y: item.dy + 12,
              transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
            }}
          >
            {items[item.itemIndex]}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export { ImageTrail }
