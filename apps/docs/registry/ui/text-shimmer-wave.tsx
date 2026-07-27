"use client"

import * as React from "react"
import { motion, useReducedMotion, type Transition } from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface TextShimmerWaveProps extends React.ComponentProps<"span"> {
  /** Text animated as a traveling character wave. */
  children: string
  /** HTML element rendered by the component. @default "span" */
  as?: React.ElementType
  /** Seconds for one full wave. @default 1.5 */
  duration?: number
  /** Z-axis travel in pixels. @default 10 */
  zDistance?: number
  /** Horizontal travel in pixels. @default 2 */
  xDistance?: number
  /** Vertical travel in pixels. @default -2 */
  yDistance?: number
  /** Distance between character wave phases. @default 1 */
  spread?: number
  /** Peak character scale. @default 1.1 */
  scaleDistance?: number
  /** Peak Y-axis rotation in degrees. @default 10 */
  rotateYDistance?: number
  /** Motion transition merged into every character. */
  transition?: Transition
}

/** Sends a shimmer-like 3D wave through text, one character at a time. */
function TextShimmerWave({
  children,
  as = "span",
  duration = 1.5,
  zDistance = 10,
  xDistance = 2,
  yDistance = -2,
  spread = 1,
  scaleDistance = 1.1,
  rotateYDistance = 10,
  transition,
  className,
  ...props
}: TextShimmerWaveProps) {
  const Component = as
  const reduceMotion = useReducedMotion()

  return (
    <Component
      aria-label={children}
      data-slot="text-shimmer-wave"
      className={cn("inline-flex [perspective:400px]", className)}
      {...props}
    >
      {Array.from(children).map((character, index) => (
        <motion.span
          aria-hidden="true"
          data-slot="text-shimmer-wave-character"
          className="text-muted-foreground inline-block whitespace-pre"
          key={`${character}-${index}`}
          animate={
            reduceMotion
              ? undefined
              : {
                  color: [
                    "var(--muted-foreground)",
                    "var(--foreground)",
                    "var(--muted-foreground)",
                  ],
                  x: [0, xDistance, 0],
                  y: [0, yDistance, 0],
                  z: [0, zDistance, 0],
                  scale: [1, scaleDistance, 1],
                  rotateY: [0, rotateYDistance, 0],
                }
          }
          transition={{
            duration,
            ease: "easeInOut",
            repeat: Infinity,
            delay: (index * duration * 0.08) / Math.max(spread, 0.1),
            ...transition,
          }}
        >
          {character === " " ? "\u00a0" : character}
        </motion.span>
      ))}
    </Component>
  )
}

export { TextShimmerWave }
