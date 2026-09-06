"use client"

import * as React from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface GlowProps extends Omit<HTMLMotionProps<"div">, "children"> {
  /** Content placed above the glow. */
  children: React.ReactNode
  /** Visual treatment for the illuminated edge. @default "rainbow" */
  variant?: "rainbow" | "solid"
  /** CSS color used by the solid variant. @default "oklch(0.7 0.2 260)" */
  color?: string
  /** Colors distributed around the rainbow edge. */
  colors?: string[]
  /** Distance the light spreads beyond the edge, in pixels. @default 18 */
  spread?: number
  /** Width of the illuminated edge, in pixels. @default 1 */
  borderWidth?: number
  /** Peak opacity of the glow. @default 0.7 */
  glowOpacity?: number
  /** Gently pulse the solid variant. @default true */
  pulse?: boolean
  /** Seconds for one animation cycle. @default 4 */
  duration?: number
}

/** Adds an illuminated border and soft light around all four sides of content. */
function Glow({
  children,
  variant = "rainbow",
  color = "oklch(0.7 0.2 260)",
  colors = ["#ff3d81", "#ffb800", "#34d399", "#38bdf8", "#8b5cf6", "#ff3d81"],
  spread = 18,
  borderWidth = 1,
  glowOpacity = 0.7,
  pulse = true,
  duration = 4,
  className,
  ...props
}: GlowProps) {
  const reduceMotion = useReducedMotion()
  const shouldPulse = pulse && !reduceMotion
  const lightSpread = Math.max(0, spread)
  const edgeWidth = Math.max(0, borderWidth)
  const gradient = (angle: number) =>
    `conic-gradient(from ${angle}deg, ${colors.join(", ")})`
  const mask =
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)"
  const ringStyle: React.CSSProperties = {
    inset: -edgeWidth,
    padding: edgeWidth,
    maskImage: mask,
    maskComposite: "exclude",
    WebkitMaskImage: mask,
    WebkitMaskComposite: "xor",
  }

  const rainbowTransition = reduceMotion
    ? { duration: 0 }
    : { duration, ease: "linear" as const, repeat: Infinity }

  return (
    <motion.div
      data-slot="glow"
      className={cn("relative isolate rounded-lg", className)}
      {...props}
    >
      {variant === "rainbow" ? (
        <>
          <motion.div
            aria-hidden="true"
            data-slot="glow-light"
            className="pointer-events-none absolute rounded-[inherit]"
            style={{
              ...ringStyle,
              backgroundImage: gradient(0),
              filter: `blur(${lightSpread * 0.45}px)`,
            }}
            initial={false}
            animate={
              reduceMotion
                ? { opacity: glowOpacity }
                : {
                    backgroundImage: [gradient(0), gradient(360)],
                    opacity: glowOpacity,
                  }
            }
            transition={rainbowTransition}
          />
          <motion.div
            aria-hidden="true"
            data-slot="glow-edge"
            className="pointer-events-none absolute rounded-[inherit]"
            style={{ ...ringStyle, backgroundImage: gradient(0) }}
            initial={false}
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    backgroundImage: [gradient(0), gradient(360)],
                    opacity: 1,
                  }
            }
            transition={rainbowTransition}
          />
        </>
      ) : (
        <motion.div
          aria-hidden="true"
          data-slot="glow-light"
          className="pointer-events-none absolute rounded-[inherit]"
          style={{
            inset: -edgeWidth,
            border: `${edgeWidth}px solid ${color}`,
            boxShadow: `0 0 ${lightSpread * 0.45}px ${color}, 0 0 ${lightSpread}px ${color}`,
          }}
          initial={false}
          animate={
            shouldPulse
              ? {
                  opacity: [
                    glowOpacity * 0.55,
                    glowOpacity,
                    glowOpacity * 0.55,
                  ],
                }
              : { opacity: glowOpacity }
          }
          transition={
            shouldPulse
              ? { duration, ease: "easeInOut", repeat: Infinity }
              : { duration: 0 }
          }
        />
      )}
      <div data-slot="glow-content" className="relative z-10 rounded-[inherit]">
        {children}
      </div>
    </motion.div>
  )
}

export { Glow }
