"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

type TimelineOrientation = "vertical" | "horizontal"
type TimelineAlign = "start" | "alternate"
type TimelineDensity = "default" | "compact"
type TimelineSide = "left" | "right"

const TimelineContext = React.createContext<{
  orientation: TimelineOrientation
  align: TimelineAlign
  density: TimelineDensity
  connector: "solid" | "dashed"
}>({
  orientation: "vertical",
  align: "start",
  density: "default",
  connector: "solid",
})

const TimelineItemContext = React.createContext<{ side: TimelineSide }>({
  side: "right",
})

const timelineDotVariants = cva(
  "relative z-10 flex shrink-0 items-center justify-center border-2 border-background ring-1 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-muted-foreground text-background ring-border",
        primary: "bg-primary text-primary-foreground ring-primary/30",
        success: "bg-success text-success-foreground ring-success/30",
        warning: "bg-warning text-warning-foreground ring-warning/30",
        destructive:
          "bg-destructive text-destructive-foreground ring-destructive/30",
      },
      size: {
        dot: "size-2.5 rounded-full",
        icon: "size-8 rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "dot" },
  }
)

const timelinePulseVariants = {
  default: "bg-muted-foreground/20",
  primary: "bg-primary/20",
  success: "bg-success/20",
  warning: "bg-warning/20",
  destructive: "bg-destructive/20",
} as const

export interface TimelineProps extends React.ComponentProps<"ol"> {
  /** Timeline direction. @default "vertical" */
  orientation?: TimelineOrientation
  /** Content alignment. Alternate alignment only applies vertically. @default "start" */
  align?: TimelineAlign
  /** Spacing preset between events. @default "default" */
  density?: TimelineDensity
  /** Connector line treatment. @default "solid" */
  connector?: "solid" | "dashed"
}

/** A composable chronological list supporting vertical, alternate, and horizontal layouts. */
function Timeline({
  className,
  orientation = "vertical",
  align = "start",
  density = "default",
  connector = "solid",
  ...props
}: TimelineProps) {
  const resolvedAlign = orientation === "horizontal" ? "start" : align

  return (
    <TimelineContext.Provider
      value={{ orientation, align: resolvedAlign, density, connector }}
    >
      <ol
        data-slot="timeline"
        data-orientation={orientation}
        data-align={resolvedAlign}
        data-density={density}
        className={cn(
          "relative",
          orientation === "vertical"
            ? "flex flex-col"
            : "grid min-w-max auto-cols-[minmax(10rem,1fr)] grid-flow-col",
          className
        )}
        {...props}
      />
    </TimelineContext.Provider>
  )
}

export interface TimelineItemProps extends React.ComponentProps<"li"> {
  /** Side used by alternate timelines. @default "right" */
  side?: TimelineSide
  /** Semantic progression state. @default "default" */
  state?: "default" | "complete" | "current" | "upcoming"
}

function TimelineItem({
  className,
  side = "right",
  state = "default",
  ...props
}: TimelineItemProps) {
  const { orientation, align, density } = React.useContext(TimelineContext)
  const alternate = orientation === "vertical" && align === "alternate"

  return (
    <TimelineItemContext.Provider value={{ side }}>
      <li
        data-slot="timeline-item"
        data-state={state}
        data-side={side}
        className={cn(
          "group relative",
          orientation === "horizontal"
            ? "grid min-w-40 grid-rows-[2rem_auto] gap-y-3 pr-6 last:pr-0"
            : alternate
              ? "grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] gap-x-4"
              : "grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3",
          orientation === "vertical" &&
            (density === "compact" ? "pb-4 last:pb-0" : "pb-7 last:pb-0"),
          state === "upcoming" && "[&_[data-slot=timeline-content]]:opacity-55",
          className
        )}
        {...props}
      />
    </TimelineItemContext.Provider>
  )
}

export interface TimelineDotProps extends Omit<
  React.ComponentProps<"span">,
  "children"
> {
  /** Semantic marker color. @default "default" */
  variant?: "default" | "primary" | "success" | "warning" | "destructive"
  /** Marker shape. Icon markers accept an icon as children. @default "dot" */
  size?: "dot" | "icon"
  /** Draw attention to the current event with a subtle pulse. @default false */
  pulse?: boolean
  /** Optional icon rendered inside an icon-sized marker. */
  children?: React.ReactNode
}

function TimelineDot({
  className,
  variant = "default",
  size = "dot",
  pulse = false,
  children,
  ...props
}: TimelineDotProps) {
  const { orientation, align } = React.useContext(TimelineContext)
  const { side } = React.useContext(TimelineItemContext)
  const reduceMotion = useReducedMotion()
  const alternate = orientation === "vertical" && align === "alternate"

  return (
    <span
      data-slot="timeline-marker"
      className={cn(
        "relative flex self-stretch",
        orientation === "horizontal"
          ? "row-start-1 items-center"
          : "items-start justify-center pt-1.5",
        alternate && "col-start-2 row-start-1",
        !alternate && orientation === "vertical" && "col-start-1",
        side === "left" && alternate && "col-start-2"
      )}
    >
      <TimelineSeparator markerSize={size} />
      {pulse ? (
        <motion.span
          aria-hidden
          className={cn(
            "absolute z-0 rounded-full",
            timelinePulseVariants[variant],
            size === "icon" ? "size-8" : "size-2.5"
          )}
          style={{
            left:
              orientation === "horizontal"
                ? size === "icon"
                  ? 16
                  : 5
                : "50%",
            top: orientation === "horizontal" ? 16 : size === "icon" ? 22 : 11,
            x: "-50%",
            y: "-50%",
          }}
          animate={
            reduceMotion
              ? { opacity: 0.35 }
              : { opacity: [0.45, 0], scale: [1, 2.2] }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 1.8, ease: "easeOut", repeat: Infinity }
          }
        />
      ) : null}
      <span
        data-slot="timeline-dot"
        className={cn(timelineDotVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </span>
    </span>
  )
}

export interface TimelineSeparatorProps extends React.ComponentProps<"span"> {
  /** Marker size used to align the connector with the marker edge. @default "dot" */
  markerSize?: "dot" | "icon"
}

function TimelineSeparator({
  className,
  markerSize = "dot",
  ...props
}: TimelineSeparatorProps) {
  const { orientation, density, connector } = React.useContext(TimelineContext)

  return (
    <span
      aria-hidden
      data-slot="timeline-separator"
      className={cn(
        "absolute group-last:hidden",
        orientation === "vertical"
          ? cn(
              "left-1/2 w-px -translate-x-1/2",
              markerSize === "icon" ? "top-[2.375rem]" : "top-4",
              density === "compact"
                ? "bottom-[-1.375rem]"
                : "bottom-[-2.125rem]"
            )
          : cn(
              // Markers sit at the column start, so the line runs from the
              // marker edge to the next item's marker (one `pr-6` gutter away).
              "-right-6 top-1/2 h-px -translate-y-1/2",
              markerSize === "icon" ? "left-8" : "left-2.5"
            ),
        connector === "dashed"
          ? orientation === "vertical"
            ? "border-border border-l border-dashed"
            : "border-border border-t border-dashed"
          : "bg-border",
        className
      )}
      {...props}
    />
  )
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation, align } = React.useContext(TimelineContext)
  const { side } = React.useContext(TimelineItemContext)
  const alternate = orientation === "vertical" && align === "alternate"

  return (
    <div
      data-slot="timeline-content"
      className={cn(
        "min-w-0 transition-opacity",
        orientation === "horizontal" && "row-start-2",
        alternate && side === "left" && "col-start-1 row-start-1 text-right",
        alternate && side === "right" && "col-start-3 row-start-1 text-left",
        className
      )}
      {...props}
    />
  )
}

function TimelineHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-header"
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1",
        className
      )}
      {...props}
    />
  )
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="timeline-title"
      className={cn("text-sm font-medium leading-5", className)}
      {...props}
    />
  )
}

function TimelineTime({ className, ...props }: React.ComponentProps<"time">) {
  return (
    <time
      data-slot="timeline-time"
      className={cn("text-muted-foreground text-xs tabular-nums", className)}
      {...props}
    />
  )
}

function TimelineDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="timeline-description"
      className={cn("text-muted-foreground mt-1 text-sm leading-6", className)}
      {...props}
    />
  )
}

function TimelineCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-card"
      className={cn(
        "bg-background shadow-xs mt-2 rounded-md border p-3 text-left",
        className
      )}
      {...props}
    />
  )
}

function TimelineMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-meta"
      className={cn(
        "text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs",
        className
      )}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineCard,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineMeta,
  TimelineSeparator,
  TimelineTime,
  TimelineTitle,
  timelineDotVariants,
}
