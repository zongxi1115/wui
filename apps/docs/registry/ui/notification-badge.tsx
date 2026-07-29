import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const notificationBadgeVariants = cva(
  "absolute right-0 top-0 z-10 inline-flex min-w-5 items-center justify-center rounded-full border-2 border-background px-1 text-[11px] font-semibold tabular-nums leading-none shadow-xs",
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
  /** Content displayed in the indicator. Numeric values respect `max`. */
  count?: React.ReactNode
  /** Highest numeric value shown before using a trailing plus sign. @default 99 */
  max?: number
  /** Keep a numeric zero visible. @default false */
  showZero?: boolean
  /** Render a small presence dot instead of count content. @default false */
  dot?: boolean
  /** Controlled indicator visibility. @default true */
  visible?: boolean
  /** Semantic color of the indicator. @default "destructive" */
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  /** Pixel offset from the top-right anchor. @default [0, 0] */
  offset?: readonly [number, number]
  /** Accessible name for the indicator. */
  label?: string
}

/** Places a count or dot indicator over any icon, avatar, or control. */
function NotificationBadge({
  className,
  count,
  max = 99,
  showZero = false,
  dot = false,
  visible = true,
  variant = "destructive",
  offset = [0, 0],
  label,
  children,
  ...props
}: NotificationBadgeProps) {
  const isNumeric = typeof count === "number"
  const isEmpty = count === null || count === undefined || (isNumeric && count === 0)
  const showIndicator = visible && (dot || !isEmpty || (isNumeric && showZero))
  const displayCount = isNumeric && count > max ? `${max}+` : count
  const accessibleLabel =
    label ??
    (dot
      ? "New notification"
      : isNumeric
        ? `${count} notifications`
        : undefined)

  return (
    <span
      data-slot="notification-badge"
      className={cn("relative inline-flex w-fit align-middle", className)}
      {...props}
    >
      {children}
      {showIndicator ? (
        <span
          data-slot="notification-badge-indicator"
          data-dot={dot ? "" : undefined}
          role="status"
          aria-label={accessibleLabel}
          className={notificationBadgeVariants({ variant, dot })}
          style={{
            transform: `translate(calc(50% + ${offset[0]}px), calc(-50% + ${offset[1]}px))`,
          }}
        >
          {dot ? null : displayCount}
        </span>
      ) : null}
    </span>
  )
}

export { NotificationBadge, notificationBadgeVariants }
