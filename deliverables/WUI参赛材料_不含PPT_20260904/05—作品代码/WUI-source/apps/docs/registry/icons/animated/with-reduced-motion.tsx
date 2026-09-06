"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import type { AnimatedIconHandle, AnimatedIconProps } from "./types"

/**
 * Keeps vendored ItsHover icons static when the user requests reduced motion,
 * without modifying the upstream SVG and animation source files.
 */
function withReducedMotion<Props extends AnimatedIconProps>(
  Icon: React.ForwardRefExoticComponent<
    Props & React.RefAttributes<AnimatedIconHandle>
  >
) {
  function ReducedMotionIcon(
    props: Props & { ref?: React.Ref<AnimatedIconHandle> }
  ) {
    const { ref, ...iconProps } = props
    const label = props["aria-label"]
    const reduceMotion = useReducedMotion()
    const iconRef = React.useRef<AnimatedIconHandle>(null)

    React.useImperativeHandle(
      ref,
      () => ({
        startAnimation: () => {
          if (!reduceMotion) iconRef.current?.startAnimation()
        },
        stopAnimation: () => {
          if (!reduceMotion) iconRef.current?.stopAnimation()
        },
      }),
      [reduceMotion]
    )

    return (
      <span
        data-reduced-motion={reduceMotion || undefined}
        className={
          reduceMotion ? "inline-flex [&>*]:pointer-events-none" : "contents"
        }
        aria-hidden={label ? undefined : true}
        aria-label={label}
        role={label ? "img" : undefined}
      >
        <Icon ref={iconRef} {...(iconProps as Props)} />
      </span>
    )
  }

  return ReducedMotionIcon
}

export { withReducedMotion }
