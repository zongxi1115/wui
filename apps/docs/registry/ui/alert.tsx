"use client"

import * as React from "react"
import {
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

export type AlertVariant =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "destructive"

const alertVariants = cva(
  "relative flex w-full items-start gap-3 rounded-md border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground",
        info: "border-info/30 bg-info/5 text-foreground",
        success: "border-success/30 bg-success/5 text-foreground",
        warning: "border-warning/30 bg-warning/5 text-foreground",
        destructive:
          "border-destructive/30 bg-destructive/5 text-foreground",
      },
      size: {
        default: "min-h-12",
        compact: "min-h-10 px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const defaultIcons = {
  default: InfoIcon,
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  destructive: CircleXIcon,
} as const

export interface AlertProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Semantic appearance and default icon. @default "default" */
  variant?: AlertVariant
  /** Density preset. @default "default" */
  size?: "default" | "compact"
  /** Optional heading displayed above the description. */
  title?: React.ReactNode
  /** Custom leading icon. Pass `false` to hide the icon. */
  icon?: React.ReactNode | false
  /** Optional action rendered at the end of the alert. */
  action?: React.ReactNode
  /** Show a close control. @default false */
  closable?: boolean
  /** Controlled visibility. */
  visible?: boolean
  /** Initial visibility in uncontrolled mode. @default true */
  defaultVisible?: boolean
  /** Called whenever visibility changes. */
  onVisibleChange?: (visible: boolean) => void
}

/** A persistent inline status alert with optional action and dismissal. */
function Alert({
  className,
  variant = "default",
  size = "default",
  title,
  children,
  icon,
  action,
  closable = false,
  visible,
  defaultVisible = true,
  onVisibleChange,
  role,
  ...props
}: AlertProps) {
  const [internalVisible, setInternalVisible] = React.useState(defaultVisible)
  const isVisible = visible ?? internalVisible
  const DefaultIcon = defaultIcons[variant]

  function setVisible(next: boolean) {
    if (visible === undefined) setInternalVisible(next)
    onVisibleChange?.(next)
  }

  if (!isVisible) return null

  return (
    <div
      data-slot="alert"
      data-variant={variant}
      data-size={size}
      role={
        role ??
        (variant === "warning" || variant === "destructive"
          ? "alert"
          : "status")
      }
      className={cn(alertVariants({ variant, size }), className)}
      {...props}
    >
      {icon !== false ? (
        <span
          data-slot="alert-icon"
          className={cn(
            "mt-0.5 flex shrink-0 text-muted-foreground [&_svg]:size-4",
            variant === "info" && "text-info",
            variant === "success" && "text-success",
            variant === "warning" && "text-warning",
            variant === "destructive" && "text-destructive"
          )}
        >
          {icon ?? <DefaultIcon />}
        </span>
      ) : null}

      <span data-slot="alert-content" className="min-w-0 flex-1">
        {title ? (
          <span data-slot="alert-title" className="block font-medium leading-5">
            {title}
          </span>
        ) : null}
        {children ? (
          <span
            data-slot="alert-description"
            className={cn(
              "block leading-5 text-muted-foreground",
              title && "mt-0.5"
            )}
          >
            {children}
          </span>
        ) : null}
      </span>

      {action ? (
        <span data-slot="alert-action" className="ml-2 flex shrink-0 items-center">
          {action}
        </span>
      ) : null}

      {closable ? (
        <button
          type="button"
          data-slot="alert-close"
          aria-label="Close alert"
          className="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/30 [&_svg]:size-4"
          onClick={() => setVisible(false)}
        >
          <XIcon />
        </button>
      ) : null}
    </div>
  )
}

export { Alert, alertVariants }
