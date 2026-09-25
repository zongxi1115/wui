"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const progressVariants = cva("relative", {
  variants: {
    variant: {
      linear: "w-full overflow-hidden rounded-full bg-muted",
      circular: "inline-flex shrink-0 items-center justify-center",
    },
    size: {
      sm: "",
      default: "",
      lg: "",
    },
  },
  compoundVariants: [
    { variant: "linear", size: "sm", className: "h-1" },
    { variant: "linear", size: "default", className: "h-1.5" },
    { variant: "linear", size: "lg", className: "h-2" },
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

const valueTextSize = {
  sm: "text-[9px]",
  default: "text-[11px]",
  lg: "text-xs",
} as const

/** Settles value changes quickly without overshooting past the real progress. */
const valueSpring = { stiffness: 220, damping: 32, mass: 0.8 }
const sweepEase = [0.65, 0, 0.35, 1] as const

export interface ProgressProps
  extends Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "color"> {
  /** Layout of the progress indicator. @default "linear" */
  variant?: "linear" | "circular"
  /** Thickness preset for linear progress and diameter preset for circular progress. @default "default" */
  size?: "sm" | "default" | "lg"
  /** Semantic accent used by the completed portion. @default "primary" */
  color?: keyof typeof progressColor
  /** Shows the current percentage inside a circular indicator. The number rolls with the bar. @default false */
  showValue?: boolean
  /** Extra classes applied to the completed portion. */
  indicatorClassName?: string
}

function useSmoothedPercentage(percentage: number) {
  const reduceMotion = useReducedMotion()
  const smoothed = useSpring(percentage, valueSpring)

  React.useEffect(() => {
    if (reduceMotion) smoothed.jump(percentage)
    else smoothed.set(percentage)
  }, [percentage, reduceMotion, smoothed])

  return smoothed
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
  const indeterminate = value == null
  const percentage = indeterminate
    ? 0
    : Math.min(100, Math.max(0, (value / max) * 100))
  const smoothed = useSmoothedPercentage(percentage)

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-size={size}
      data-variant={variant}
      data-color={color}
      className={cn(
        progressVariants({ variant, size }),
        progressColor[color],
        className
      )}
      value={value}
      max={max}
      {...props}
    >
      {variant === "circular" ? (
        <CircularIndicator
          size={size}
          indeterminate={indeterminate}
          smoothed={smoothed}
          showValue={showValue}
          className={indicatorClassName}
        />
      ) : (
        <LinearIndicator
          indeterminate={indeterminate}
          smoothed={smoothed}
          className={indicatorClassName}
        />
      )}
    </ProgressPrimitive.Root>
  )
}

function LinearIndicator({
  indeterminate,
  smoothed,
  className,
}: {
  indeterminate: boolean
  smoothed: MotionValue<number>
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const x = useTransform(smoothed, (latest) => `${latest - 100}%`)

  if (indeterminate) {
    return (
      <ProgressPrimitive.Indicator key="indeterminate" asChild>
        <motion.div
          data-slot="progress-indicator"
          className={cn(
            "absolute inset-y-0 left-0 w-2/5 rounded-full bg-current",
            className
          )}
          initial={{ x: reduceMotion ? "75%" : "-100%" }}
          animate={reduceMotion ? { opacity: 0.6 } : { x: "250%" }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 1.35,
                  ease: sweepEase,
                  repeat: Infinity,
                  repeatDelay: 0.15,
                }
          }
        />
      </ProgressPrimitive.Indicator>
    )
  }

  return (
    <ProgressPrimitive.Indicator key="determinate" asChild>
      <motion.div
        data-slot="progress-indicator"
        className={cn("h-full w-full rounded-full bg-current", className)}
        style={{ x }}
      />
    </ProgressPrimitive.Indicator>
  )
}

function CircularIndicator({
  size,
  indeterminate,
  smoothed,
  showValue,
  className,
}: {
  size: NonNullable<ProgressProps["size"]>
  indeterminate: boolean
  smoothed: MotionValue<number>
  showValue: boolean
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const strokeWidth = size === "sm" ? 9 : size === "lg" ? 7 : 8
  const radius = 50 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = useTransform(
    smoothed,
    (latest) => circumference * (1 - latest / 100)
  )
  const label = useTransform(smoothed, (latest) => Math.round(latest))

  return (
    <>
      <svg
        data-slot="progress-ring"
        className={cn(
          "size-full -rotate-90",
          indeterminate &&
            "animate-spin [animation-duration:1.1s] motion-reduce:animate-none"
        )}
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
        <ProgressPrimitive.Indicator
          key={indeterminate ? "indeterminate" : "determinate"}
          asChild
        >
          {indeterminate ? (
            <motion.circle
              data-slot="progress-indicator"
              className={className}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference * 0.78 }}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      strokeDashoffset: [
                        circumference * 0.78,
                        circumference * 0.3,
                        circumference * 0.78,
                      ],
                    }
              }
              transition={{
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          ) : (
            <motion.circle
              data-slot="progress-indicator"
              className={className}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{ strokeDashoffset: dashOffset }}
            />
          )}
        </ProgressPrimitive.Indicator>
      </svg>
      {showValue && !indeterminate ? (
        <motion.span
          data-slot="progress-value"
          className={cn(
            "absolute font-semibold tabular-nums text-foreground",
            valueTextSize[size]
          )}
        >
          {label}
        </motion.span>
      ) : null}
    </>
  )
}

export { Progress, progressVariants }
