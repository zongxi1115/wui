"use client"

import * as React from "react"
import {
  motion,
  useInView as useMotionInView,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition,
  type UseInViewOptions,
  type Variants,
} from "motion/react"

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export interface InViewProps extends Omit<
  HTMLMotionProps<"div">,
  "children" | "variants"
> {
  /** Content animated when it enters the viewport. */
  children: React.ReactNode
  /** Hidden and visible animation states. */
  variants?: Variants
  /** Motion transition used between states. */
  transition?: Transition
  /** Intersection observer options such as `margin` and `amount`. */
  viewOptions?: UseInViewOptions
  /** Only play the entrance animation once. @default true */
  once?: boolean
  /** HTML element rendered by the component. @default "div" */
  as?: React.ElementType
}

/** Animates content when it enters the viewport. */
function InView({
  children,
  variants = defaultVariants,
  transition = { duration: 0.45, ease: "easeOut" },
  viewOptions,
  once = true,
  as = "div",
  ...props
}: InViewProps) {
  const ref = React.useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const isInView = useMotionInView(ref, { ...viewOptions, once })
  const MotionComponent = React.useMemo(() => motion.create(as), [as])

  return (
    <MotionComponent
      ref={ref}
      data-slot="in-view"
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion || isInView ? "visible" : "hidden"}
      variants={variants}
      transition={reduceMotion ? { duration: 0 } : transition}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}

export { InView }
