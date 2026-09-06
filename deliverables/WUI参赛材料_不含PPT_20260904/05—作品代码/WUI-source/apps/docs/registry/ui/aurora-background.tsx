"use client"

import * as React from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface AuroraBackgroundProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  /** Foreground content rendered above the aurora layers. */
  children?: React.ReactNode
  /** Three CSS colors used by the moving light fields. */
  colors?: [string, string, string]
  /** Seconds for one complete movement cycle. @default 18 */
  duration?: number
  /** Blur strength in pixels. @default 56 */
  blur?: number
  /** Classes applied to every aurora layer. */
  layerClassName?: string
}

/** Layers slow, blurred color fields behind content. */
function AuroraBackground({
  children,
  colors = ["var(--info)", "var(--success)", "var(--warning)"],
  duration = 18,
  blur = 56,
  className,
  layerClassName,
  ...props
}: AuroraBackgroundProps) {
  const reduceMotion = useReducedMotion()
  const positions = [
    "-left-[18%] -top-[28%] h-[85%] w-[75%]",
    "-bottom-[34%] left-[24%] h-[90%] w-[72%]",
    "-right-[24%] top-[8%] h-[72%] w-[62%]",
  ]

  return (
    <motion.div
      data-slot="aurora-background"
      className={cn(
        "bg-foreground relative isolate overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {colors.map((color, index) => (
          <motion.div
            key={color}
            data-slot="aurora-background-layer"
            className={cn(
              "absolute rounded-[50%] opacity-65 mix-blend-screen",
              positions[index],
              layerClassName
            )}
            style={{
              background: `radial-gradient(closest-side, ${color}, transparent)`,
              filter: `blur(${blur}px)`,
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    x: index === 1 ? [0, -36, 28, 0] : [0, 42, -24, 0],
                    y: index === 2 ? [0, 34, -18, 0] : [0, -24, 30, 0],
                    scale: [1, 1.12, 0.96, 1],
                  }
            }
            transition={{
              duration: duration + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

export { AuroraBackground }
