"use client"

import * as React from "react"
import { ReactLenis, type LenisProps } from "lenis/react"
import type { LenisOptions } from "lenis"

export interface SmoothScrollProps extends Omit<LenisProps, "options"> {
  /** Content rendered inside the Lenis context or custom scroll container. */
  children?: React.ReactNode
  /** Lenis instance options. */
  options?: LenisOptions
  /** Disable interpolation while preserving the content wrapper. @default false */
  disabled?: boolean
  /** Respect the operating system reduced-motion preference. @default true */
  respectReducedMotion?: boolean
}

/** Provides Lenis smooth scrolling for the document or a custom container. */
function SmoothScroll({
  children,
  root = true,
  options,
  disabled = false,
  respectReducedMotion = true,
  className,
  ...props
}: SmoothScrollProps) {
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    if (!respectReducedMotion) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [respectReducedMotion])

  if (disabled || reduceMotion) {
    return root ? (
      <>{children}</>
    ) : (
      <div className={className} {...props}>
        {children}
      </div>
    )
  }

  return (
    <ReactLenis
      root={root}
      className={className}
      options={{ autoRaf: true, ...options }}
      {...props}
    >
      {children}
    </ReactLenis>
  )
}

export { SmoothScroll }
