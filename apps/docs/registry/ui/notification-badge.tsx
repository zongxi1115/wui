"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/registry/lib/utils"

const EASE_OUT = [0.22, 1, 0.36, 1] as const

/** Visual surface of the indicator. Positioning lives on a separate anchor element. */
const notificationBadgeVariants = cva(
  "relative inline-flex min-w-5 items-center justify-center rounded-full border-2 border-background px-1 text-[11px] font-semibold tabular-nums leading-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        info: "bg-info text-info-foreground",
      },
      dot: {
        true: "size-2 min-w-0 border-0 p-0 ring-2 ring-background",
        false: "h-5",
      },
    },
    defaultVariants: {
      variant: "destructive",
      dot: false,
    },
  }
)

export interface NotificationBadgeProps
  extends Omit<React.ComponentProps<"span">, "content"> {
  /** Content displayed in the indicator. Numeric values respect `max` and roll when they change. */
  count?: React.ReactNode
  /** Highest numeric value shown before using a trailing plus sign. @default 99 */
  max?: number
  /** Keep a numeric zero visible. @default false */
  showZero?: boolean
  /** Render a small presence dot instead of count content. @default false */
  dot?: boolean
  /** Emit a soft expanding ring around the dot to draw attention. Only applies with `dot`. @default false */
  pulse?: boolean
  /** Controlled indicator visibility. @default true */
  visible?: boolean
  /** Semantic color of the indicator. @default "destructive" */
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  /** Pixel offset from the top-right anchor. @default [0, 0] */
  offset?: readonly [number, number]
  /** Accessible name for the indicator. */
  label?: string
}

/** One digit column that slides the new value in from the direction of change. */
function RollingDigit({
  digit,
  direction,
  reduceMotion,
}: {
  digit: string
  direction: number
  reduceMotion: boolean | null
}) {
  return (
    <span className="relative inline-flex h-[1em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.span
          key={digit}
          custom={direction}
          className="inline-block"
          variants={{
            enter: (dir: number) => ({ y: reduceMotion ? 0 : `${dir * 100}%`, opacity: 0 }),
            center: { y: "0%", opacity: 1 },
            exit: (dir: number) => ({ y: reduceMotion ? 0 : `${dir * -100}%`, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: EASE_OUT }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Places a count or dot indicator over any icon, avatar, or control. */
function NotificationBadge({
  className,
  count,
  max = 99,
  showZero = false,
  dot = false,
  pulse = false,
  visible = true,
  variant = "destructive",
  offset = [0, 0],
  label,
  children,
  ...props
}: NotificationBadgeProps) {
  const reduceMotion = useReducedMotion()
  const isNumeric = typeof count === "number"
  const isEmpty =
    count === null || count === undefined || (isNumeric && count === 0)
  const showIndicator = visible && (dot || !isEmpty || (isNumeric && showZero))
  const overflow = isNumeric && count > max
  const accessibleLabel =
    label ??
    (dot ? "有新通知" : isNumeric ? `${count} 条未读通知` : undefined)

  // Remember the previous number so digits roll up when it grows and down when it shrinks.
  const [previous, setPrevious] = React.useState(isNumeric ? count : 0)
  const [direction, setDirection] = React.useState(1)
  if (isNumeric && count !== previous) {
    setDirection(count > previous ? 1 : -1)
    setPrevious(count)
  }

  let content: React.ReactNode = null
  if (!dot) {
    if (isNumeric && !overflow) {
      // Right-align digits so the ones column keeps its identity (key) as the number grows.
      const digits = String(count).split("")
      content = (
        <span className="inline-flex">
          {digits.map((digit, index) => (
            <RollingDigit
              key={digits.length - index}
              digit={digit}
              direction={direction}
              reduceMotion={reduceMotion}
            />
          ))}
        </span>
      )
    } else {
      content = overflow ? `${max}+` : count
    }
  }

  return (
    <span
      data-slot="notification-badge"
      className={cn("relative inline-flex w-fit align-middle", className)}
      {...props}
    >
      {children}
      <AnimatePresence initial={false}>
        {showIndicator ? (
          <span
            key="indicator"
            data-slot="notification-badge-anchor"
            className="pointer-events-none absolute right-0 top-0 z-10"
            style={{
              transform: `translate(calc(50% + ${offset[0]}px), calc(-50% + ${offset[1]}px))`,
            }}
          >
            <motion.span
              data-slot="notification-badge-indicator"
              data-dot={dot ? "" : undefined}
              role="status"
              aria-label={accessibleLabel}
              className={cn(
                notificationBadgeVariants({ variant, dot }),
                "pointer-events-auto"
              )}
              initial={reduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 560, damping: 26, mass: 0.6 }
              }
            >
              {dot && pulse && !reduceMotion ? (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-inherit"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.6, opacity: 0 }}
                  transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity }}
                />
              ) : null}
              {content}
            </motion.span>
          </span>
        ) : null}
      </AnimatePresence>
    </span>
  )
}

export { NotificationBadge, notificationBadgeVariants }
