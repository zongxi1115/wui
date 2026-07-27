"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"

import { cn } from "@/registry/lib/utils"

const gradientAngles = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
} as const

export interface ProgressiveBlurProps extends HTMLMotionProps<"div"> {
  /** Edge that receives the strongest blur. @default "bottom" */
  direction?: keyof typeof gradientAngles
  /** Number of overlapping mask bands. Values below 2 are clamped. @default 8 */
  blurLayers?: number
  /** Blur added by each successive layer in pixels. @default 0.25 */
  blurIntensity?: number
}

function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 8,
  blurIntensity = 0.25,
  className,
  ...props
}: ProgressiveBlurProps) {
  const layers = Math.max(Math.round(blurLayers), 2)
  const segmentSize = 1 / (layers + 1)
  const angle = gradientAngles[direction]

  return (
    <div
      aria-hidden="true"
      data-slot="progressive-blur"
      className={cn("pointer-events-none relative", className)}
    >
      {Array.from({ length: layers }, (_, index) => {
        const stops = [index, index + 1, index + 2, index + 3].map(
          (position, stopIndex) =>
            `rgba(0, 0, 0, ${stopIndex === 1 || stopIndex === 2 ? 1 : 0}) ${position * segmentSize * 100}%`
        )
        const maskImage = `linear-gradient(${angle}deg, ${stops.join(", ")})`
        const blur = Math.max(0, index * blurIntensity)

        return (
          <motion.div
            key={index}
            data-slot="progressive-blur-layer"
            className="absolute inset-0 rounded-[inherit]"
            style={{
              maskImage,
              WebkitMaskImage: maskImage,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
            }}
            {...props}
          />
        )
      })}
    </div>
  )
}

export { ProgressiveBlur, gradientAngles }
