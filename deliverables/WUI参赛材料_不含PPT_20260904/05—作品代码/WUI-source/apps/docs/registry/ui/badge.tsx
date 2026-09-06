import * as React from "react"
import { Slot } from "radix-ui"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium leading-none transition-colors [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border bg-background text-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        info: "border-transparent bg-info text-info-foreground",
      },
      size: {
        sm: "min-h-4 px-1.5 text-[10px]",
        default: "min-h-5",
        lg: "min-h-6 px-2.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps extends React.ComponentProps<"span"> {
  /** Visual treatment of the badge. @default "default" */
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "success"
    | "warning"
    | "info"
  /** Height and horizontal padding preset. @default "default" */
  size?: "sm" | "default" | "lg"
  /** Render as the single child element via Radix Slot. @default false */
  asChild?: boolean
}

/** A compact label for status, category, or short metadata. */
function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
