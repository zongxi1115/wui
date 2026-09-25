"use client"

import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

export type TypewriterCursor = "bar" | "block" | "underscore" | "none"

export interface TypewriterProps
  extends Omit<React.ComponentProps<"span">, "children"> {
  /** Strings typed one after another. */
  texts: string[]
  /** Milliseconds spent typing each character. @default 70 */
  typeSpeed?: number
  /** Milliseconds spent deleting each character. @default 35 */
  deleteSpeed?: number
  /** Milliseconds a fully typed string stays before it is deleted. @default 1600 */
  pauseDuration?: number
  /** Milliseconds to wait before typing the first character. @default 0 */
  startDelay?: number
  /** Start over from the first string after the last one. @default true */
  loop?: boolean
  /** Keep the last string on screen instead of deleting it when `loop` is off. @default true */
  keepLast?: boolean
  /** Wait until the element scrolls into view before typing. @default false */
  startOnView?: boolean
  /** Caret shape. `none` hides the caret. @default "bar" */
  cursor?: TypewriterCursor
  /** Class applied to the caret element. */
  cursorClassName?: string
  /** Called after a string is fully typed, with its index. */
  onTyped?: (index: number) => void
  /** Called once when the last string is typed and `loop` is off. */
  onComplete?: () => void
}

type Phase = "idle" | "typing" | "pausing" | "deleting" | "done"

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" })

function toGraphemes(text: string) {
  return Array.from(graphemes.segment(text), (part) => part.segment)
}

const cursorShape: Record<Exclude<TypewriterCursor, "none">, string> = {
  bar: "ml-[0.08em] h-[1.1em] w-[2px] translate-y-[0.12em]",
  block: "ml-[0.08em] h-[1.1em] w-[0.55em] translate-y-[0.12em]",
  underscore: "ml-[0.06em] h-[2px] w-[0.6em]",
}

/**
 * Types strings character by character with a caret, then deletes them and
 * types the next one.
 */
function Typewriter({
  texts,
  typeSpeed = 70,
  deleteSpeed = 35,
  pauseDuration = 1600,
  startDelay = 0,
  loop = true,
  keepLast = true,
  startOnView = false,
  cursor = "bar",
  cursorClassName,
  onTyped,
  onComplete,
  className,
  ...props
}: TypewriterProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, { once: true })
  const [textIndex, setTextIndex] = React.useState(0)
  const [length, setLength] = React.useState(0)
  const [phase, setPhase] = React.useState<Phase>("idle")

  const characters = React.useMemo(
    () => toGraphemes(texts[textIndex]),
    [texts, textIndex]
  )
  const callbacks = React.useRef({ onTyped, onComplete })
  React.useEffect(() => {
    callbacks.current = { onTyped, onComplete }
  })

  const isLast = textIndex === texts.length - 1
  const canStart = !startOnView || inView

  React.useEffect(() => {
    if (phase !== "idle" || !canStart) return
    const timer = window.setTimeout(() => setPhase("typing"), startDelay)
    return () => window.clearTimeout(timer)
  }, [canStart, phase, startDelay])

  React.useEffect(() => {
    if (phase === "typing") {
      if (reduceMotion) {
        setLength(characters.length)
        setPhase("pausing")
        callbacks.current.onTyped?.(textIndex)
        return
      }
      if (length < characters.length) {
        const timer = window.setTimeout(() => setLength(length + 1), typeSpeed)
        return () => window.clearTimeout(timer)
      }
      callbacks.current.onTyped?.(textIndex)
      if (isLast && !loop && keepLast) {
        setPhase("done")
        callbacks.current.onComplete?.()
        return
      }
      setPhase("pausing")
      return
    }

    if (phase === "pausing") {
      const timer = window.setTimeout(() => {
        if (reduceMotion) {
          if (isLast && !loop) {
            setPhase("done")
            callbacks.current.onComplete?.()
            return
          }
          setTextIndex((textIndex + 1) % texts.length)
          setLength(0)
          setPhase("typing")
          return
        }
        setPhase("deleting")
      }, pauseDuration)
      return () => window.clearTimeout(timer)
    }

    if (phase === "deleting") {
      if (length > 0) {
        const timer = window.setTimeout(() => setLength(length - 1), deleteSpeed)
        return () => window.clearTimeout(timer)
      }
      if (isLast && !loop) {
        setPhase("done")
        callbacks.current.onComplete?.()
        return
      }
      setTextIndex((textIndex + 1) % texts.length)
      setPhase("typing")
    }
  }, [
    characters.length,
    deleteSpeed,
    isLast,
    keepLast,
    length,
    loop,
    pauseDuration,
    phase,
    reduceMotion,
    textIndex,
    texts.length,
    typeSpeed,
  ])

  const visible = characters.slice(0, length).join("")
  const blinking = phase === "idle" || phase === "pausing" || phase === "done"

  return (
    <span
      ref={ref}
      data-slot="typewriter"
      className={cn("inline-flex items-baseline whitespace-pre-wrap", className)}
      {...props}
    >
      <span className="sr-only" aria-live="polite">
        {texts[textIndex]}
      </span>
      <span aria-hidden="true" data-slot="typewriter-text">
        {visible}
        {cursor === "none" ? null : (
          <motion.span
            data-slot="typewriter-cursor"
            className={cn(
              "inline-block bg-current align-baseline",
              cursorShape[cursor],
              cursorClassName
            )}
            animate={
              blinking && !reduceMotion
                ? { opacity: [1, 1, 0, 0] }
                : { opacity: 1 }
            }
            transition={
              blinking && !reduceMotion
                ? {
                    duration: 1,
                    times: [0, 0.5, 0.5, 1],
                    repeat: Infinity,
                    ease: "linear",
                  }
                : { duration: 0 }
            }
          />
        )}
      </span>
    </span>
  )
}

export { Typewriter }
