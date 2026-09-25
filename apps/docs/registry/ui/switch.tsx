"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const switchVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input p-px outline-none transition-[background-color,box-shadow,opacity] duration-300 ease-out focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-[3px] aria-invalid:ring-destructive/25 data-[state=checked]:bg-primary data-[loading=true]:cursor-progress motion-reduce:transition-none",
  {
    variants: {
      size: {
        sm: "h-4 w-7",
        default: "h-5 w-9",
        lg: "h-6 w-11",
      },
    },
    defaultVariants: { size: "default" },
  }
)

// Thumbs keep a 2px inset on every side of the track (1px border + 1px padding).
const thumbMetrics = {
  sm: { size: 12, travel: 12, stretch: 3, icon: "[&_svg]:size-2" },
  default: { size: 16, travel: 16, stretch: 4, icon: "[&_svg]:size-2.5" },
  lg: { size: 20, travel: 20, stretch: 5, icon: "[&_svg]:size-3" },
} as const

export interface SwitchProps extends Omit<
  React.ComponentProps<typeof SwitchPrimitive.Root>,
  "children"
> {
  /** Physical size of the switch. @default "default" */
  size?: "sm" | "default" | "lg"
  /** Icon rendered inside the thumb while the switch is on. */
  checkedIcon?: React.ReactNode
  /** Icon rendered inside the thumb while the switch is off. */
  uncheckedIcon?: React.ReactNode
  /** Shows a spinner inside the thumb and blocks interaction while a change is pending. @default false */
  loading?: boolean
}

/** A tactile, accessible binary control with a spring-driven thumb that stretches while pressed. */
function Switch({
  className,
  size = "default",
  checked,
  defaultChecked = false,
  onCheckedChange,
  checkedIcon,
  uncheckedIcon,
  loading = false,
  disabled,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  onKeyDown,
  onKeyUp,
  onBlur,
  ...props
}: SwitchProps) {
  const reduceMotion = useReducedMotion()
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const [pressed, setPressed] = React.useState(false)
  const isChecked = checked ?? internalChecked
  const metrics = thumbMetrics[size]
  const stretch = pressed && !reduceMotion ? metrics.stretch : 0
  const icon = isChecked ? checkedIcon : uncheckedIcon
  const inactive = disabled || loading

  function handleCheckedChange(next: boolean) {
    if (checked === undefined) setInternalChecked(next)
    onCheckedChange?.(next)
  }

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      className={cn(switchVariants({ size }), className)}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={handleCheckedChange}
      disabled={inactive}
      onPointerDown={(event) => {
        if (!inactive && event.button === 0) setPressed(true)
        onPointerDown?.(event)
      }}
      onPointerUp={(event) => {
        setPressed(false)
        onPointerUp?.(event)
      }}
      onPointerLeave={(event) => {
        setPressed(false)
        onPointerLeave?.(event)
      }}
      onPointerCancel={(event) => {
        setPressed(false)
        onPointerCancel?.(event)
      }}
      onKeyDown={(event) => {
        if (event.key === " " && !inactive) setPressed(true)
        onKeyDown?.(event)
      }}
      onKeyUp={(event) => {
        setPressed(false)
        onKeyUp?.(event)
      }}
      onBlur={(event) => {
        setPressed(false)
        onBlur?.(event)
      }}
      {...props}
    >
      <SwitchPrimitive.Thumb asChild>
        <motion.span
          data-slot="switch-thumb"
          className={cn(
            "pointer-events-none relative flex items-center justify-center overflow-hidden rounded-full bg-background shadow-sm",
            isChecked ? "text-primary" : "text-muted-foreground",
            metrics.icon
          )}
          style={{ height: metrics.size }}
          initial={false}
          animate={{
            width: metrics.size + stretch,
            x: isChecked ? metrics.travel - stretch : 0,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 520, damping: 32, mass: 0.65 }
          }
        >
          <AnimatePresence initial={false} mode="popLayout">
            {loading ? (
              <motion.svg
                key="loading"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: reduceMotion ? 0 : 0.18 }}
              >
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
                <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </motion.svg>
            ) : icon ? (
              <motion.span
                key={isChecked ? "checked" : "unchecked"}
                aria-hidden="true"
                className="flex items-center justify-center"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.4, rotate: isChecked ? -90 : 90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.4, rotate: isChecked ? -90 : 90 }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 480, damping: 30, mass: 0.6 }
                }
              >
                {icon}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.span>
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch, switchVariants }
