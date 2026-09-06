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
  /** Play on hover or immediately on mount. @default "hover" */
  trigger?: "hover" | "mount"
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
  onMouseEnter,
  onMouseLeave,
  ...props
}: TextRollProps) {
  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = React.useState(false)
  const active = trigger === "mount" || hovered

  return (
    <span
      aria-label={children}
      data-slot="text-roll"
      className={cn("inline-flex", className)}
      onMouseEnter={(event) => {
        setHovered(true)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        setHovered(false)
        onMouseLeave?.(event)
      }}
      {...props}
    >
      {Array.from(children).map((character, index) => (
        <span
          aria-hidden="true"
          data-slot="text-roll-character"
          className="inline-block h-[1em] overflow-hidden leading-none"
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
            <span className="block h-[1em] whitespace-pre">
              {character === " " ? "\u00a0" : character}
            </span>
            <span className="block h-[1em] whitespace-pre">
              {character === " " ? "\u00a0" : character}
            </span>
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export { TextRoll }
