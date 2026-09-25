"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const checkboxVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[5px] border border-input bg-background text-primary-foreground shadow-xs outline-none transition-[background-color,border-color,box-shadow,scale] duration-200 ease-out hover:border-ring/70 active:scale-[0.9] focus-visible:ring-[3px] focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary motion-reduce:transition-none",
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

// Both shapes share three points so the check can morph into the dash and back.
const CHECK_PATH = "M3.25 8.25 L6.5 11.25 L12.75 4.75"
const DASH_PATH = "M3.75 8 L8 8 L12.25 8"

export interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  /** Physical size of the checkbox. @default "default" */
  size?: "sm" | "default" | "lg"
}

/** An accessible checkbox whose checkmark draws in and morphs into the indeterminate dash. */
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
  const indeterminate = currentChecked === "indeterminate"

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
        <AnimatePresence initial={false}>
          {currentChecked ? (
            <motion.svg
              key="mark"
              className="size-[78%]"
              viewBox="0 0 16 16"
              fill="none"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.6, transition: { duration: 0.12, ease: "easeIn" } }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 560, damping: 30, mass: 0.55 }
              }
              aria-hidden="true"
            >
              <motion.path
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduceMotion ? false : { pathLength: 0, d: indeterminate ? DASH_PATH : CHECK_PATH }}
                animate={{ pathLength: 1, d: indeterminate ? DASH_PATH : CHECK_PATH }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        pathLength: { duration: 0.24, delay: 0.04, ease: [0.22, 1, 0.36, 1] },
                        d: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                      }
                }
              />
            </motion.svg>
          ) : null}
        </AnimatePresence>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, checkboxVariants }
