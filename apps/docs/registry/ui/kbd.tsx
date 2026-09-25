import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const kbdVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-sm border border-border bg-muted/70 font-sans font-medium leading-none text-muted-foreground select-none transition-[color,background-color,border-color,translate] duration-150 ease-out data-[pressed]:translate-y-px data-[pressed]:border-primary data-[pressed]:bg-primary data-[pressed]:text-primary-foreground motion-reduce:transition-none motion-reduce:data-[pressed]:translate-y-0",
  {
    variants: {
      size: {
        sm: "min-h-5 min-w-5 px-1 text-[10px]",
        default: "min-h-6 min-w-6 px-1.5 text-[11px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface KbdProps
  extends React.ComponentProps<"kbd">,
    VariantProps<typeof kbdVariants> {
  /** Physical size of the key hint. @default "default" */
  size?: "sm" | "default"
  /**
   * Highlight the key as physically held down, e.g. to mirror live keyboard
   * input in onboarding or shortcut settings. @default false
   */
  pressed?: boolean
}

/** A compact visual hint for one keyboard key. */
function Kbd({ className, size = "default", pressed = false, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      data-size={size}
      data-pressed={pressed || undefined}
      className={cn(kbdVariants({ size }), className)}
      {...props}
    />
  )
}

/** Keeps multiple key hints aligned as one shortcut. */
function KbdGroup({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup, kbdVariants }
