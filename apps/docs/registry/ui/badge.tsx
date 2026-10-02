import * as React from "react"
import { Slot } from "radix-ui"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-full border font-medium outline-none transition-[color,background-color,border-color,box-shadow] duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/35 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [:is(a,button)&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [:is(a,button)&]:hover:bg-secondary/80",
        outline:
          "border-border bg-background text-foreground [:is(a,button)&]:hover:bg-accent [:is(a,button)&]:hover:text-accent-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground [:is(a,button)&]:hover:bg-destructive/90",
        success:
          "border-transparent bg-success text-success-foreground [:is(a,button)&]:hover:bg-success/90",
        warning:
          "border-transparent bg-warning text-warning-foreground [:is(a,button)&]:hover:bg-warning/90",
        info: "border-transparent bg-info text-info-foreground [:is(a,button)&]:hover:bg-info/90",
      },
      size: {
        sm: "h-4 gap-0.5 px-1.5 text-[10px] leading-none [&_svg]:size-2.5",
        default: "h-5 gap-1 px-2 text-xs leading-none [&_svg]:size-3",
        lg: "h-6 gap-1.5 px-2.5 text-sm leading-none [&_svg]:size-3.5",
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

/**
 * A compact label for status, category, or short metadata. When rendered as a
 * link or button via `asChild`, it gains hover and focus-visible feedback.
 */
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
