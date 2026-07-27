"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const progressVariants = cva("relative", {
  variants: {
    variant: {
      linear: "w-full overflow-hidden rounded-full bg-muted/80",
      circular: "inline-flex shrink-0 items-center justify-center",
    },
    size: {
      sm: "h-1",
      default: "h-1.5",
      lg: "h-2",
    },
  },
  compoundVariants: [
    { variant: "circular", size: "sm", className: "size-8" },
    { variant: "circular", size: "default", className: "size-11" },
    { variant: "circular", size: "lg", className: "size-14" },
  ],
  defaultVariants: { variant: "linear", size: "default" },
})

const progressColor = {
  primary: "text-primary",
  blue: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
} as const

export interface ProgressProps
  extends Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "color"> {
  /** Layout of the progress indicator. @default "linear" */
  variant?: "linear" | "circular"
  /** Thickness preset for linear progress and diameter preset for circular progress. @default "default" */
  size?: "sm" | "default" | "lg"
  /** Semantic accent used by the completed portion. @default "primary" */
  color?: keyof typeof progressColor
  /** Shows the current percentage inside a circular indicator. @default false */
  showValue?: boolean
  /** Extra classes applied to the completed portion. */
  indicatorClassName?: string
}

/** A linear or circular progress indicator with determinate and indeterminate states. */
function Progress({
  className,
  indicatorClassName,
  value,
  max = 100,
  variant = "linear",
  size = "default",
  color = "primary",
  showValue = false,
  ...props
}: ProgressProps) {
  const percentage = value == null ? 28 : Math.min(100, Math.max(0, (value / max) * 100))
  const strokeWidth = size === "sm" ? 7 : size === "lg" ? 5 : 6
  const radius = 50 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-size={size}
      data-variant={variant}
      data-color={color}
      className={cn(progressVariants({ variant, size }), progressColor[color], className)}
      value={value}
      max={max}
      {...props}
    >
      {variant === "circular" ? (
        <>
          <svg
            data-slot="progress-ring"
            className={cn("size-full -rotate-90", value == null && "animate-spin motion-reduce:animate-none")}
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.14"
              strokeWidth={strokeWidth}
            />
            <ProgressPrimitive.Indicator asChild>
              <circle
                data-slot="progress-indicator"
                className={cn("transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none", indicatorClassName)}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - percentage / 100)}
              />
            </ProgressPrimitive.Indicator>
          </svg>
          {showValue && value != null ? (
            <span
              data-slot="progress-value"
              className="absolute text-[10px] font-semibold tabular-nums text-foreground"
            >
              {Math.round(percentage)}
            </span>
          ) : null}
        </>
      ) : (
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            "h-full origin-left rounded-full bg-current transition-transform duration-500 ease-out motion-reduce:transition-none",
            value == null && "animate-pulse",
            indicatorClassName
          )}
          style={{ transform: `scaleX(${percentage / 100})` }}
        />
      )}
    </ProgressPrimitive.Root>
  )
}

export { Progress, progressVariants }
