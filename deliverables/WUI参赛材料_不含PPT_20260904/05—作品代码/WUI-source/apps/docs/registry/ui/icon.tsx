import * as React from "react"
import type { LucideIcon, LucideProps } from "lucide-react"

import { cn } from "@/registry/lib/utils"

const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const

export type IconSize = keyof typeof iconSizes

const iconColorVariants = {
  default: "text-foreground",
  primary: "text-primary",
  secondary: "text-secondary-foreground",
  muted: "text-muted-foreground",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
} as const

export type IconColor = keyof typeof iconColorVariants

export interface IconProps extends Omit<
  LucideProps,
  "aria-hidden" | "aria-label" | "role" | "size" | "color"
> {
  /** Lucide icon component to render. */
  icon: LucideIcon
  /** Named size token or an exact pixel size. @default "md" */
  size?: IconSize | number
  /** Semantic text color token. @default "default" */
  variant?: IconColor
  /** Custom CSS/SVG color. Overrides the semantic color when provided. */
  color?: React.CSSProperties["color"]
  /** Accessible name. Omit it when the icon is purely decorative. */
  label?: string
}

/** A small, accessible adapter for the Lucide icons used throughout wui. */
function Icon({
  icon: Glyph,
  size = "md",
  variant = "default",
  className,
  color,
  label,
  ...props
}: IconProps) {
  const resolvedSize = typeof size === "number" ? size : iconSizes[size]

  return (
    <Glyph
      data-slot="icon"
      size={resolvedSize}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
      className={cn(
        color === undefined ? iconColorVariants[variant] : undefined,
        className
      )}
      color={color}
      {...props}
    />
  )
}

export { Icon, iconColorVariants, iconSizes }
