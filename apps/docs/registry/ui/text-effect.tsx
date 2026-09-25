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
  | "fade"
  | "blur"
  | "blur-sm"
  | "fade-in-blur"
  | "scale"
  | "slide"
  | "rise"
  | "drop"
  | "flip"

const presetVariants: Record<TextEffectPreset, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(12px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(12px)" },
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
  rise: {
    hidden: { opacity: 0, y: "0.6em" },
    visible: { opacity: 1, y: "0em" },
    exit: { opacity: 0, y: "-0.3em" },
  },
  drop: {
    hidden: { opacity: 0, y: "-0.6em" },
    visible: { opacity: 1, y: "0em" },
    exit: { opacity: 0, y: "0.3em" },
  },
  flip: {
    hidden: { opacity: 0, rotateX: 90, transformPerspective: 600 },
    visible: { opacity: 1, rotateX: 0, transformPerspective: 600 },
    exit: { opacity: 0, rotateX: -90, transformPerspective: 600 },
  },
}

/** Presets whose motion reads better on a spring than on a tween. */
const springPresets: Partial<Record<TextEffectPreset, Transition>> = {
  rise: { type: "spring", stiffness: 420, damping: 28, mass: 0.6 },
  drop: { type: "spring", stiffness: 420, damping: 26, mass: 0.6 },
  flip: { type: "spring", stiffness: 300, damping: 24, mass: 0.7 },
}

export interface TextEffectProps extends React.ComponentProps<"p"> {
  /** Text split into animated segments. */
  children: string
  /** Segment granularity. CJK text is animated per character in `word` mode. @default "word" */
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

const cjkPattern =
  /[⺀-⿿　-〿぀-ヿ㐀-䶿一-鿿가-힯豈-﫿＀-￯]/

type Token = { text: string; whitespace: boolean; chars?: string[] }

/**
 * Splits text into animation units. Whitespace is kept as plain text so the
 * browser can still wrap lines naturally; CJK runs have no spaces, so they
 * are broken per character to keep both wrapping and staggering meaningful.
 */
function tokenize(
  text: string,
  per: NonNullable<TextEffectProps["per"]>
): Token[] {
  if (per === "line") {
    return text.split("\n").map((line) => ({ text: line, whitespace: false }))
  }

  const tokens: Token[] = []
  for (const part of text.split(/(\s+)/)) {
    if (!part) continue
    if (/^\s+$/.test(part)) {
      tokens.push({ text: part, whitespace: true })
    } else if (cjkPattern.test(part)) {
      for (const char of Array.from(part)) {
        tokens.push({ text: char, whitespace: false })
      }
    } else if (per === "char") {
      tokens.push({ text: part, whitespace: false, chars: Array.from(part) })
    } else {
      tokens.push({ text: part, whitespace: false })
    }
  }
  return tokens
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
  const tokens = React.useMemo(() => tokenize(children, per), [children, per])
  const stagger =
    (per === "char" ? 0.025 : per === "word" ? 0.06 : 0.12) / speedReveal
  const containerVariants: Variants = reduceMotion
    ? { hidden: {}, visible: {}, exit: {} }
    : (variants?.container ?? {
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
        exit: {
          transition: { staggerChildren: stagger, staggerDirection: -1 },
        },
      })
  const itemVariants = variants?.item ?? presetVariants[preset]
  const itemTransition: Transition = reduceMotion
    ? { duration: 0 }
    : {
        duration: 0.4 / speedSegment,
        ease: [0.22, 1, 0.36, 1],
        ...(variants?.item ? undefined : springPresets[preset]),
        ...segmentTransition,
      }

  const segmentClassName = cn(
    per === "line" ? "block" : "inline-block",
    segmentWrapperClassName
  )

  const renderSegment = (text: string, key: string, hidden?: boolean) => (
    <motion.span
      aria-hidden={hidden || undefined}
      data-slot="text-effect-segment"
      key={key}
      className={segmentClassName}
      variants={itemVariants}
      transition={itemTransition}
    >
      {text}
    </motion.span>
  )

  return (
    <Component
      data-slot="text-effect"
      className={cn(per === "line" && "flex flex-col", className)}
      initial="hidden"
      animate={reduceMotion || trigger ? "visible" : "exit"}
      variants={containerVariants}
      transition={containerTransition}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
      {...props}
    >
      <span className="sr-only">{children}</span>
      {tokens.map((token, index) => {
        if (token.whitespace) {
          return (
            <span aria-hidden="true" key={`space-${index}`}>
              {token.text}
            </span>
          )
        }
        if (token.chars) {
          // Keep the characters of a Latin word together while each one
          // animates on its own.
          return (
            <span
              aria-hidden="true"
              key={`word-${index}`}
              className="inline-block whitespace-nowrap"
            >
              {token.chars.map((char, charIndex) =>
                renderSegment(char, `${char}-${index}-${charIndex}`)
              )}
            </span>
          )
        }
        return renderSegment(token.text, `${token.text}-${index}`, true)
      })}
    </Component>
  )
}

export { TextEffect, presetVariants as textEffectPresets }
