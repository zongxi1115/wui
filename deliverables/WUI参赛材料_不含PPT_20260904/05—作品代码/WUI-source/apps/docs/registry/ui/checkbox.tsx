"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const checkboxVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[5px] border border-input bg-background text-primary-foreground shadow-xs outline-none transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out hover:border-ring/70 active:scale-[0.92] focus-visible:ring-[3px] focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
  {
    variants: {
      size: {
        sm: "size-4 rounded-[4px]",
        default: "size-5",
        lg: "size-6 rounded-md",
      },
    },
    defaultVariants: { size: "default" },
  }
)

export interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  /** Physical size of the checkbox. @default "default" */
  size?: "sm" | "default" | "lg"
}

/** An accessible checkbox with a smoothly drawn checkmark. */
function Checkbox({
  className,
  size = "default",
  checked,
  defaultChecked = false,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const reduceMotion = useReducedMotion()
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const currentChecked = checked ?? internalChecked

  function handleCheckedChange(next: boolean | "indeterminate") {
    if (checked === undefined) setInternalChecked(next)
    onCheckedChange?.(next)
  }

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-size={size}
      className={cn(checkboxVariants({ size }), className)}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        forceMount
        data-slot="checkbox-indicator"
        className="flex size-full items-center justify-center"
      >
        <AnimatePresence initial={false} mode="wait">
          {currentChecked ? (
            <motion.svg
              key={String(currentChecked)}
              className="size-[78%]"
              viewBox="0 0 16 16"
              fill="none"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.55 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.7 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 560, damping: 30, mass: 0.55 }}
              aria-hidden="true"
            >
              <motion.path
                d={currentChecked === "indeterminate" ? "M3.5 8h9" : "M3.25 8.25 6.5 11.25 12.75 4.75"}
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.svg>
          ) : null}
        </AnimatePresence>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, checkboxVariants }
