"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const skeletonVariants = cva("shrink-0 bg-muted", {
  variants: {
    shape: {
      default: "rounded-md",
      circle: "rounded-full",
      text: "h-4 rounded-sm",
    },
    animation: {
      pulse: "animate-pulse motion-reduce:animate-none",
      shimmer: "relative isolate overflow-hidden",
      none: "",
    },
  },
  defaultVariants: {
    shape: "default",
    animation: "pulse",
  },
})

type SkeletonAnimation = "pulse" | "shimmer" | "none"

export interface SkeletonProps extends React.ComponentProps<"div"> {
  /** Corner treatment for the placeholder. @default "default" */
  shape?: "default" | "circle" | "text"
  /** Loading animation. `shimmer` sweeps a soft highlight across the block. @default "pulse" */
  animation?: SkeletonAnimation
}

/**
 * The shimmer reuses tw-animate-css's `enter` keyframe: the band starts one
 * track to the right of the block and travels from -200% back to rest, which
 * reads as a single left-to-right sweep without a custom global keyframe.
 */
const shimmerClassName =
  "pointer-events-none absolute inset-y-0 left-full w-full bg-linear-to-r from-transparent via-foreground/[0.06] to-transparent animate-in slide-in-from-left-[200%] repeat-infinite duration-[1600ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:hidden"

/** A neutral placeholder that preserves layout while content is loading. */
function Skeleton({
  className,
  shape = "default",
  animation = "pulse",
  children,
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      data-shape={shape}
      data-animation={animation}
      aria-hidden="true"
      className={cn(skeletonVariants({ shape, animation }), className)}
      {...props}
    >
      {animation === "shimmer" ? (
        <span data-slot="skeleton-shimmer" className={shimmerClassName} />
      ) : null}
      {children}
    </div>
  )
}

export interface SkeletonTextProps extends React.ComponentProps<"div"> {
  /** Number of text rows. @default 3 */
  lines?: number
  /** Width of the final row. @default "70%" */
  lastLineWidth?: React.CSSProperties["width"]
  /** Loading animation shared by every row. @default "pulse" */
  animation?: SkeletonAnimation
}

/** Generates a compact stack of text-shaped skeleton rows. */
function SkeletonText({
  className,
  lines = 3,
  lastLineWidth = "70%",
  animation = "pulse",
  ...props
}: SkeletonTextProps) {
  return (
    <div
      data-slot="skeleton-text"
      aria-hidden="true"
      className={cn("grid w-full gap-2", className)}
      {...props}
    >
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          shape="text"
          animation={animation}
          className="w-full"
          style={index === lines - 1 ? { width: lastLineWidth } : undefined}
        />
      ))}
    </div>
  )
}

export interface SkeletonSwapProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Shows `fallback` while true and crossfades to `children` once false. */
  loading: boolean
  /** Placeholder rendered while loading, usually composed from Skeleton. */
  fallback: React.ReactNode
  /** Loaded content revealed with a short fade and rise. */
  children: React.ReactNode
}

const revealEase = [0.22, 1, 0.36, 1] as const

/** Swaps a skeleton placeholder for the loaded content with a calm crossfade. */
function SkeletonSwap({
  loading,
  fallback,
  children,
  className,
  ...props
}: SkeletonSwapProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      data-slot="skeleton-swap"
      data-loading={loading || undefined}
      aria-busy={loading}
      className={className}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={loading ? "fallback" : "content"}
          initial={
            reduceMotion
              ? { opacity: 0 }
              : loading
                ? { opacity: 0 }
                : { opacity: 0, y: 4, filter: "blur(2px)" }
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0 : loading ? 0.15 : 0.28,
            ease: revealEase,
          }}
        >
          {loading ? fallback : children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export { Skeleton, SkeletonSwap, SkeletonText, skeletonVariants }
