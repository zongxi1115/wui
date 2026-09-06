"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

const defaultCharacterSet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*"

export interface TextScrambleProps extends React.ComponentProps<"p"> {
  /** Final text revealed by the scramble. */
  children: string
  /** HTML element rendered by the component. @default "p" */
  as?: React.ElementType
  /** Total reveal duration in seconds. @default 0.8 */
  duration?: number
  /** Seconds between scramble frames. @default 0.04 */
  speed?: number
  /** Characters sampled while scrambling. */
  characterSet?: string
  /** Start the effect. Toggling false then true replays it. @default true */
  trigger?: boolean
  /** Called after every character reaches its final value. */
  onScrambleComplete?: () => void
}

/** Resolves randomized characters into the supplied text. */
function TextScramble({
  children,
  as = "p",
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultCharacterSet,
  trigger = true,
  onScrambleComplete,
  className,
  ...props
}: TextScrambleProps) {
  const Component = as
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = React.useState(children)

  React.useEffect(() => {
    if (!trigger || reduceMotion) {
      setDisplay(children)
      return
    }

    const startedAt = performance.now()
    const frameDuration = Math.max(speed * 1000, 16)
    const totalDuration = Math.max(duration * 1000, frameDuration)
    const timer = window.setInterval(() => {
      const progress = Math.min(
        (performance.now() - startedAt) / totalDuration,
        1
      )
      const resolved = Math.floor(progress * children.length)
      setDisplay(
        Array.from(children)
          .map((character, index) => {
            if (/\s/.test(character) || index < resolved) return character
            return (
              characterSet[Math.floor(Math.random() * characterSet.length)] ??
              character
            )
          })
          .join("")
      )
      if (progress >= 1) {
        window.clearInterval(timer)
        setDisplay(children)
        onScrambleComplete?.()
      }
    }, frameDuration)

    return () => window.clearInterval(timer)
  }, [
    characterSet,
    children,
    duration,
    onScrambleComplete,
    reduceMotion,
    speed,
    trigger,
  ])

  return (
    <Component
      aria-label={children}
      data-slot="text-scramble"
      className={cn("font-mono", className)}
      {...props}
    >
      <span aria-hidden="true">{display}</span>
    </Component>
  )
}

export { TextScramble }
