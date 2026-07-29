"use client"

import * as React from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface TiltCardProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  /** Content rendered on the tilting plane. */
  children: React.ReactNode
  /** Maximum rotation on either axis in degrees. @default 9 */
  maxTilt?: number
  /** Perspective depth in pixels. @default 900 */
  perspective?: number
  /** Scale applied while the pointer is over the card. @default 1.015 */
  hoverScale?: number
  /** Show a pointer-position glare layer. @default false */
  glare?: boolean
  /** Classes applied to the optional glare layer. */
  glareClassName?: string
}

/** Tilts a surface in 3D according to the pointer position and springs to rest. */
function TiltCard({
  children,
  maxTilt = 9,
  perspective = 900,
  hoverScale = 1.015,
  glare = false,
  className,
  glareClassName,
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: TiltCardProps) {
  const reduceMotion = useReducedMotion()
  const rotateXValue = useMotionValue(0)
  const rotateYValue = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const rotateX = useSpring(rotateXValue, {
    stiffness: 220,
    damping: 24,
    mass: 0.45,
  })
  const rotateY = useSpring(rotateYValue, {
    stiffness: 220,
    damping: 24,
    mass: 0.45,
  })
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, white, transparent 46%)`

  function reset() {
    rotateXValue.set(0)
    rotateYValue.set(0)
  }

  return (
    <motion.div
      data-slot="tilt-card"
      className={cn("relative transform-gpu", className)}
      style={{
        ...style,
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        transformPerspective: perspective,
        transformStyle: "preserve-3d",
      }}
      whileHover={reduceMotion ? undefined : { scale: hoverScale }}
      onPointerMove={(event) => {
        if (!reduceMotion && event.pointerType !== "touch") {
          const rect = event.currentTarget.getBoundingClientRect()
          const x = (event.clientX - rect.left) / rect.width
          const y = (event.clientY - rect.top) / rect.height
          rotateXValue.set((0.5 - y) * maxTilt * 2)
          rotateYValue.set((x - 0.5) * maxTilt * 2)
          glareX.set(x * 100)
          glareY.set(y * 100)
        }
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        reset()
        onPointerLeave?.(event)
      }}
      {...props}
    >
      {children}
      {glare ? (
        <motion.div
          aria-hidden="true"
          data-slot="tilt-card-glare"
          className={cn(
            "pointer-events-none absolute inset-0 opacity-35 mix-blend-soft-light",
            glareClassName
          )}
          style={{ background: glareBackground }}
        />
      ) : null}
    </motion.div>
  )
}

export { TiltCard }
