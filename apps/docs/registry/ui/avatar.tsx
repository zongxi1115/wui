"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Avatar as AvatarPrimitive } from "radix-ui"

import { cn } from "@/registry/lib/utils"

const avatarVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-visible rounded-full align-middle",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-xs",
        default: "size-10 text-sm",
        lg: "size-12 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const avatarBadgeVariants = cva(
  "absolute bottom-0 right-0 z-10 block rounded-full ring-2 ring-background",
  {
    variants: {
      status: {
        online: "bg-success",
        away: "bg-warning",
        busy: "bg-destructive",
        offline: "bg-muted-foreground",
      },
      size: {
        sm: "size-2",
        default: "size-2.5",
      },
    },
    defaultVariants: {
      status: "online",
      size: "default",
    },
  }
)

export interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  /** Physical avatar size. @default "default" */
  size?: "xs" | "sm" | "default" | "lg"
}

/** A person, team, or agent identity with image fallback support. */
function Avatar({ className, size = "default", ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "size-full rounded-[inherit] object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-[inherit] bg-muted font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export interface AvatarBadgeProps extends React.ComponentProps<"span"> {
  /** Presence meaning represented by the badge color. @default "online" */
  status?: "online" | "away" | "busy" | "offline"
  /** Badge diameter. @default "default" */
  size?: "sm" | "default"
}

function AvatarBadge({
  className,
  status = "online",
  size = "default",
  ...props
}: AvatarBadgeProps) {
  return (
    <span
      data-slot="avatar-badge"
      data-status={status}
      aria-label={status}
      className={cn(avatarBadgeVariants({ status, size }), className)}
      {...props}
    />
  )
}

function AvatarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      role="group"
      className={cn(
        "flex items-center [&>[data-slot=avatar]]:-ml-2 [&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-background [&>[data-slot=avatar]:first-child]:ml-0",
        className
      )}
      {...props}
    />
  )
}

export interface AvatarGroupCountProps extends React.ComponentProps<"span"> {
  /** Match the count indicator to the avatars in the group. @default "default" */
  size?: "xs" | "sm" | "default" | "lg"
}

function AvatarGroupCount({
  className,
  size = "default",
  ...props
}: AvatarGroupCountProps) {
  return (
    <span
      data-slot="avatar-group-count"
      data-size={size}
      className={cn(
        avatarVariants({ size }),
        "-ml-2 bg-muted font-medium text-muted-foreground ring-2 ring-background",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  avatarBadgeVariants,
  avatarVariants,
}
