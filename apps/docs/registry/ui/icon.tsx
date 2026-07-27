import * as React from "react"
import type { LucideIcon, LucideProps } from "lucide-react"

const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const

export type IconSize = keyof typeof iconSizes

export interface IconProps extends Omit<
  LucideProps,
  "aria-hidden" | "aria-label" | "role" | "size"
> {
  /** Lucide icon component to render. */
  icon: LucideIcon
  /** Named size token or an exact pixel size. @default "md" */
  size?: IconSize | number
  /** Accessible name. Omit it when the icon is purely decorative. */
  label?: string
}

/** A small, accessible adapter for the Lucide icons used throughout wui. */
function Icon({ icon: Glyph, size = "md", label, ...props }: IconProps) {
  const resolvedSize = typeof size === "number" ? size : iconSizes[size]

  return (
    <Glyph
      data-slot="icon"
      size={resolvedSize}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
      {...props}
    />
  )
}

export { Icon, iconSizes }
