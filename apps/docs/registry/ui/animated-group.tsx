"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  type Transition,
  type UseInViewOptions,
  type Variants,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export type AnimatedGroupPreset =
  | "fade"
  | "slide"
  | "blur-slide"
  | "zoom"
  | "flip"
  | "bounce"
  | "scale"

const ease = [0.22, 1, 0.36, 1] as const

const tween: Transition = { duration: 0.5, ease }

/** Item variants of every preset, expressed as `hidden` → `visible`. */
export const animatedGroupPresets: Record<AnimatedGroupPreset, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: tween },
  },
  slide: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: tween },
  },
  "blur-slide": {
    hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: tween },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  },
  flip: {
    hidden: { opacity: 0, rotateX: -80, transformPerspective: 800 },
    visible: {
      opacity: 1,
      rotateX: 0,
      transformPerspective: 800,
      transition: { type: "spring", stiffness: 260, damping: 24 },
    },
  },
  bounce: {
    hidden: { opacity: 0, y: -32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 420, damping: 14, mass: 0.8 },
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1, transition: tween },
  },
}

type GroupElement = "div" | "ul" | "ol" | "section" | "span"
type ItemElement = "div" | "li" | "span" | "article"

export interface AnimatedGroupProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Items revealed one after another. Each direct child gets its own wrapper. */
  children: React.ReactNode
  /** Built-in entrance of every item. @default "slide" */
  preset?: AnimatedGroupPreset
  /** Custom item variants with `hidden` and `visible` states; overrides `preset`. */
  variants?: Variants
  /** Seconds between two items. @default 0.08 */
  stagger?: number
  /** Seconds before the first item starts. @default 0 */
  delay?: number
  /** Start when the group scrolls into view instead of on mount. @default false */
  inView?: boolean
  /** Play only the first time the group enters the viewport. @default true */
  once?: boolean
  /** Intersection options used when `inView` is on. */
  viewOptions?: Omit<UseInViewOptions, "once">
  /** Element rendered for the group. @default "div" */
  as?: GroupElement
  /** Element wrapping each item, e.g. `li` inside a `ul`. @default "div" */
  itemAs?: ItemElement
  /** Class applied to every item wrapper. */
  itemClassName?: string
}

/**
 * Staggers the entrance of its children with a shared preset, on mount or when
 * the group scrolls into view.
 */
function AnimatedGroup({
  children,
  preset = "slide",
  variants,
  stagger = 0.08,
  delay = 0,
  inView = false,
  once = true,
  viewOptions,
  as = "div",
  itemAs = "div",
  itemClassName,
  className,
  ...props
}: AnimatedGroupProps) {
  const reduceMotion = useReducedMotion()
  const Group = motion[as] as React.ElementType
  const Item = motion[itemAs] as React.ElementType
  const itemVariants = variants ?? animatedGroupPresets[preset]

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }

  const activation = reduceMotion
    ? { initial: false, animate: "visible" }
    : inView
      ? {
          initial: "hidden",
          whileInView: "visible",
          viewport: { ...viewOptions, once },
        }
      : { initial: "hidden", animate: "visible" }

  return (
    <Group
      data-slot="animated-group"
      className={className}
      variants={containerVariants}
      {...activation}
      {...props}
    >
      {React.Children.map(children, (child) => (
        <Item
          data-slot="animated-group-item"
          className={cn(itemClassName)}
          variants={itemVariants}
        >
          {child}
        </Item>
      ))}
    </Group>
  )
}

export { AnimatedGroup }
