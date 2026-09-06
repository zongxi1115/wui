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

    lastPosition.current = { x, y }
    const id = sequence.current++
    const nextItem = { id, itemIndex: id % items.length, x, y }
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
              "pointer-events-none absolute left-0 top-0 z-10 -translate-x-1/2 -translate-y-1/2",
              itemClassName
            )}
            style={{ x: item.x, y: item.y }}
            initial={{ opacity: 0, scale: 0.82, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: item.y - 20 }}
            transition={{ duration: lifetime / 1000, ease: [0.22, 1, 0.36, 1] }}
          >
            {items[item.itemIndex]}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export { ImageTrail }
