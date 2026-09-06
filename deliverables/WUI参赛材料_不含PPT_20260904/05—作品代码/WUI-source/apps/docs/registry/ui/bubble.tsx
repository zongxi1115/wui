"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

type BubbleSide = "start" | "end"

const BubbleContext = React.createContext<{ side: BubbleSide } | null>(null)

const bubbleVariants = cva("flex w-full items-start gap-2.5", {
  variants: {
    side: {
      start: "justify-start",
      end: "justify-end",
    },
  },
  defaultVariants: {
    side: "start",
  },
})

const bubbleContentVariants = cva(
  "min-w-0 rounded-xl px-3.5 py-2.5 text-sm leading-6",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground",
        primary: "bg-primary text-primary-foreground",
        outline: "border bg-background text-foreground",
        ghost: "bg-transparent px-0 py-0 text-foreground",
      },
      side: {
        start: "rounded-tl-sm",
        end: "rounded-tr-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      side: "start",
    },
  }
)

function useBubble() {
  const context = React.useContext(BubbleContext)
  if (!context) throw new Error("Bubble parts must be used inside <Bubble />")
  return context
}

export interface BubbleProps extends React.ComponentProps<"article"> {
  /** Horizontal message alignment. @default "start" */
  side?: BubbleSide
}

/** A composable message bubble for chat, comments, and activity threads. */
function Bubble({
  className,
  side = "start",
  ...props
}: BubbleProps) {
  return (
    <BubbleContext.Provider value={{ side }}>
      <article
        data-slot="bubble"
        data-side={side}
        className={cn(bubbleVariants({ side }), className)}
        {...props}
      />
    </BubbleContext.Provider>
  )
}

function BubbleAvatar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { side } = useBubble()
  return (
    <div
      data-slot="bubble-avatar"
      data-side={side}
      className={cn(
        "mt-5 shrink-0",
        side === "end" && "order-2",
        className
      )}
      {...props}
    />
  )
}

function BubbleBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { side } = useBubble()
  return (
    <div
      data-slot="bubble-body"
      data-side={side}
      className={cn(
        "flex min-w-0 max-w-[82%] flex-col gap-1",
        side === "end" && "items-end",
        className
      )}
      {...props}
    />
  )
}

function BubbleHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  const { side } = useBubble()
  return (
    <header
      data-slot="bubble-header"
      data-side={side}
      className={cn(
        "flex min-h-4 items-center gap-2 px-1 text-xs text-muted-foreground",
        side === "end" && "flex-row-reverse",
        className
      )}
      {...props}
    />
  )
}

export interface BubbleContentProps extends React.ComponentProps<"div"> {
  /** Surface treatment for the message. @default "default" */
  variant?: "default" | "primary" | "outline" | "ghost"
}

function BubbleContent({
  className,
  variant = "default",
  ...props
}: BubbleContentProps) {
  const { side } = useBubble()
  return (
    <div
      data-slot="bubble-content"
      data-side={side}
      data-variant={variant}
      className={cn(
        bubbleContentVariants({ side, variant }),
        className
      )}
      {...props}
    />
  )
}

function BubbleFooter({
  className,
  ...props
}: React.ComponentProps<"footer">) {
  const { side } = useBubble()
  return (
    <footer
      data-slot="bubble-footer"
      data-side={side}
      className={cn(
        "flex items-center gap-2 px-1 text-xs text-muted-foreground",
        side === "end" && "flex-row-reverse",
        className
      )}
      {...props}
    />
  )
}

function BubbleActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-actions"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  )
}

export {
  Bubble,
  BubbleActions,
  BubbleAvatar,
  BubbleBody,
  BubbleContent,
  BubbleFooter,
  BubbleHeader,
  bubbleContentVariants,
  bubbleVariants,
}
