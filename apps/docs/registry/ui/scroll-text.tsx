"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
  type UseScrollOptions,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

type ScrollTextMode = "highlight" | "reveal" | "blur"
type ScrollTextPer = "word" | "char" | "line"

export interface ScrollTextProps extends Omit<
  HTMLMotionProps<"p">,
  "children"
> {
  /** Text split into scroll-controlled segments. */
  children: string
  /** Reveal style. `highlight` brightens muted text, `reveal` slides segments up through a mask, `blur` focuses them in. @default "highlight" */
  mode?: ScrollTextMode
  /** Segment granularity. `word` splits Latin text by words and CJK text by characters; `char` animates every character. @default "word" */
  per?: ScrollTextPer
  /** HTML element rendered by the component. @default "p" */
  as?: React.ElementType
  /** Portion of the total scroll progress assigned across all segments. @default [0, 1] */
  range?: readonly [number, number]
  /** Overlap between neighboring segment ranges. @default 0.35 */
  overlap?: number
  /** Follow scroll through a light spring so segments settle softly. @default true */
  smooth?: boolean
  /** Scrollable element to observe instead of the page. */
  container?: React.RefObject<HTMLElement | null>
  /** Motion scroll offsets for the text block. @default ["start 0.85", "end 0.35"] */
  offset?: UseScrollOptions["offset"]
  /** Classes applied to every text segment. */
  segmentClassName?: string
}

interface Token {
  text: string
  space: boolean
}

const CJK = "\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}\\p{Script=Hangul}"
const WORD_PATTERN = new RegExp(
  `\\s+|[${CJK}][\\p{P}]*|[^\\s${CJK}]+`,
  "gu"
)

function tokenize(text: string, per: ScrollTextPer): Token[] {
  if (per === "line") {
    return text
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => ({ text: line.trim(), space: false }))
  }

  return (text.match(WORD_PATTERN) ?? []).map((segment) => ({
    text: segment,
    space: /^\s+$/.test(segment),
  }))
}

interface ScrollTextSegmentProps {
  children: string
  index: number
  count: number
  mode: ScrollTextMode
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
  const step = span / Math.max(count, 1)
  const start = range[0] + step * index
  const end = Math.min(range[1], start + step * (1 + overlap))
  const opacity = useTransform(progress, [start, end], [0, 1])
  const y = useTransform(progress, [start, end], ["105%", "0%"])
  const blurY = useTransform(progress, [start, end], ["0.35em", "0em"])
  const filter = useTransform(
    progress,
    [start, end],
    ["blur(10px)", "blur(0px)"]
  )
  const display = line ? "block" : "inline-block"

  if (mode === "reveal") {
    return (
      <span
        data-slot="scroll-text-segment-mask"
        className={cn(
          "-mb-[0.12em] overflow-hidden pb-[0.12em] align-top",
          display,
          className
        )}
      >
        <motion.span
          data-slot="scroll-text-segment"
          className={cn(display, "will-change-transform")}
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

  if (mode === "blur") {
    return (
      <motion.span
        data-slot="scroll-text-segment"
        className={cn(display, className)}
        style={
          reduceMotion
            ? undefined
            : { opacity, y: blurY, filter, willChange: "transform, filter" }
        }
      >
        {children}
      </motion.span>
    )
  }

  return (
    <span
      data-slot="scroll-text-segment"
      className={cn("text-muted-foreground relative", display, className)}
    >
      {children}
      <motion.span
        className="text-foreground absolute inset-0"
        style={{ opacity: reduceMotion ? 1 : opacity }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** Reveals lines or progressively highlights words according to scroll progress. */
function ScrollText({
  children,
  mode = "highlight",
  per = "word",
  as = "p",
  range = [0, 1],
  overlap = 0.35,
  smooth = true,
  container,
  offset = ["start 0.85", "end 0.35"],
  segmentClassName,
  className,
  ...props
}: ScrollTextProps) {
  const target = React.useRef<HTMLElement>(null)
  const reduceMotion = Boolean(useReducedMotion())
  const { scrollYProgress } = useScroll({ target, container, offset })
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.35,
    restDelta: 0.0005,
  })
  const progress = smooth ? springProgress : scrollYProgress
  const Component = React.useMemo(() => motion.create(as), [as])
  const tokens = React.useMemo(() => tokenize(children, per), [children, per])
  const count = tokens.reduce(
    (total, token) =>
      token.space
        ? total
        : total + (per === "char" ? Array.from(token.text).length : 1),
    0
  )
  let segmentIndex = 0

  function renderSegment(text: string, key: React.Key) {
    return (
      <ScrollTextSegment
        key={key}
        index={segmentIndex++}
        count={count}
        mode={mode}
        range={range}
        overlap={overlap}
        progress={progress}
        reduceMotion={reduceMotion}
        line={per === "line"}
        className={segmentClassName}
      >
        {text}
      </ScrollTextSegment>
    )
  }

  return (
    <Component
      ref={target}
      data-slot="scroll-text"
      data-mode={mode}
      className={cn(per === "line" && "flex flex-col", className)}
      {...props}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="contents">
        {tokens.map((token, index) => {
          if (token.space) {
            return <React.Fragment key={index}>{token.text}</React.Fragment>
          }

          if (per === "char") {
            return (
              <span key={index} className="inline-block whitespace-nowrap">
                {Array.from(token.text).map((char, charIndex) =>
                  renderSegment(char, charIndex)
                )}
              </span>
            )
          }

          return renderSegment(token.text, index)
        })}
      </span>
    </Component>
  )
}

export { ScrollText }
