"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface AnimatedListProps
  extends Omit<React.ComponentProps<"ul">, "children"> {
  /** Keyed items in chronological order; the newest (last) item shows on top. */
  children: React.ReactNode
  /**
   * Milliseconds between two reveals. Items not shown yet are revealed one at a
   * time; `0` shows every item immediately. @default 1000
   */
  delay?: number
  /** Maximum number of items kept on screen; older ones leave at the bottom. */
  max?: number
  /** Transition of entering items and of items shifting down. */
  transition?: Transition
  /** Class applied to every item wrapper. */
  itemClassName?: string
}

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.8,
}

/**
 * A feed that reveals keyed items one by one with the newest on top, while
 * existing items slide down with a spring.
 */
function AnimatedList({
  children,
  delay = 1000,
  max,
  transition = defaultTransition,
  itemClassName,
  className,
  ...props
}: AnimatedListProps) {
  const reduceMotion = useReducedMotion()
  const items = React.Children.toArray(children).filter(React.isValidElement)
  const [revealed, setRevealed] = React.useState<ReadonlySet<React.Key>>(
    () => new Set()
  )
  const isRevealed = (item: React.ReactElement) =>
    delay === 0 || revealed.has(item.key!)
  const pendingKey = items.find((item) => !isRevealed(item))?.key ?? null

  React.useEffect(() => {
    if (pendingKey === null) return
    const timer = window.setTimeout(
      () => setRevealed((current) => new Set(current).add(pendingKey)),
      delay
    )
    return () => window.clearTimeout(timer)
  }, [delay, pendingKey])

  const visible = items.filter(isRevealed).reverse()
  const shown = max === undefined ? visible : visible.slice(0, max)
  const itemTransition = reduceMotion ? { duration: 0 } : transition

  return (
    <ul
      data-slot="animated-list"
      aria-live="polite"
      className={cn("relative flex flex-col gap-2", className)}
      {...props}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {shown.map((item) => (
          <motion.li
            key={item.key}
            layout
            data-slot="animated-list-item"
            className={itemClassName}
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={itemTransition}
          >
            {item}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

export { AnimatedList }
