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
  /** Show a pointer-position glare layer that fades in on hover. @default false */
  glare?: boolean
  /** Peak opacity of the glare layer. @default 0.35 */
  glareOpacity?: number
  /** Classes applied to the optional glare layer. */
  glareClassName?: string
}

const tiltSpring = { stiffness: 220, damping: 24, mass: 0.45 }

/** Tilts a surface in 3D according to the pointer position and springs to rest. */
function TiltCard({
  children,
  maxTilt = 9,
  perspective = 900,
  hoverScale = 1.015,
  glare = false,
  glareOpacity = 0.35,
  className,
  glareClassName,
  style,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: TiltCardProps) {
  const reduceMotion = useReducedMotion()
  // Measured at rest on enter; reading the rect of a tilted card makes the input feed back into itself.
  const rectRef = React.useRef<DOMRect | null>(null)
  const rotateXValue = useMotionValue(0)
  const rotateYValue = useMotionValue(0)
  const scaleValue = useMotionValue(1)
  const glareVisibility = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const rotateX = useSpring(rotateXValue, tiltSpring)
  const rotateY = useSpring(rotateYValue, tiltSpring)
  const scale = useSpring(scaleValue, { stiffness: 300, damping: 26 })
  const glareAlpha = useSpring(glareVisibility, { stiffness: 160, damping: 26 })
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, white, transparent 52%)`

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = rectRef.current ?? event.currentTarget.getBoundingClientRect()
    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1)
    rotateXValue.set((0.5 - y) * maxTilt * 2)
    rotateYValue.set((x - 0.5) * maxTilt * 2)
    glareX.set(x * 100)
    glareY.set(y * 100)
  }

  return (
    <motion.div
      data-slot="tilt-card"
      className={cn("relative transform-gpu", className)}
      style={{
        ...style,
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        scale: reduceMotion ? 1 : scale,
        transformPerspective: perspective,
        transformStyle: "preserve-3d",
      }}
      onPointerEnter={(event) => {
        if (!reduceMotion && event.pointerType !== "touch") {
          rectRef.current = event.currentTarget.getBoundingClientRect()
          scaleValue.set(hoverScale)
          glareVisibility.set(glareOpacity)
          handleMove(event)
        }
        onPointerEnter?.(event)
      }}
      onPointerMove={(event) => {
        if (!reduceMotion && event.pointerType !== "touch") handleMove(event)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        rectRef.current = null
        rotateXValue.set(0)
        rotateYValue.set(0)
        scaleValue.set(1)
        glareVisibility.set(0)
        onPointerLeave?.(event)
      }}
      {...props}
    >
      {children}
      {glare && !reduceMotion ? (
        <motion.div
          aria-hidden="true"
          data-slot="tilt-card-glare"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light",
            glareClassName
          )}
          style={{ background: glareBackground, opacity: glareAlpha }}
        />
      ) : null}
    </motion.div>
  )
}

export { TiltCard }
