"use client"

import * as React from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

type BubbleSide = "start" | "end"

const BubbleContext = React.createContext<{ side: BubbleSide } | null>(null)

const ease = [0.22, 1, 0.36, 1] as const

const bubbleVariants = cva("group/bubble flex w-full items-start gap-2.5", {
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
  "min-w-0 rounded-xl px-3.5 py-2.5 text-sm leading-6 break-words",
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
  /** Play the enter motion from the sender side when the message mounts. @default true */
  animated?: boolean
}

/** A composable message bubble for chat, comments, and activity threads. */
function Bubble({
  className,
  side = "start",
  animated = true,
  style,
  ...props
}: BubbleProps) {
  const reduceMotion = useReducedMotion()
  const offset = side === "end" ? 12 : -12

  return (
    <BubbleContext.Provider value={{ side }}>
      <motion.article
        data-slot="bubble"
        data-side={side}
        className={cn(bubbleVariants({ side }), className)}
        initial={
          animated && !reduceMotion
            ? { opacity: 0, x: offset, y: 6, scale: 0.98 }
            : false
        }
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease }}
        style={{
          transformOrigin: side === "end" ? "100% 0%" : "0% 0%",
          ...style,
        }}
        {...(props as HTMLMotionProps<"article">)}
      />
    </BubbleContext.Provider>
  )
}

function BubbleAvatar({ className, ...props }: React.ComponentProps<"div">) {
  const { side } = useBubble()
  return (
    <div
      data-slot="bubble-avatar"
      data-side={side}
      className={cn(
        // Align with the message surface: offset by the header row only when one exists.
        "shrink-0 group-has-[[data-slot=bubble-header]]/bubble:mt-5",
        side === "end" && "order-2",
        className
      )}
      {...props}
    />
  )
}

function BubbleBody({ className, ...props }: React.ComponentProps<"div">) {
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
      className={cn(bubbleContentVariants({ side, variant }), className)}
      {...props}
    />
  )
}

export interface BubbleTypingProps extends React.ComponentProps<"span"> {
  /** Accessible status announced while the sender is composing. @default "正在输入" */
  label?: string
}

/** Three staggered dots signalling that the sender is composing a reply. */
function BubbleTyping({
  className,
  label = "正在输入",
  ...props
}: BubbleTypingProps) {
  const reduceMotion = useReducedMotion()

  return (
    <span
      role="status"
      aria-label={label}
      data-slot="bubble-typing"
      className={cn("flex h-6 items-center gap-1", className)}
      {...props}
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          aria-hidden
          className="size-1.5 rounded-full bg-current opacity-40"
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -3, 0], opacity: [0.35, 0.9, 0.35] }
          }
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            delay: index * 0.16,
          }}
        />
      ))}
    </span>
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

function BubbleActions({ className, ...props }: React.ComponentProps<"div">) {
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
  BubbleTyping,
  bubbleContentVariants,
  bubbleVariants,
}
