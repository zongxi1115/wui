"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react"

import { InfiniteSlider } from "@/registry/ui/infinite-slider"
import { cn } from "@/registry/lib/utils"

export interface HoverMarqueeProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  /** Content shown while the row is idle. */
  children: React.ReactNode
  /** Content repeated inside the moving preview track. */
  marquee: React.ReactNode
  /** Track speed in pixels per second. @default 96 */
  speed?: number
  /** Space between repeated preview items in pixels. @default 32 */
  gap?: number
  /** Move the preview track in the opposite direction. @default false */
  reverse?: boolean
  /** Force the preview open from outside the component. */
  active?: boolean
  /** Classes applied to the moving preview layer. */
  marqueeClassName?: string
}

/** Reveals a horizontally looping preview when a directory row is hovered. */
function HoverMarquee({
  children,
  marquee,
  speed = 96,
  gap = 32,
  reverse = false,
  active,
  className,
  marqueeClassName,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: HoverMarqueeProps) {
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const reduceMotion = useReducedMotion()
  const revealed = active ?? (hovered || focused)

  return (
    <motion.div
      data-slot="hover-marquee"
      className={cn("relative overflow-hidden", className)}
      onPointerEnter={(event) => {
        setHovered(true)
        onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        setHovered(false)
        onPointerLeave?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false)
        onBlur?.(event)
      }}
      {...props}
    >
      <motion.div
        data-slot="hover-marquee-idle"
        initial={false}
        animate={{ opacity: revealed ? 0 : 1, y: revealed ? -8 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
      >
        {children}
      </motion.div>

      <AnimatePresence initial={false}>
        {revealed ? (
          <motion.div
            data-slot="hover-marquee-preview"
            className={cn(
              "absolute inset-0 flex items-center",
              marqueeClassName
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
          >
            <InfiniteSlider
              aria-hidden="true"
              className="w-full"
              speed={reduceMotion ? 0 : speed}
              gap={gap}
              reverse={reverse}
            >
              {marquee}
            </InfiniteSlider>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}

export { HoverMarquee }
