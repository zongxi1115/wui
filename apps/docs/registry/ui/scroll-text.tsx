"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
  type UseScrollOptions,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface ScrollTextProps extends Omit<
  HTMLMotionProps<"p">,
  "children"
> {
  /** Text split into scroll-controlled segments. */
  children: string
  /** Reveal style. `highlight` progressively changes muted text to foreground. @default "highlight" */
  mode?: "highlight" | "reveal"
  /** Segment granularity. @default "word" */
  per?: "word" | "line"
  /** HTML element rendered by the component. @default "p" */
  as?: React.ElementType
  /** Portion of the total scroll progress assigned across all segments. @default [0, 1] */
  range?: readonly [number, number]
  /** Overlap between neighboring segment ranges. @default 0.35 */
  overlap?: number
  /** Scrollable element to observe instead of the page. */
  container?: React.RefObject<HTMLElement | null>
  /** Motion scroll offsets for the text block. @default ["start 0.85", "end 0.35"] */
  offset?: UseScrollOptions["offset"]
  /** Classes applied to every text segment. */
  segmentClassName?: string
}

interface ScrollTextSegmentProps {
  children: string
  index: number
  count: number
  mode: NonNullable<ScrollTextProps["mode"]>
  range: readonly [number, number]
  overlap: number
  progress: MotionValue<number>
  reduceMotion: boolean
  className?: string
  line: boolean
}

function ScrollTextSegment({
  children,
  index,
  count,
  mode,
  range,
  overlap,
  progress,
  reduceMotion,
  className,
  line,
}: ScrollTextSegmentProps) {
  const span = range[1] - range[0]
  const step = count > 1 ? span / count : span
  const start = range[0] + step * index
  const end = Math.min(range[1], start + step * (1 + overlap))
  const opacity = useTransform(progress, [start, end], [0, 1])
  const y = useTransform(progress, [start, end], ["105%", "0%"])

  if (mode === "reveal") {
    return (
      <span
        aria-hidden="true"
        data-slot="scroll-text-segment-mask"
        className={cn(
          "overflow-hidden align-top",
          line ? "block" : "inline-block",
          className
        )}
      >
        <motion.span
          data-slot="scroll-text-segment"
          className={line ? "block" : "inline-block"}
          style={{
            y: reduceMotion ? "0%" : y,
            opacity: reduceMotion ? 1 : opacity,
          }}
        >
          {children}
        </motion.span>
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      data-slot="scroll-text-segment"
      className={cn(
        "text-muted-foreground relative",
        line ? "block" : "inline-block",
        className
      )}
    >
      {children}
      <motion.span
        aria-hidden="true"
        className="text-foreground absolute inset-0"
        style={{ opacity: reduceMotion ? 1 : opacity }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function splitText(text: string, per: NonNullable<ScrollTextProps["per"]>) {
  return per === "line" ? text.split("\n") : text.split(/(\s+)/)
}

/** Reveals lines or progressively highlights words according to scroll progress. */
function ScrollText({
  children,
  mode = "highlight",
  per = "word",
  as = "p",
  range = [0, 1],
  overlap = 0.35,
  container,
  offset = ["start 0.85", "end 0.35"],
  segmentClassName,
  className,
  ...props
}: ScrollTextProps) {
  const target = React.useRef<HTMLElement>(null)
  const reduceMotion = Boolean(useReducedMotion())
  const { scrollYProgress } = useScroll({ target, container, offset })
  const Component = React.useMemo(() => motion.create(as), [as])
  const segments = React.useMemo(
    () => splitText(children, per),
    [children, per]
  )

  return (
    <Component
      ref={target}
      aria-label={children}
      data-slot="scroll-text"
      data-mode={mode}
      className={cn(per === "line" && "flex flex-col", className)}
      {...props}
    >
      {segments.map((segment, index) => {
        const whitespace = /^\s+$/.test(segment)

        return (
          <ScrollTextSegment
            key={`${segment}-${index}`}
            index={index}
            count={segments.length}
            mode={mode}
            range={range}
            overlap={overlap}
            progress={scrollYProgress}
            reduceMotion={reduceMotion}
            line={per === "line"}
            className={cn(
              whitespace && per === "word" && "whitespace-pre",
              segmentClassName
            )}
          >
            {segment}
          </ScrollTextSegment>
        )
      })}
    </Component>
  )
}

export { ScrollText }
