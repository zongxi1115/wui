"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-2.5", className)}
      {...props}
    />
  )
}

const radioGroupItemVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-input bg-background shadow-xs outline-none transition-[border-color,box-shadow,scale] duration-200 ease-out hover:border-ring/70 active:scale-[0.9] focus-visible:ring-[3px] focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-[state=checked]:border-primary motion-reduce:transition-none",
  {
    variants: {
      size: {
        sm: "size-4",
        default: "size-5",
        lg: "size-6",
      },
    },
    defaultVariants: { size: "default" },
  }
)

export interface RadioGroupItemProps
  extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  /** Physical size of the radio control. @default "default" */
  size?: "sm" | "default" | "lg"
}

/** One option inside a RadioGroup. The dot springs in when selected and shrinks away when deselected. */
function RadioGroupItem({ className, size = "default", ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      data-size={size}
      className={cn(radioGroupItemVariants({ size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        forceMount
        data-slot="radio-group-indicator"
        className="size-1/2 scale-0 rounded-full bg-primary opacity-0 transition-[scale,opacity] duration-150 ease-in data-[state=checked]:scale-100 data-[state=checked]:opacity-100 data-[state=checked]:duration-300 data-[state=checked]:ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
      />
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem, radioGroupItemVariants }
