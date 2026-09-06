"use client"

import * as React from "react"
import { Slot } from "radix-ui"
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition,
  type Variants,
} from "motion/react"

export type MotionPreset =
  | "fade"
  | "scale"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "pop"
  | "blur"

/** Enter animations, expressed as `hidden` → `visible` variants. */
export const motionPresets: Record<MotionPreset, Variants> = {
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-down": {
    hidden: { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 12 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0 },
  },
  pop: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(6px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
}

/** Reusable transition presets. */
export const motionTransitions = {
  smooth: { duration: 0.3, ease: "easeOut" },
  spring: { type: "spring", stiffness: 400, damping: 30, mass: 0.7 },
  snappy: { type: "spring", stiffness: 700, damping: 35 },
} satisfies Record<string, Transition>

export type MotionTransition = keyof typeof motionTransitions

const MotionSlot = motion.create(Slot.Root)

export interface MotionProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "transition"> {
  /** Named enter animation. @default "fade" */
  preset?: MotionPreset
  /** A named transition preset or a custom motion Transition. @default "smooth" */
  transition?: MotionTransition | Transition
  /** Delay before animating, in seconds. */
  delay?: number
  /** Animate when scrolled into view instead of on mount. @default false */
  inView?: boolean
  /** Only animate the first time it enters the viewport. @default true */
  once?: boolean
  /** Merge motion onto the single child element instead of rendering a div. */
  asChild?: boolean
}

/**
 * A small opt-in wrapper that animates its children with a named preset.
 * Respects `prefers-reduced-motion` (renders statically when set). Use
 * `asChild` to animate an existing element (e.g. a Button) without an extra
 * wrapper node.
 */
function Motion({
  preset = "fade",
  transition = "smooth",
  delay,
  inView = false,
  once = true,
  asChild = false,
  ...props
}: MotionProps) {
  const reduceMotion = useReducedMotion()
  const Comp = (asChild ? MotionSlot : motion.div) as React.ElementType

  if (reduceMotion) {
    return <Comp {...props} />
  }

  const resolvedTransition =
    typeof transition === "string" ? motionTransitions[transition] : transition

  const activation = inView
    ? { initial: "hidden", whileInView: "visible", viewport: { once } }
    : { initial: "hidden", animate: "visible" }

  return (
    <Comp
      data-slot="motion"
      variants={motionPresets[preset]}
      transition={{ ...resolvedTransition, delay }}
      {...activation}
      {...props}
    />
  )
}

export { Motion }
