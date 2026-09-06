"use client"

import * as React from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface ShinyButtonProps extends HTMLMotionProps<"button"> {
  /** Seconds for one full light sweep across the button. @default 3 */
  speed?: number
  /** Pause between sweeps, in seconds. @default 1.2 */
  gap?: number
  // Narrows motion's children type (which allows MotionValue) back to ReactNode.
  children?: React.ReactNode
}

/**
 * A "fancy" template component: a filled button with a light sweep that
 * continuously glides across it. Effect components like this are opt-in and are
 * allowed to be more opinionated than the core UI — but they still gate motion
 * on `prefers-reduced-motion`. Copy it as a starting point for your own effects.
 */
function ShinyButton({
  className,
  speed = 3,
  gap = 1.2,
  children,
  ...props
}: ShinyButtonProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      data-slot="shiny-button"
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      className={cn(
        "relative inline-flex h-10 shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border border-primary/20 bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
      {reduceMotion ? null : (
        <motion.span
          aria-hidden
          data-slot="shiny-button-sheen"
          className="pointer-events-none absolute inset-y-0 w-1/2"
          style={{
            background:
              "linear-gradient(120deg, transparent 20%, var(--shine) 50%, transparent 80%)",
          }}
          initial={{ x: "-150%" }}
          animate={{ x: "300%" }}
          transition={{
            duration: speed,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: gap,
          }}
        />
      )}
    </motion.button>
  )
}

export { ShinyButton }
