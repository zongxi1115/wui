"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
} from "motion/react"

import { cn } from "@/registry/lib/utils"

export interface AuroraBackgroundProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  /** Foreground content rendered above the aurora layers. */
  children?: React.ReactNode
  /** Three CSS colors used by the moving light fields. @default ["var(--chart-1)", "var(--chart-3)", "var(--chart-5)"] */
  colors?: [string, string, string]
  /** Seconds for one complete movement cycle. @default 18 */
  duration?: number
  /** Blur strength in pixels. @default 56 */
  blur?: number
  /** Let the light fields drift toward the pointer at different depths. @default false */
  interactive?: boolean
  /** Classes applied to every aurora layer. */
  layerClassName?: string
}

const layers = [
  {
    position: "-left-[18%] -top-[28%] h-[85%] w-[75%]",
    depth: 48,
    x: [0, 42, -24, 0],
    y: [0, -24, 30, 0],
  },
  {
    position: "-bottom-[34%] left-[24%] h-[90%] w-[72%]",
    depth: -64,
    x: [0, -36, 28, 0],
    y: [0, -24, 30, 0],
  },
  {
    position: "-right-[24%] top-[8%] h-[72%] w-[62%]",
    depth: 32,
    x: [0, 42, -24, 0],
    y: [0, 34, -18, 0],
  },
]

interface AuroraLayerProps {
  color: string
  index: number
  blur: number
  duration: number
  animated: boolean
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  className?: string
}

function AuroraLayer({
  color,
  index,
  blur,
  duration,
  animated,
  pointerX,
  pointerY,
  className,
}: AuroraLayerProps) {
  const layer = layers[index]
  const x = useTransform(pointerX, (value) => value * layer.depth)
  const y = useTransform(pointerY, (value) => value * layer.depth)

  return (
    <motion.div className={cn("absolute", layer.position)} style={{ x, y }}>
      <motion.div
        data-slot="aurora-background-layer"
        className={cn(
          "size-full rounded-[50%] opacity-45 will-change-transform dark:opacity-60 dark:mix-blend-screen",
          className
        )}
        style={{
          background: `radial-gradient(closest-side, ${color}, transparent)`,
          filter: `blur(${blur}px)`,
        }}
        animate={
          animated
            ? { x: layer.x, y: layer.y, scale: [1, 1.12, 0.96, 1] }
            : undefined
        }
        transition={{
          duration: duration + index * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

/** Layers slow, blurred color fields behind content. */
function AuroraBackground({
  children,
  colors = ["var(--chart-1)", "var(--chart-3)", "var(--chart-5)"],
  duration = 18,
  blur = 56,
  interactive = false,
  className,
  layerClassName,
  onPointerMove,
  onPointerLeave,
  ...props
}: AuroraBackgroundProps) {
  const reduceMotion = Boolean(useReducedMotion())
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const pointerX = useSpring(rawX, { stiffness: 36, damping: 18, mass: 1 })
  const pointerY = useSpring(rawY, { stiffness: 36, damping: 18, mass: 1 })

  return (
    <motion.div
      data-slot="aurora-background"
      className={cn(
        "bg-background relative isolate overflow-hidden",
        className
      )}
      onPointerMove={(event) => {
        if (interactive && !reduceMotion && event.pointerType !== "touch") {
          const rect = event.currentTarget.getBoundingClientRect()
          rawX.set((event.clientX - rect.left) / rect.width - 0.5)
          rawY.set((event.clientY - rect.top) / rect.height - 0.5)
        }
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        rawX.set(0)
        rawY.set(0)
        onPointerLeave?.(event)
      }}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {colors.map((color, index) => (
          <AuroraLayer
            key={index}
            color={color}
            index={index}
            blur={blur}
            duration={duration}
            animated={!reduceMotion}
            pointerX={pointerX}
            pointerY={pointerY}
            className={layerClassName}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

export { AuroraBackground }
