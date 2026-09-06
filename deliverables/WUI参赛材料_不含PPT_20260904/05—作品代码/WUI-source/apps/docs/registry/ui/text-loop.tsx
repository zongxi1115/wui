"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type AnimatePresenceProps,
  type Transition,
  type Variants,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

const defaultVariants: Variants = {
  initial: { y: 12, opacity: 0, filter: "blur(4px)" },
  animate: { y: 0, opacity: 1, filter: "blur(0px)" },
  exit: { y: -12, opacity: 0, filter: "blur(4px)" },
}

export interface TextLoopProps extends React.ComponentProps<"span"> {
  /** Content items displayed one after another. */
  children: React.ReactNode[]
  /** Seconds between item changes. @default 2.5 */
  interval?: number
  /** Motion transition for each item. */
  transition?: Transition
  /** Initial, animate and exit states. */
  variants?: Variants
  /** Called after the active index changes. */
  onIndexChange?: (index: number) => void
  /** Start or pause automatic changes. @default true */
  trigger?: boolean
  /** AnimatePresence sequencing mode. @default "popLayout" */
  mode?: AnimatePresenceProps["mode"]
}

/** Cycles through an array of text or inline content. */
function TextLoop({
  children,
  className,
  interval = 2.5,
  transition = { duration: 0.35, ease: "easeOut" },
  variants = defaultVariants,
  onIndexChange,
  trigger = true,
  mode = "popLayout",
  ...props
}: TextLoopProps) {
  const [index, setIndex] = React.useState(0)
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    if (!trigger || children.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % children.length
        onIndexChange?.(next)
        return next
      })
    }, interval * 1000)
    return () => window.clearInterval(timer)
  }, [children.length, interval, onIndexChange, trigger])

  React.useEffect(() => {
    if (index >= children.length) setIndex(0)
  }, [children.length, index])

  return (
    <span
      data-slot="text-loop"
      className={cn(
        "relative inline-grid overflow-hidden align-bottom",
        className
      )}
      {...props}
    >
      <AnimatePresence initial={false} mode={mode}>
        <motion.span
          data-slot="text-loop-item"
          className="col-start-1 row-start-1 inline-block"
          key={index}
          variants={variants}
          initial={reduceMotion ? false : "initial"}
          animate="animate"
          exit="exit"
          transition={reduceMotion ? { duration: 0 } : transition}
        >
          {children[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export { TextLoop }
