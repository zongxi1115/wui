import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

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
      none: "",
    },
  },
  defaultVariants: {
    shape: "default",
    animation: "pulse",
  },
})

export interface SkeletonProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof skeletonVariants> {
  /** Corner treatment for the placeholder. @default "default" */
  shape?: "default" | "circle" | "text"
  /** Loading animation. @default "pulse" */
  animation?: "pulse" | "none"
}

/** A neutral placeholder that preserves layout while content is loading. */
function Skeleton({
  className,
  shape = "default",
  animation = "pulse",
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
    />
  )
}

export interface SkeletonTextProps extends React.ComponentProps<"div"> {
  /** Number of text rows. @default 3 */
  lines?: number
  /** Width of the final row. @default "70%" */
  lastLineWidth?: React.CSSProperties["width"]
  /** Loading animation shared by every row. @default "pulse" */
  animation?: "pulse" | "none"
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

export { Skeleton, SkeletonText, skeletonVariants }
