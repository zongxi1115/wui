"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
  type SpringOptions,
  type Transition,
  type Variants,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

type CursorPosition = { x: number; y: number }

const defaultVariants: Variants = {
  initial: { opacity: 0, scale: 0.75 },
  animated: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.75 },
}

export interface CursorProps extends Omit<
  HTMLMotionProps<"div">,
  "children" | "transition" | "variants"
> {
  /** Visual rendered at the pointer position. */
  children: React.ReactNode
  /** Spring physics used to follow the pointer. */
  springConfig?: SpringOptions
  /** Limit the cursor to the component's parent element. @default false */
  attachToParent?: boolean
  /** Entrance and exit transition. */
  transition?: Transition
  /** Initial, animated and exit states for the cursor visual. */
  variants?: Variants
  /** Hide the platform cursor over the active target. @default true */
  hideNativeCursor?: boolean
  /** Called whenever the pointer coordinates change. */
  onPositionChange?: (position: CursorPosition) => void
}

/** A spring-following custom cursor for the page or a parent region. */
function Cursor({
  children,
  className,
  style,
  springConfig = { stiffness: 500, damping: 35, mass: 0.2 },
  attachToParent = false,
  transition = { duration: 0.15 },
  variants = defaultVariants,
  hideNativeCursor = true,
  onPositionChange,
  ...props
}: CursorProps) {
  const anchorRef = React.useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = React.useState(false)
  const [finePointer, setFinePointer] = React.useState(false)
  const reduceMotion = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, springConfig)
  const springY = useSpring(rawY, springConfig)

  React.useEffect(() => {
    const query = window.matchMedia("(pointer: fine)")
    const update = () => setFinePointer(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  React.useEffect(() => {
    const anchor = anchorRef.current
    const target = attachToParent ? anchor?.parentElement : window
    if (!target || !finePointer) return

    const cursorTarget = attachToParent
      ? anchor?.parentElement
      : document.documentElement
    const previousCursor = cursorTarget?.style.cursor
    if (cursorTarget && hideNativeCursor) cursorTarget.style.cursor = "none"

    const move = (event: Event) => {
      const pointerEvent = event as PointerEvent
      let x = pointerEvent.clientX
      let y = pointerEvent.clientY
      if (attachToParent && anchor?.parentElement) {
        const parent = anchor.parentElement
        const rect = parent.getBoundingClientRect()
        x = pointerEvent.clientX - rect.left - parent.clientLeft + parent.scrollLeft
        y = pointerEvent.clientY - rect.top - parent.clientTop + parent.scrollTop
      }
      rawX.set(x)
      rawY.set(y)
      setVisible(true)
      onPositionChange?.({ x, y })
    }
    const leave = () => setVisible(false)

    target.addEventListener("pointermove", move)
    target.addEventListener("pointerenter", move)
    target.addEventListener("pointerleave", leave)
    return () => {
      target.removeEventListener("pointermove", move)
      target.removeEventListener("pointerenter", move)
      target.removeEventListener("pointerleave", leave)
      if (cursorTarget && hideNativeCursor)
        cursorTarget.style.cursor = previousCursor ?? ""
    }
  }, [
    attachToParent,
    finePointer,
    hideNativeCursor,
    onPositionChange,
    rawX,
    rawY,
  ])

  const x = reduceMotion ? rawX : springX
  const y = reduceMotion ? rawY : springY

  return (
    <>
      <span ref={anchorRef} aria-hidden className="hidden" />
      <AnimatePresence>
        {visible && finePointer ? (
          <motion.div
            aria-hidden="true"
            data-slot="cursor"
            className={cn(
              "pointer-events-none left-0 top-0 z-50 -translate-x-1/2 -translate-y-1/2",
              attachToParent ? "absolute" : "fixed",
              className
            )}
            style={{ ...style, x, y }}
            variants={variants}
            initial={reduceMotion ? false : "initial"}
            animate="animated"
            exit="exit"
            transition={reduceMotion ? { duration: 0 } : transition}
            {...props}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export { Cursor }
