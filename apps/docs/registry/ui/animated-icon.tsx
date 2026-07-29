"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

export interface AnimatedIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

export interface AnimatedIconGlyphProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | "color"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragStart"
> {
  /** Icon dimensions in pixels. @default 24 */
  size?: number
  /** Optional animation duration in seconds, when supported by the glyph. */
  duration?: number
  /** Whether the glyph should animate, when supported by the glyph. */
  isAnimated?: boolean
  /** Semantic text color token. @default "default" */
  variant?: AnimatedIconColor
  /** Custom CSS/SVG color. Overrides the semantic color when provided. */
  color?: string
}

const animatedIconColorVariants = {
  default: "text-foreground",
  primary: "text-primary",
  secondary: "text-secondary-foreground",
  muted: "text-muted-foreground",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
} as const

export type AnimatedIconColor = keyof typeof animatedIconColorVariants

export type AnimatedIconGlyph = React.ForwardRefExoticComponent<
  AnimatedIconGlyphProps & React.RefAttributes<AnimatedIconHandle>
>

export interface AnimatedIconProps extends AnimatedIconGlyphProps {
  /** Path-animated icon imported from `@animateicons/react/lucide`. */
  icon: AnimatedIconGlyph
  /** Accessible name. Omit it when the icon is purely decorative. */
  label?: string
  /** Imperative playback handle exposed by the animated glyph. */
  ref?: React.Ref<AnimatedIconHandle>
}

/**
 * A common accessible adapter for path-animated icons from AnimateIcons.
 * Every glyph keeps its own semantic motion and imperative playback handle.
 */
function AnimatedIcon({
  icon: Glyph,
  label,
  ref,
  variant = "default",
  className,
  color,
  ...props
}: AnimatedIconProps) {
  return (
    <Glyph
      ref={ref}
      data-slot="animated-icon"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cn(
        color === undefined ? animatedIconColorVariants[variant] : undefined,
        className
      )}
      color={color}
      {...props}
    />
  )
}

export { AnimatedIcon, animatedIconColorVariants }
