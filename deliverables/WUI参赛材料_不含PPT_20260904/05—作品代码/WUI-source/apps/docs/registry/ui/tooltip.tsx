"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/registry/lib/utils"

const tooltipContentVariants = cva(
  "z-50 max-w-72 rounded-md bg-foreground font-medium text-background shadow-md outline-none will-change-[transform,opacity] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 motion-reduce:animate-none",
  {
    variants: {
      size: {
        sm: "px-2 py-1 text-[11px] leading-4",
        default: "px-2.5 py-1.5 text-xs leading-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface TooltipProviderProps
  extends React.ComponentProps<typeof TooltipPrimitive.Provider> {}

/** Coordinates open delays between multiple tooltips. */
function TooltipProvider({
  delayDuration = 350,
  skipDelayDuration = 200,
  ...props
}: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  )
}

export interface TooltipProps
  extends Omit<
    React.ComponentProps<typeof TooltipPrimitive.Root>,
    | "open"
    | "defaultOpen"
    | "onOpenChange"
    | "delayDuration"
    | "disableHoverableContent"
  > {
  /** Controlled open state. */
  open?: boolean
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Hover delay in milliseconds for this tooltip. */
  delayDuration?: number
  /** Close when the pointer leaves the trigger instead of allowing content hover. @default false */
  disableHoverableContent?: boolean
}

/** Controls the open state of one tooltip. */
function Tooltip(props: TooltipProps) {
  return <TooltipPrimitive.Root {...props} />
}

function TooltipTrigger(
  props: React.ComponentProps<typeof TooltipPrimitive.Trigger>
) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

export interface TooltipContentProps
  extends Omit<
    React.ComponentProps<typeof TooltipPrimitive.Content>,
    "sideOffset"
  > {
  /** Physical size of the tooltip panel. @default "default" */
  size?: "sm" | "default"
  /** Gap in pixels between the trigger and panel. @default 6 */
  sideOffset?: number
  /** Whether to render the directional arrow. @default true */
  showArrow?: boolean
}

/** A portal-rendered label or short description for the trigger. */
function TooltipContent({
  className,
  sideOffset = 6,
  size = "default",
  showArrow = true,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        data-size={size}
        sideOffset={sideOffset}
        className={cn(tooltipContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {showArrow ? (
          <TooltipPrimitive.Arrow
            data-slot="tooltip-arrow"
            className="fill-foreground"
            width={8}
            height={4}
          />
        ) : null}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  tooltipContentVariants,
}
