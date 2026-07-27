"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"
import { motion, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const switchVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input/80 shadow-inner outline-none transition-[background-color,box-shadow,opacity] duration-300 ease-out focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
  {
    variants: {
      size: {
        sm: "h-5 w-9 p-0.5",
        default: "h-7 w-12 p-0.5",
        lg: "h-8 w-14 p-0.5",
      },
    },
    defaultVariants: { size: "default" },
  }
)

const thumbSize = {
  sm: { size: 16, travel: 16 },
  default: { size: 24, travel: 20 },
  lg: { size: 28, travel: 24 },
} as const

export interface SwitchProps
  extends Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, "children"> {
  /** Physical size of the switch. @default "default" */
  size?: "sm" | "default" | "lg"
}

/** A tactile, accessible binary control with a spring-driven thumb. */
function Switch({
  className,
  size = "default",
  checked,
  defaultChecked = false,
  onCheckedChange,
  ...props
}: SwitchProps) {
  const reduceMotion = useReducedMotion()
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const isChecked = checked ?? internalChecked
  const metrics = thumbSize[size]

  function handleCheckedChange(next: boolean) {
    if (checked === undefined) setInternalChecked(next)
    onCheckedChange?.(next)
  }

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(switchVariants({ size }), className)}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <SwitchPrimitive.Thumb asChild>
        <motion.span
          data-slot="switch-thumb"
          className="pointer-events-none block rounded-full bg-background shadow-sm"
          style={{ width: metrics.size, height: metrics.size }}
          animate={{ x: isChecked ? metrics.travel : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 520, damping: 32, mass: 0.65 }
          }
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch, switchVariants }
