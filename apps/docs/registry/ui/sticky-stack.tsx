"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

interface StickyStackContextValue {
  count: number
  gap: number
  scaleStep: number
  dim: number
  top: number
  progress: MotionValue<number>
  reduceMotion: boolean
}

const StickyStackContext = React.createContext<StickyStackContextValue | null>(
  null
)

export interface StickyStackProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  /** StickyStackItem elements rendered in stacking order. */
  children: React.ReactNode
  /** Top offset of the first sticky item in pixels. @default 24 */
  top?: number
  /** Visible vertical offset between stacked items in pixels. @default 12 */
  gap?: number
  /** Scale removed for every card placed above an item. @default 0.035 */
  scaleStep?: number
  /** Maximum opacity of the background veil laid over receding cards. `0` disables it. @default 0 */
  dim?: number
  /** Scrollable element to observe instead of the page. */
  container?: React.RefObject<HTMLElement | null>
}

export interface StickyStackItemProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  /** Card content. */
  children: React.ReactNode
  /** Position in the stack. Inferred automatically for direct children. */
  index?: number
}

interface StickyStackItemInternalProps extends StickyStackItemProps {
  stackIndex?: number
}

/** A group of cards that pin, layer, and recede as the next card arrives. */
function StickyStack({
  children,
  top = 24,
  gap = 12,
  scaleStep = 0.035,
  dim = 0,
  container,
  className,
  ...props
}: StickyStackProps) {
  const target = React.useRef<HTMLDivElement>(null)
  const reduceMotion = Boolean(useReducedMotion())
  const items = React.Children.toArray(children)
  const { scrollYProgress } = useScroll({
    target,
    container,
    offset: ["start start", "end end"],
  })

  return (
    <StickyStackContext.Provider
      value={{
        count: items.length,
        gap,
        scaleStep,
        dim,
        top,
        progress: scrollYProgress,
        reduceMotion,
      }}
    >
      <motion.div
        ref={target}
        data-slot="sticky-stack"
        className={cn("relative", className)}
        {...props}
      >
        {items.map((child, stackIndex) =>
          React.isValidElement<StickyStackItemInternalProps>(child) &&
          child.type === StickyStackItem
            ? React.cloneElement(child, { stackIndex })
            : child
        )}
      </motion.div>
    </StickyStackContext.Provider>
  )
}

/** One card inside a StickyStack. */
function StickyStackItem({
  children,
  index,
  stackIndex,
  className,
  style,
  ...props
}: StickyStackItemInternalProps) {
  const context = React.useContext(StickyStackContext)
  if (!context) {
    throw new Error("StickyStackItem must be used inside StickyStack")
  }

  const itemIndex = index ?? stackIndex ?? 0
  const count = Math.max(context.count, 1)
  const start = Math.min(itemIndex / count, 0.98)
  const targetScale = Math.max(
    0.75,
    1 - (count - itemIndex - 1) * context.scaleStep
  )
  const scale = useTransform(context.progress, [start, 1], [1, targetScale])
  const veilTarget =
    (context.dim * (count - itemIndex - 1)) / Math.max(count - 1, 1)
  const veil = useTransform(context.progress, [start, 1], [0, veilTarget])

  return (
    <motion.div
      data-slot="sticky-stack-item"
      className={cn("sticky mb-[18vh] origin-top last:mb-0", className)}
      style={{
        ...style,
        top: context.top + itemIndex * context.gap,
        zIndex: itemIndex + 1,
        scale: context.reduceMotion ? 1 : scale,
      }}
      {...props}
    >
      {children}
      {context.dim > 0 && !context.reduceMotion ? (
        <motion.div
          aria-hidden="true"
          data-slot="sticky-stack-item-veil"
          className="bg-background pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{ opacity: veil }}
        />
      ) : null}
    </motion.div>
  )
}

export { StickyStack, StickyStackItem }
