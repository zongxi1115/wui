"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
  type SpringOptions,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface MagneticProps extends HTMLMotionProps<"div"> {
  /** How strongly the content follows the pointer. @default 0.18 */
  strength?: number
  /** Maximum movement on either axis, in pixels. @default 12 */
  maxDistance?: number
  /** Spring physics used for movement and return. */
  springConfig?: SpringOptions
  /** Disable pointer tracking without changing the layout. @default false */
  disabled?: boolean
  // Narrows motion's children type (which allows MotionValue) back to ReactNode.
  children?: React.ReactNode
}

/** Moves its content subtly toward the pointer, then springs back to rest. */
function Magnetic({
  strength = 0.18,
  maxDistance = 12,
  springConfig = { stiffness: 260, damping: 22, mass: 0.35 },
  disabled = false,
  className,
  style,
  children,
  onPointerMove,
  onPointerLeave,
  onPointerCancel,
  ...props
}: MagneticProps) {
  const reduceMotion = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, springConfig)
  const y = useSpring(rawY, springConfig)

  React.useEffect(() => {
    if (disabled || reduceMotion) {
      rawX.set(0)
      rawY.set(0)
    }
  }, [disabled, rawX, rawY, reduceMotion])

  const reset = () => {
    rawX.set(0)
    rawY.set(0)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event)
    if (
      event.defaultPrevented ||
      disabled ||
      reduceMotion ||
      event.pointerType === "touch"
    ) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = (event.clientX - (rect.left + rect.width / 2)) * strength
    const offsetY = (event.clientY - (rect.top + rect.height / 2)) * strength

    const limit = Math.max(0, maxDistance)
    rawX.set(Math.max(-limit, Math.min(limit, offsetX)))
    rawY.set(Math.max(-limit, Math.min(limit, offsetY)))
  }

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event)
    reset()
  }

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerCancel?.(event)
    reset()
  }

  return (
    <motion.div
      data-slot="magnetic"
      {...props}
      className={cn("inline-flex", className)}
      style={{
        ...style,
        x: disabled || reduceMotion ? 0 : x,
        y: disabled || reduceMotion ? 0 : y,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
    >
      {children}
    </motion.div>
  )
}

export { Magnetic }
