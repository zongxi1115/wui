import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const emptyStateVariants = cva(
  "flex w-full flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "min-h-40 px-5 py-8",
        default: "min-h-64 px-6 py-12",
        lg: "min-h-80 px-8 py-16",
      },
    },
    defaultVariants: { size: "default" },
  }
)

const emptyStateClassicIllustrations = [
  "nothing-here-no-image",
  "under-construction-maintenance",
  "no-files-found",
  "empty-folder",
  "add-files",
  "search-folder",
  "add-media",
  "xls-file",
  "zip-file",
  "file-not-found",
  "search",
  "file-broken-or-not-found",
  "general-files",
  "search-general",
  "content-unavailable",
  "add-photo",
  "add-photos",
  "search-photos-files",
  "task-done",
  "no-content-general",
  "no-reports",
  "add-dashboard",
  "no-files",
  "upload-file",
  "upload-general",
  "messages-add-message",
  "no-messages",
  "cards",
  "add-card",
  "card-expired",
  "card-rejected",
  "no-credits",
  "no-tasks",
  "add-task",
  "no-appointments",
  "no-location",
  "no-address",
  "empty-inbox",
  "add-to-inbox",
  "email-sent",
  "empty-inbox-2",
  "check-your-inbox",
  "no-emails",
  "add-to-group",
  "add-user",
  "search-user",
  "add-user-2",
  "users",
  "something-went-wrong",
  "404-page-not-found",
  "nothing-here",
  "nothing-here-2",
  "no-products",
  "no-friends",
  "trash-empty",
  "empty-box",
  "add-product",
  "no-notifications",
  "launch-app",
  "add-alarm",
  "no-alarms",
  "youre-awesome",
  "no-vacation",
  "empty-cart",
  "connection-lost",
] as const

const emptyStateColorIllustrations = [
  "add-email",
  "allow-notifications",
  "app-locked",
  "camera-access",
  "email-sent",
  "expired-alt",
  "expired",
  "microphone-access",
  "no-plan-chosen",
  "payment",
  "phone-numbers",
  "search",
  "send-email",
  "settings",
  "resource-1",
  "resource-2",
  "resource-3",
  "resource-4",
  "resource-5",
  "resource-6",
] as const

const emptyStateIllustrations = {
  gradient: emptyStateClassicIllustrations,
  flat: emptyStateClassicIllustrations,
  color: emptyStateColorIllustrations,
} as const

export type EmptyStateClassicIllustration =
  (typeof emptyStateClassicIllustrations)[number]
export type EmptyStateColorIllustration =
  (typeof emptyStateColorIllustrations)[number]
export type EmptyStateIllustrationVariant = keyof typeof emptyStateIllustrations

type EmptyStateIllustrationSelection =
  | {
      variant?: "gradient" | "flat"
      name: EmptyStateClassicIllustration
    }
  | {
      variant: "color"
      name: EmptyStateColorIllustration
    }

export type EmptyStateIllustrationProps = Omit<
  React.ComponentProps<"img">,
  "src"
> &
  EmptyStateIllustrationSelection & {
    /** Public directory that contains the bundled illustration variants. */
    assetBasePath?: string
  }

export interface EmptyStateProps extends React.ComponentProps<"div"> {
  /** Vertical density preset. @default "default" */
  size?: "sm" | "default" | "lg"
}

/** A focused zero-data state with optional illustration and actions. */
function EmptyState({
  className,
  size = "default",
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(emptyStateVariants({ size }), className)}
      {...props}
    />
  )
}

function EmptyStateIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-icon"
      className={cn(
        "bg-muted/50 text-muted-foreground shadow-xs mb-5 flex size-11 items-center justify-center rounded-full border [&_svg]:size-5",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-media"
      className={cn("mb-6 flex items-center justify-center", className)}
      {...props}
    />
  )
}

function EmptyStateIllustration({
  name,
  variant = "gradient",
  assetBasePath = "/wui/empty-state",
  alt = "",
  className,
  ...props
}: EmptyStateIllustrationProps) {
  return (
    <img
      data-slot="empty-state-illustration"
      src={`${assetBasePath}/${variant}/${name}.svg`}
      alt={alt}
      className={cn("h-auto w-36 max-w-full object-contain", className)}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}

function EmptyStateTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="empty-state-title"
      className={cn("text-base font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function EmptyStateDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-state-description"
      className={cn(
        "text-muted-foreground mt-1.5 max-w-sm text-sm leading-6",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-actions"
      className={cn(
        "mt-5 flex flex-wrap items-center justify-center gap-2",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateHint({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-hint"
      className={cn(
        "text-muted-foreground mt-6 border-t pt-4 text-xs",
        className
      )}
      {...props}
    />
  )
}

export {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHint,
  EmptyStateIcon,
  EmptyStateIllustration,
  EmptyStateMedia,
  EmptyStateTitle,
  emptyStateClassicIllustrations,
  emptyStateColorIllustrations,
  emptyStateIllustrations,
  emptyStateVariants,
}
