"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export type TextEffectPreset =
  "fade" | "blur-sm" | "fade-in-blur" | "scale" | "slide"

const presetVariants: Record<TextEffectPreset, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "blur-sm": {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(4px)" },
  },
  "fade-in-blur": {
    hidden: { opacity: 0, y: 8, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, filter: "blur(8px)" },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.85 },
  },
  slide: {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -18 },
  },
}

export interface TextEffectProps extends React.ComponentProps<"p"> {
  /** Text split into animated segments. */
  children: string
  /** Segment granularity. @default "word" */
  per?: "word" | "char" | "line"
  /** HTML element rendered by the component. @default "p" */
  as?: React.ElementType
  /** Built-in segment animation. @default "fade" */
  preset?: TextEffectPreset
  /** Custom container and segment variants. */
  variants?: { container?: Variants; item?: Variants }
  /** Delay before the reveal begins, in seconds. @default 0 */
  delay?: number
  /** Reveal or hide the text. @default true */
  trigger?: boolean
  /** Multiplier for the container stagger speed. @default 1 */
  speedReveal?: number
  /** Multiplier for each segment's animation speed. @default 1 */
  speedSegment?: number
  /** Extra class applied to every segment wrapper. */
  segmentWrapperClassName?: string
  /** Custom container transition. */
  containerTransition?: Transition
  /** Custom transition for each segment. */
  segmentTransition?: Transition
  /** Called when the reveal animation starts. */
  onAnimationStart?: () => void
  /** Called when the reveal animation completes. */
  onAnimationComplete?: () => void
}

function splitText(text: string, per: NonNullable<TextEffectProps["per"]>) {
  if (per === "line") return text.split("\n")
  if (per === "word") return text.split(/(\s+)/)
  return Array.from(text)
}

/** Reveals text by line, word or character using a built-in or custom preset. */
function TextEffect({
  children,
  per = "word",
  as = "p",
  preset = "fade",
  variants,
  delay = 0,
  trigger = true,
  speedReveal = 1,
  speedSegment = 1,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  className,
  onAnimationStart,
  onAnimationComplete,
  ...props
}: TextEffectProps) {
  const reduceMotion = useReducedMotion()
  const Component = React.useMemo(() => motion.create(as), [as])
  const segments = React.useMemo(
    () => splitText(children, per),
    [children, per]
  )
  const stagger =
    (per === "char" ? 0.025 : per === "word" ? 0.06 : 0.12) / speedReveal
  const containerVariants: Variants = variants?.container ?? {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
    exit: { transition: { staggerChildren: stagger, staggerDirection: -1 } },
  }
  const itemVariants = variants?.item ?? presetVariants[preset]

  if (reduceMotion) {
    return (
      <Component data-slot="text-effect" className={className} {...props}>
        {children}
      </Component>
    )
  }

  return (
    <Component
      aria-label={children}
      data-slot="text-effect"
      className={cn(per === "line" && "flex flex-col", className)}
      initial="hidden"
      animate={trigger ? "visible" : "exit"}
      variants={containerVariants}
      transition={containerTransition}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
      {...props}
    >
      {segments.map((segment, index) => {
        const whitespace = /^\s+$/.test(segment)
        return (
          <motion.span
            aria-hidden="true"
            data-slot="text-effect-segment"
            key={`${segment}-${index}`}
            className={cn(
              per === "line" ? "block" : "inline-block",
              whitespace && per !== "line" && "whitespace-pre",
              segmentWrapperClassName
            )}
            variants={itemVariants}
            transition={{
              duration: 0.35 / speedSegment,
              ease: "easeOut",
              ...segmentTransition,
            }}
          >
            {segment}
          </motion.span>
        )
      })}
    </Component>
  )
}

export { TextEffect, presetVariants as textEffectPresets }
