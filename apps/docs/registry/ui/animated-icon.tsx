"use client"

import * as React from "react"

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
  size?: number
  duration?: number
  isAnimated?: boolean
  color?: string
}

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
  ...props
}: AnimatedIconProps) {
  return (
    <Glyph
      ref={ref}
      data-slot="animated-icon"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      {...props}
    />
  )
}

export { AnimatedIcon }
