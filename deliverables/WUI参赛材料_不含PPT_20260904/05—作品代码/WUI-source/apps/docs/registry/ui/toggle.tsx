"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const toggleVariants = cva(
  "hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/30 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium outline-none transition-[color,background-color,border-color,box-shadow] focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border border-transparent",
        outline: "border-input bg-background shadow-xs border",
      },
      size: {
        sm: "h-8 min-w-8 px-2",
        default: "h-9 min-w-9 px-2.5",
        lg: "h-10 min-w-10 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ToggleProps
  extends
    React.ComponentProps<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

/** 表示可保持开启或关闭状态的双态按钮。 */
function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
