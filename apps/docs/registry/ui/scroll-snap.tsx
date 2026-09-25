"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

export interface ScrollSnapProps extends React.ComponentProps<"div"> {
  /** Snap axis. @default "y" */
  axis?: "x" | "y"
  /** Whether the browser must always settle on a snap point. @default "mandatory" */
  strictness?: "mandatory" | "proximity"
  /** Hide native scrollbars while preserving scrolling. @default false */
  hideScrollbar?: boolean
  /** Called with the index of the item currently aligned to the snap edge. */
  onActiveChange?: (index: number) => void
}

export interface ScrollSnapItemProps extends React.ComponentProps<"section"> {
  /** Position used when the item becomes the active snap point. @default "start" */
  align?: "start" | "center" | "end"
  /** Prevent fast scrolling from skipping this item. @default false */
  stop?: boolean
}

function getActiveIndex(root: HTMLElement, axis: "x" | "y") {
  const items = Array.from(
    root.querySelectorAll<HTMLElement>(':scope > [data-slot="scroll-snap-item"]')
  )
  if (items.length === 0) return -1

  const scrollStart = axis === "y" ? root.scrollTop : root.scrollLeft
  const viewport = axis === "y" ? root.clientHeight : root.clientWidth
  const scrollSize = axis === "y" ? root.scrollHeight : root.scrollWidth
  if (scrollStart + viewport >= scrollSize - 1) return items.length - 1

  const rootRect = root.getBoundingClientRect()
  let active = 0
  let closest = Number.POSITIVE_INFINITY
  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect()
    const distance = Math.abs(
      axis === "y" ? rect.top - rootRect.top : rect.left - rootRect.left
    )
    if (distance < closest) {
      closest = distance
      active = index
    }
  })
  return active
}

/** A native CSS scroll-snap container for page-like or horizontal sections. */
function ScrollSnap({
  axis = "y",
  strictness = "mandatory",
  hideScrollbar = false,
  onActiveChange,
  className,
  style,
  ref,
  onScroll,
  ...props
}: ScrollSnapProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const activeRef = React.useRef(-1)
  const frameRef = React.useRef(0)
  const callbackRef = React.useRef(onActiveChange)
  callbackRef.current = onActiveChange

  const update = React.useCallback(() => {
    const root = rootRef.current
    if (!root || !callbackRef.current) return
    const next = getActiveIndex(root, axis)
    if (next !== activeRef.current && next >= 0) {
      activeRef.current = next
      callbackRef.current(next)
    }
  }, [axis])

  React.useEffect(() => {
    update()
    return () => cancelAnimationFrame(frameRef.current)
  }, [update])

  return (
    <div
      ref={(node) => {
        rootRef.current = node
        if (typeof ref === "function") return ref(node)
        if (ref) ref.current = node
      }}
      data-slot="scroll-snap"
      data-axis={axis}
      className={cn(
        "overscroll-contain",
        axis === "y" ? "overflow-y-auto" : "overflow-x-auto",
        hideScrollbar && "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      style={{ ...style, scrollSnapType: `${axis} ${strictness}` }}
      onScroll={(event) => {
        if (onActiveChange) {
          cancelAnimationFrame(frameRef.current)
          frameRef.current = requestAnimationFrame(update)
        }
        onScroll?.(event)
      }}
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
