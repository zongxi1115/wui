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

function directionalVariants(direction: "up" | "down"): Variants {
  const offset = direction === "up" ? "0.6em" : "-0.6em"
  const exitOffset = direction === "up" ? "-0.6em" : "0.6em"
  return {
    initial: { y: offset, opacity: 0, filter: "blur(4px)" },
    animate: { y: "0em", opacity: 1, filter: "blur(0px)" },
    exit: { y: exitOffset, opacity: 0, filter: "blur(4px)" },
  }
}

const variantsByDirection = {
  up: directionalVariants("up"),
  down: directionalVariants("down"),
}

export interface TextLoopProps extends React.ComponentProps<"span"> {
  /** Content items displayed one after another. */
  children: React.ReactNode[]
  /** Seconds between item changes. @default 2.5 */
  interval?: number
  /**
   * Travel direction of the default animation. `"up"` exits through the top
   * and enters from the bottom; `"down"` does the reverse. Ignored when
   * custom `variants` are passed. @default "up"
   */
  direction?: "up" | "down"
  /** Motion transition for each item. */
  transition?: Transition
  /** Initial, animate and exit states. */
  variants?: Variants
  /** Animate the container width as items of different lengths swap. @default false */
  animateWidth?: boolean
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
  direction = "up",
  transition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  variants,
  animateWidth = false,
  onIndexChange,
  trigger = true,
  mode = "popLayout",
  ...props
}: TextLoopProps) {
  const [index, setIndex] = React.useState(0)
  const [width, setWidth] = React.useState<number>()
  const itemRef = React.useRef<HTMLSpanElement>(null)
  const onIndexChangeRef = React.useRef(onIndexChange)
  const firstRender = React.useRef(true)
  const reduceMotion = useReducedMotion()
  const count = children.length
  const activeIndex = index < count ? index : 0

  React.useEffect(() => {
    onIndexChangeRef.current = onIndexChange
  })

  React.useEffect(() => {
    if (!trigger || count < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, interval * 1000)
    return () => window.clearInterval(timer)
  }, [count, interval, trigger])

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    onIndexChangeRef.current?.(activeIndex)
  }, [activeIndex])

  React.useLayoutEffect(() => {
    if (!animateWidth || !itemRef.current) return
    setWidth(itemRef.current.offsetWidth)
  }, [activeIndex, animateWidth])

  return (
    <motion.span
      data-slot="text-loop"
      className={cn(
        "relative inline-grid overflow-hidden align-bottom",
        className
      )}
      initial={false}
      animate={animateWidth && width !== undefined ? { width } : undefined}
      transition={reduceMotion ? { duration: 0 } : transition}
      {...(props as React.ComponentProps<typeof motion.span>)}
    >
      <AnimatePresence initial={false} mode={mode}>
        <motion.span
          ref={itemRef}
          data-slot="text-loop-item"
          className={cn(
            "col-start-1 row-start-1 inline-block",
            animateWidth && "justify-self-start whitespace-nowrap"
          )}
          key={activeIndex}
          variants={variants ?? variantsByDirection[direction]}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={reduceMotion ? { duration: 0 } : transition}
        >
          {children[activeIndex]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

export { TextLoop }
