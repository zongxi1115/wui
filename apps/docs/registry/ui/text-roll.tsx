"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

const defaultVariants: Variants = {
  rest: { y: "0%" },
  hover: { y: "-50%" },
}

export interface TextRollProps extends React.ComponentProps<"span"> {
  /** Text rolled character by character. */
  children: string
  /** Duration of each character roll in seconds. @default 0.45 */
  duration?: number
  /** Delay for each character entering the roll. */
  getEnterDelay?: (index: number) => number
  /** Delay for each character returning to rest. */
  getExitDelay?: (index: number) => number
  /** Motion transition merged into every character. */
  transition?: Transition
  /** Rest and hover states for each character track. */
  variants?: Variants
  /**
   * What plays the roll. `"hover"` listens on the text itself, `"parent"`
   * listens on the closest link or button (padding included, plus keyboard
   * focus), and `"mount"` rolls once immediately. @default "hover"
   */
  trigger?: "hover" | "parent" | "mount"
  /** Control the rolled state from outside the component. */
  active?: boolean
}

/** Rolls a second copy of each character into view. */
function TextRoll({
  children,
  className,
  duration = 0.45,
  getEnterDelay = (index) => index * 0.025,
  getExitDelay = (index) => index * 0.02,
  transition,
  variants = defaultVariants,
  trigger = "hover",
  active: activeProp,
  onMouseEnter,
  onMouseLeave,
  ...props
}: TextRollProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = React.useState(false)
  const active = activeProp ?? (trigger === "mount" || hovered)

  React.useEffect(() => {
    const element = ref.current
    if (trigger !== "parent" || !element) return
    const target =
      element.parentElement?.closest<HTMLElement>(
        "a, button, [role='button'], [data-text-roll-trigger]"
      ) ?? element.parentElement
    if (!target) return

    const enter = () => setHovered(true)
    const leave = () => setHovered(false)
    const focusIn = () => {
      if (target.matches(":focus-visible")) setHovered(true)
    }
    target.addEventListener("pointerenter", enter)
    target.addEventListener("pointerleave", leave)
    target.addEventListener("focusin", focusIn)
    target.addEventListener("focusout", leave)
    return () => {
      target.removeEventListener("pointerenter", enter)
      target.removeEventListener("pointerleave", leave)
      target.removeEventListener("focusin", focusIn)
      target.removeEventListener("focusout", leave)
    }
  }, [trigger])

  return (
    <span
      ref={ref}
      data-slot="text-roll"
      data-state={active ? "rolled" : "rest"}
      className={cn("inline-flex", className)}
      onMouseEnter={(event) => {
        if (trigger === "hover") setHovered(true)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        if (trigger === "hover") setHovered(false)
        onMouseLeave?.(event)
      }}
      {...props}
    >
      <span className="sr-only">{children}</span>
      {Array.from(children).map((character, index) => (
        <span
          aria-hidden="true"
          data-slot="text-roll-character"
          // 1.2em leaves room for ascenders and descenders (g, y, p) that a
          // 1em window would clip.
          className="inline-block h-[1.2em] overflow-hidden leading-[1.2]"
          key={`${character}-${index}`}
        >
          <motion.span
            className="flex flex-col"
            variants={variants}
            initial="rest"
            animate={reduceMotion ? "rest" : active ? "hover" : "rest"}
            transition={{
              duration,
              ease: [0.22, 1, 0.36, 1],
              delay: active ? getEnterDelay(index) : getExitDelay(index),
              ...transition,
            }}
          >
            <span className="block h-[1.2em] whitespace-pre">{character}</span>
            <span className="block h-[1.2em] whitespace-pre">{character}</span>
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export { TextRoll }
