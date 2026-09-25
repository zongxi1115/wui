import * as React from "react"

import { cn } from "@/registry/lib/utils"

const cardSurface = {
  /** Lifts the card with a quiet ambient shadow and a low-contrast edge. */
  elevated: "border-border/70 border shadow-sm",
  /** Flat treatment for dense grids where stacked shadows would be noisy. */
  outline: "border-border border shadow-none",
} as const

export interface CardProps extends React.ComponentProps<"div"> {
  /** Surface treatment. @default "elevated" */
  variant?: keyof typeof cardSurface
  /** Adds hover lift, border emphasis and press feedback for cards that behave as a single target. @default false */
  interactive?: boolean
}

/** A composable surface that groups related content and actions. */
function Card({
  className,
  variant = "elevated",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-interactive={interactive || undefined}
      className={cn(
        "bg-card text-card-foreground relative isolate flex flex-col gap-5 rounded-xl py-5",
        cardSurface[variant],
        interactive && [
          "focus-visible:ring-ring/40 focus-visible:ring-offset-background cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-offset-2",
          "transition-[border-color,box-shadow,translate,scale] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] active:duration-100",
          "motion-reduce:transition-[border-color,box-shadow] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
          variant === "elevated"
            ? "hover:border-foreground/15 hover:shadow-md"
            : "hover:border-foreground/25",
        ],
        className
      )}
      {...props}
    />
  )
}

/** Aligns the card heading, description, and optional action. */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto] grid gap-x-4 gap-y-1 px-5 sm:px-6",
        className
      )}
      {...props}
    />
  )
}

/** The primary heading of a card. */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-balance text-[1.0625rem] font-semibold leading-6 tracking-[-0.015em]",
        className
      )}
      {...props}
    />
  )
}

/** Supporting text displayed below the card title. */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-muted-foreground max-w-prose text-pretty text-sm leading-[1.45]",
        className
      )}
      {...props}
    />
  )
}

/** Places a compact action opposite the card heading. */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 -mr-1 -mt-1 self-start",
        className
      )}
      {...props}
    />
  )
}

/** Contains the card's main content. */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5 sm:px-6", className)}
      {...props}
    />
  )
}

/**
 * Media that bleeds to the card edge. Clips itself to the card radius so the
 * card does not need `overflow-hidden`, which would trap nested popovers.
 */
function CardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-media"
      className={cn(
        "-mt-5 overflow-hidden rounded-t-[calc(var(--radius)+3px)] [&_img]:block [&_img]:size-full [&_img]:object-cover",
        className
      )}
      {...props}
    />
  )
}

/** Aligns secondary information and actions at the end of a card. */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2.5 px-5 sm:px-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
}
