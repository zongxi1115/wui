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
  | "blur-up"
  | "zoom-in"
  | "zoom-out"
  | "flip"

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
  "blur-up": {
    hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "zoom-in": {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1 },
  },
  "zoom-out": {
    hidden: { opacity: 0, scale: 1.12, filter: "blur(4px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },
  flip: {
    hidden: { opacity: 0, rotateX: -70, y: 8, transformPerspective: 800 },
    visible: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 800 },
  },
}

/** Reusable transition presets. */
export const motionTransitions = {
  smooth: { duration: 0.3, ease: "easeOut" },
  spring: { type: "spring", stiffness: 400, damping: 30, mass: 0.7 },
  snappy: { type: "spring", stiffness: 700, damping: 35 },
  gentle: { type: "spring", bounce: 0, visualDuration: 0.5 },
  bouncy: { type: "spring", bounce: 0.35, visualDuration: 0.45 },
} satisfies Record<string, Transition>

export type MotionTransition = keyof typeof motionTransitions

function resolveTransition(transition: MotionTransition | Transition) {
  return typeof transition === "string"
    ? motionTransitions[transition]
    : transition
}

type MotionGroupContextValue = {
  preset?: MotionPreset
  transition?: MotionTransition | Transition
}

const MotionGroupContext = React.createContext<MotionGroupContextValue | null>(
  null
)

const MotionSlot = motion.create(Slot.Root)

export interface MotionProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "transition"> {
  /** Named enter animation. Inherits from `MotionGroup` when omitted. @default "fade" */
  preset?: MotionPreset
  /** A named transition preset or a custom motion Transition. @default "smooth" */
  transition?: MotionTransition | Transition
  /** Delay before animating, in seconds. Ignored inside `MotionGroup`. */
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
 * Respects `prefers-reduced-motion` (jumps straight to the final state). Use
 * `asChild` to animate an existing element (e.g. a Button) without an extra
 * wrapper node. Inside `MotionGroup`, it follows the group's stagger timing.
 */
function Motion({
  preset,
  transition,
  delay,
  inView = false,
  once = true,
  asChild = false,
  ...props
}: MotionProps) {
  const group = React.useContext(MotionGroupContext)
  const reduceMotion = useReducedMotion()
  const Comp = (asChild ? MotionSlot : motion.div) as React.ElementType

  // Reduced motion keeps the exact same markup (so server and client HTML
  // match) and simply jumps to the final state.
  const resolvedTransition = reduceMotion
    ? { duration: 0 }
    : resolveTransition(transition ?? group?.transition ?? "smooth")
  const variants = motionPresets[preset ?? group?.preset ?? "fade"]

  // Inside a group the parent orchestrates `hidden` → `visible` so that
  // `staggerChildren` can sequence every item.
  const activation = group
    ? {}
    : inView
      ? { initial: "hidden", whileInView: "visible", viewport: { once } }
      : { initial: "hidden", animate: "visible" }

  return (
    <Comp
      data-slot="motion"
      variants={variants}
      transition={
        group || reduceMotion
          ? resolvedTransition
          : { ...resolvedTransition, delay }
      }
      {...activation}
      {...props}
    />
  )
}

export interface MotionGroupProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "transition"> {
  /** Seconds between each child `Motion` starting. @default 0.06 */
  stagger?: number
  /** Delay before the first child animates, in seconds. @default 0 */
  delay?: number
  /** Default preset for child `Motion` elements without their own preset. */
  preset?: MotionPreset
  /** Default transition for child `Motion` elements. */
  transition?: MotionTransition | Transition
  /** Start the sequence when the group scrolls into view. @default false */
  inView?: boolean
  /** Only play the sequence the first time it enters the viewport. @default true */
  once?: boolean
  /** Merge the group onto its single child element instead of rendering a div. */
  asChild?: boolean
}

/**
 * Orchestrates nested `Motion` children so they enter one after another.
 * Children inherit the group's `preset` and `transition` unless they set
 * their own.
 */
function MotionGroup({
  stagger = 0.06,
  delay = 0,
  preset,
  transition,
  inView = false,
  once = true,
  asChild = false,
  ...props
}: MotionGroupProps) {
  const reduceMotion = useReducedMotion()
  const Comp = (asChild ? MotionSlot : motion.div) as React.ElementType
  const context = React.useMemo(
    () => ({ preset, transition }),
    [preset, transition]
  )

  const activation = inView
    ? { initial: "hidden", whileInView: "visible", viewport: { once } }
    : { initial: "hidden", animate: "visible" }

  return (
    <MotionGroupContext.Provider value={context}>
      <Comp
        data-slot="motion-group"
        variants={{
          hidden: {},
          visible: {
            transition: reduceMotion
              ? {}
              : { staggerChildren: stagger, delayChildren: delay },
          },
        }}
        {...activation}
        {...props}
      />
    </MotionGroupContext.Provider>
  )
}

export { Motion, MotionGroup }
