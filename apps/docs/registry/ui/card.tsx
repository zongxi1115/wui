import * as React from "react"

import { cn } from "@/registry/lib/utils"

const cardSurface = {
  /** Lifts the card off the page so it reads as a surface, not an outline. */
  elevated: "border-border/60 border shadow-md",
  /** Flat treatment for dense grids where stacked shadows would be noisy. */
  outline: "border",
} as const

/** A composable surface that groups related content and actions. */
function Card({
  className,
  variant = "elevated",
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** Surface treatment. @default "elevated" */
  variant?: keyof typeof cardSurface
  /** Adds press affordance for cards that behave as a single target. @default false */
  interactive?: boolean
}) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      className={cn(
        "bg-card text-card-foreground relative flex flex-col gap-4 rounded-2xl pb-6 pt-5",
        cardSurface[variant],
        interactive && [
          "focus-visible:ring-ring/35 cursor-pointer outline-none focus-visible:ring-[3px]",
          "transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.995] active:duration-100",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
          variant === "elevated"
            ? "hover:shadow-lg"
            : "hover:border-foreground/20",
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
        "has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto] grid gap-1 px-6",
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
        "text-[1.0625rem] font-semibold leading-6 tracking-[-0.012em]",
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
      className={cn("text-muted-foreground text-sm leading-normal", className)}
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
        "col-start-2 row-span-2 row-start-1 -mr-2 self-start",
        className
      )}
      {...props}
    />
  )
}

/** Contains the card's main content. */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("px-6", className)} {...props} />
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
        "-mt-5 overflow-hidden rounded-t-2xl [&_img]:block [&_img]:size-full [&_img]:object-cover",
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
      className={cn("flex items-center gap-3 px-6", className)}
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
