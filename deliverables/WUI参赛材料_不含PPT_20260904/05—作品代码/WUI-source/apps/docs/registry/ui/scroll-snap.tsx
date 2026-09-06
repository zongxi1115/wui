import * as React from "react"

import { cn } from "@/registry/lib/utils"

export interface ScrollSnapProps extends React.ComponentProps<"div"> {
  /** Snap axis. @default "y" */
  axis?: "x" | "y"
  /** Whether the browser must always settle on a snap point. @default "mandatory" */
  strictness?: "mandatory" | "proximity"
  /** Hide native scrollbars while preserving scrolling. @default false */
  hideScrollbar?: boolean
}

export interface ScrollSnapItemProps extends React.ComponentProps<"section"> {
  /** Position used when the item becomes the active snap point. @default "start" */
  align?: "start" | "center" | "end"
  /** Prevent fast scrolling from skipping this item. @default false */
  stop?: boolean
}

/** A native CSS scroll-snap container for page-like or horizontal sections. */
function ScrollSnap({
  axis = "y",
  strictness = "mandatory",
  hideScrollbar = false,
  className,
  style,
  ...props
}: ScrollSnapProps) {
  return (
    <div
      data-slot="scroll-snap"
      data-axis={axis}
      className={cn(
        "overscroll-contain",
        axis === "y" ? "overflow-y-auto" : "overflow-x-auto",
        hideScrollbar && "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      style={{ ...style, scrollSnapType: `${axis} ${strictness}` }}
      {...props}
    />
  )
}

/** One semantic snap point inside ScrollSnap. */
function ScrollSnapItem({
  align = "start",
  stop = false,
  className,
  style,
  ...props
}: ScrollSnapItemProps) {
  return (
    <section
      data-slot="scroll-snap-item"
      className={cn("shrink-0", className)}
      style={{
        ...style,
        scrollSnapAlign: align,
        scrollSnapStop: stop ? "always" : "normal",
      }}
      {...props}
    />
  )
}

export { ScrollSnap, ScrollSnapItem }
